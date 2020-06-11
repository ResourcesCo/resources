import shortid from 'shortid'
import ClientFileStore from '../storage/ClientFileStore'
import ConsoleError from '../../ConsoleError'
import App from '../app/App'
import parseArgs from '../app/parseArgs'
import parseUrl from '../app/parseUrl'
import asana from '../../apps/asana/Asana'

class ConsoleChannel {
  constructor({ name, apps, files }) {
    this.name = name
    this.config = { apps, files }
    this.messages = {}
    this.messageIds = []
    this.environments = { default: {} }
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
      asana: await App.get({ app: asana }),
    }
    this.routes = []
    for (const [appName, app] of Object.entries(this.apps)) {
      for (const route of app.routes) {
        this.routes.push(route)
      }
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
      for (const route of this.routes) {
        if (!host === !route.host || host === route.host) {
          const match = route.match(path)
          if (match) {
            if (route.action === action) {
              const { any: discard, ...actionParams } = match.params
              if (route.params.length === params.length) {
                let i = 0
                for (const name of route.params) {
                  actionParams[name] = params[i]
                  i++
                }
                return { handler: route.app, params: actionParams }
              } else {
                return {
                  error: `Expected ${route.params.length} parameter${
                    route.params.length === 1 ? '' : 's'
                  }, got ${params.length}`,
                }
              }
            }
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
