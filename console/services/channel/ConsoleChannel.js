import shortid from 'shortid'
import ClientFileStore from '../storage/ClientFileStore'
import ConsoleError from '../../ConsoleError'
import App from '../app/App'
import parseArgs from '../app/parseArgs'
import parseUrl from '../app/parseUrl'
import Asana from '../../apps/asana/Asana'
import GitHub from '../../apps/github/GitHub'
import env from './env'

class ConsoleChannel {
  constructor({ name, apps, files }) {
    this.name = name
    this.config = { apps, files }
    this.messages = {}
    this.messageIds = []
    this.env = {
      asana: env({}, this.updateEnv),
      github: env({}, this.updateEnv),
    }
  }

  updateEnv = () => {
    console.log('update env')
  }

  async init() {
    if (this.config.files) {
      if (typeof window !== 'undefined') {
        this.files = new ClientFileStore(this.config.files)
      } else {
        this.files = new ConsoleChannel.LocalFileStore(this.config.files)
      }
    }
    this.apps = {
      //apiFinder: await App.get({ app: apiFinder }),
      asana: await App.get({ app: Asana, env: this.env.asana }),
      github: await App.get({ app: GitHub, env: this.env.github }),
    }
  }

  async dispatchAction(handler, params) {
    try {
      const result = await handler.run(params)
      return result
    } catch (e) {
      if (e instanceof ConsoleError) {
        if (e.data && e.data.consoleMessage) {
          return e.data.consoleMessage
        } else {
          return { type: 'error', text: `Error: ${e.message}` }
        }
      } else {
        throw e
      }
    }
  }

  async route({ url, action, params }) {
    if (/^\/files(\/|$)/.test(url) && this.files) {
      return { handler: this.files, url: url.substr('/files'.length) }
    } else if (url) {
      const { host, path } = parseUrl(url)
      for (const app of Object.values(this.apps)) {
        const result = await app.route({ host, path, action, params })
        if (result) {
          if (result.error) {
            return result
          } else {
            return { handler: app, url, ...result }
          }
        }
      }
    }
  }

  async runCommand({
    message,
    parsed,
    onMessage,
    parentMessage,
    parentMessageId,
    formData,
  }) {
    const { url, action, params } = parseArgs(parsed)

    const routeMatch = await this.route({ url, action, params })
    if (routeMatch && typeof routeMatch.error === 'string') {
      const messageId = shortid()
      onMessage({
        type: 'input',
        text: message,
        commandId: messageId,
      })
      onMessage({
        type: 'error',
        text: routeMatch.error,
        commandId: messageId,
      })
      return true
    } else if (routeMatch) {
      const { handler, url: actionUrl, params: actionParams } = routeMatch
      const isBackgroundAction = formData && formData.action === 'runAction'

      const messageId = shortid()
      if (!isBackgroundAction) {
        onMessage({
          type: 'input',
          text: message,
          commandId: messageId,
          loading: true,
        })
      } else {
        onMessage({
          type: 'form-status',
          commandId: messageId,
          parentCommandId: parentMessageId,
          loading: true,
        })
      }
      const result = await this.dispatchAction(handler, {
        url: actionUrl,
        action: isBackgroundAction ? formData.actionName : action,
        params: actionParams,
        parentMessage,
      })
      onMessage(
        [
          result && {
            ...result,
            commandId: messageId,
            message: parsed[0],
          },
          {
            type: 'loaded',
            commandId: isBackgroundAction ? parentMessageId : messageId,
          },
        ].filter(value => value)
      )
      return true
    }
  }

  async getClientConfig({ apiBaseUrl }) {
    return this.files
      ? {
          files: {
            url: `${apiBaseUrl}/channels/${this.name}/files`,
            path: this.files.path,
          },
        }
      : {}
  }
}

export default ConsoleChannel
