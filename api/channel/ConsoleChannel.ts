import shortid from 'shortid'
import Client from '../client/Client'
import ConsoleError from '../ConsoleError'
import ClientFileStore from '../storage/ClientFileStore'
import { FileStore, FileStoreConstructor } from '../storage/FileStore'
import App from '../app-base/App'
import parseArgs from '../app-base/parseArgs'
import parseUrl from '../app-base/parseUrl'
import Asana from '../apps/asana/Asana'
import GitHub from '../apps/github/GitHub'
import Test from '../apps/test/Test'
import env from './env'

const apps = {
  asana: Asana,
  github: GitHub,
  test: Test,
}

class ConsoleChannel {
  name: string
  config: { apps: any; files: any }
  messages: any
  messageIds: any[]
  files: any
  env: { [key: string]: any }
  apps: { [key: string]: App }
  client: Client

  static LocalFileStore: FileStoreConstructor | null = null

  constructor({ name, apps, files }) {
    this.name = name
    this.config = { apps, files }
    this.messages = {}
    this.messageIds = []
  }

  async init() {
    this.client = new Client({
      adapter: 'fetch',
      baseUrl: '',
    })
    if (this.config.files) {
      if (typeof window !== 'undefined') {
        // this.files = new ClientFileStore(this.config.files)
      } else {
        // this.files = new ConsoleChannel.LocalFileStore(this.config.files)
      }
    }
    await this.loadEnv()
    await this.loadApps()
  }

  async loadEnv() {
    let envData = {}
    if (typeof window !== 'undefined') {
      const item = window.localStorage.getItem(`channels/${this.name}/env`)
      if (typeof item === 'string' && item.length > 0) {
        envData = JSON.parse(item)
      }
    }
    this.env = {}
    for (const appName of Object.keys(apps)) {
      envData[appName] = envData[appName] || {}
      this.env[appName] = env(envData[appName], this.saveEnv)
    }
  }

  saveEnv = async () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        `channels/${this.name}/env`,
        JSON.stringify(this.env, null, 2)
      )
    }
  }

  async loadApps() {
    this.apps = {}
    const appNames = Object.keys(apps)
    const loadedApps = await Promise.all(
      appNames.map(appName =>
        App.get({ app: apps[appName], env: this.env[appName] })
      )
    )
    for (let i = 0; i < loadedApps.length; i++) {
      this.apps[appNames[i]] = loadedApps[i]
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
          if ('error' in result) {
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
    const { url: urlArg, action: actionArg, params } = parseArgs(parsed)

    const routeMatch = await this.route({
      url: urlArg,
      action: actionArg,
      params,
    })
    if (routeMatch && 'error' in routeMatch) {
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
      const {} = routeMatch
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
      if ('handler' in routeMatch) {
        const result = await this.dispatchAction(routeMatch.handler, {
          url: routeMatch.url,
          action: isBackgroundAction
            ? formData.actionName
            : 'action' in routeMatch
            ? routeMatch.action
            : undefined,
          params: 'params' in routeMatch ? routeMatch.params : {},
          parentMessage,
        })
        if ('resourceType' in routeMatch) {
          result.resourceType = routeMatch.resourceType
        }
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
