import shortid from 'shortid'
import Client from '../client/Client'
import ConsoleError from '../ConsoleError'
import { FileStore } from '../storage/FileStore'
import App from '../app-base/App'
import parseArgs from '../app-base/parseArgs'
import parseUrl from '../app-base/parseUrl'
import asana from '../apps/asana/asana'
import github from '../apps/github/github'
import test from '../apps/test/test'
import random from '../apps/random/random'
import requests from '../apps/requests/requests'
import env from './env'
import { createNanoEvents, Emitter } from 'nanoevents'

const apps = {
  asana,
  github,
  test,
  random,
  requests,
}

// Properties stored and managed by the workspace (a channel cannot set itself to be admin)
export interface ChannelProps {
  name: string
  admin: boolean
}

// Configuration from the workspace
export interface ChannelClientConfig extends ChannelProps {
  client: Client
  fileStore: FileStore
}

class ConsoleChannel {
  clientConfig: ChannelClientConfig
  config?: { name?: string; displayName?: string; apps?: any; files?: any } = {}
  messages: any
  messageIds: any[]
  files: any
  env: { [key: string]: any }
  apps: { [key: string]: App }
  client: Client
  emitter: Emitter

  constructor(clientConfig: ChannelClientConfig) {
    this.clientConfig = clientConfig
    this.messages = {}
    this.messageIds = []
    this.emitter = createNanoEvents()
  }

  async init() {
    if (typeof window !== 'undefined') {
      this.files = this.clientConfig.fileStore
    }
    await this.loadConfig()
    await this.loadEnv()
    await this.loadApps()
    await this.loadMessages()
  }

  get fileStore() {
    return this.clientConfig.fileStore
  }

  get admin() {
    return this.clientConfig.admin
  }

  async loadConfig() {
    const resp = await this.fileStore.get({ path: 'channel.json' })
    if (resp.ok) {
      this.config = resp.body
    } else {
      this.config.apps = { asana: {}, github: {} }
      await this.fileStore.put({ path: 'channel.json', value: this.config })
    }
  }

  async loadEnv() {
    let envData = {}
    const resp = await this.fileStore.get({ path: 'env.json' })
    if (resp.ok) {
      envData = resp.body
    }
    this.env = {}
    for (const appName of Object.keys(apps)) {
      envData[appName] = envData[appName] || {}
      this.env[appName] = env(envData[appName], this.saveEnv)
    }
  }

  saveEnv = async () => {
    await this.fileStore.put({ path: 'env.json', value: this.env })
  }

  async loadMessages() {
    let envData = {}
    const resp = await this.fileStore.get({ path: 'messages.json' })
    if (resp.ok) {
      this.messages = resp.body.messages
      this.messageIds = resp.body.messageIds
    } else {
      this.messages = {}
      this.messageIds = []
    }
  }

  saveMessages = async () => {
    await this.fileStore.put({
      path: 'messages.json',
      value: { messageIds: this.messageIds, messages: this.messages },
    })
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
            url: `${apiBaseUrl}/channels/${this.config.name}/files`,
            path: this.files.path,
          },
        }
      : {}
  }
}

export default ConsoleChannel
