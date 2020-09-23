import createId from './createId'
import Client from '../client/Client'
import ConsoleError from '../ConsoleError'
import { FileStore } from '../storage/FileStore'
import App from '../app-base/App'
import parseArgs from '../app-base/parseArgs'
import parseUrl from '../app-base/parseUrl'
import apps, { apiOnlyApps } from '../apps'
import env from './env'
import { createNanoEvents, Emitter } from 'nanoevents'
import produce from 'immer'
import { uniq } from 'lodash'
import toArray from '../app-base/util/message/toArray'

// Properties stored and managed by the workspace (a channel cannot set itself to be admin)
export interface ChannelProps {
  name: string
  admin: boolean
}

// Configuration from the workspace
export interface ChannelClientConfig extends ChannelProps {
  client: Client
  fileStore: FileStore
  apiOnly?: boolean
}

class ConsoleChannel {
  clientConfig: ChannelClientConfig
  config?: { name?: string; displayName?: string; apps?: any; files?: any } = {}
  messages: { [key: string]: object }
  messageIds: string[]
  messagesLoaded: boolean
  files: any
  env: { [key: string]: any }
  apps: { [key: string]: App }
  client: Client
  emitter: Emitter
  messageSavePromise?: Promise<boolean>

  constructor(clientConfig: ChannelClientConfig) {
    this.clientConfig = clientConfig
    this.client = clientConfig.client
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
    if (this.clientConfig.apiOnly !== false) {
      await this.loadMessages()
    }
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
      this.messages = { ...this.messages, ...resp.body.messages }
      this.messageIds = uniq(resp.body.messageIds.concat(this.messageIds))
    }
    if (resp.error?.code === 'not_found') {
      const messageId = createId()
      this.messages = {
        [messageId]: {
          messages: [
            {
              type: 'text',
              text:
                'Welcome to Resouces.co console. Type :help and expand the intro node to get started.',
            },
          ],
        },
      }
      this.messageIds = [messageId]
    }
    if (resp.ok || resp.error?.code === 'not_found') {
      this.messagesLoaded = true
    }
  }

  saveMessagesToStore = async () => {
    try {
      if (this.messagesLoaded) {
        await this.fileStore.put({
          path: 'messages.json',
          value: { messageIds: this.messageIds, messages: this.messages },
        })
      }
      return true
    } catch (e) {
      return false
    }
  }

  async saveMessagesToStoreAndDelay(duration) {
    const result = await this.saveMessagesToStore()
    const delay = new Promise((resolve) =>
      setTimeout(() => resolve(true), duration)
    )
    await delay
    return result
  }

  saveMessages = async () => {
    if (this.messageSavePromise) {
      const promise = this.messageSavePromise
      await promise
      // if another call to saveMessages hasn't already called save again
      if (this.messageSavePromise === promise) {
        this.messageSavePromise = this.saveMessagesToStoreAndDelay(200)
      }
    } else {
      this.messageSavePromise = this.saveMessagesToStoreAndDelay(200)
    }
  }

  async loadApp(apps, appName) {
    return await App.get({
      app: apps[appName],
      env: this.env[appName],
      ...(appName === 'channel' && { channel: this }),
    })
  }

  async loadApps() {
    const appsToLoad = this.clientConfig.apiOnly === true ? apiOnlyApps : apps
    this.apps = {}
    const appNames = Object.keys(appsToLoad)
    const loadedApps = await Promise.all(
      appNames.map((appName) => this.loadApp(appsToLoad, appName))
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
    parentMessage = undefined,
    parentMessageId = undefined,
    formData = undefined,
  }) {
    const { url: urlArg, action: actionArg, params } = parseArgs(parsed)

    const messageId = createId()

    const routeMatch = await this.route({
      url: urlArg,
      action: actionArg,
      params,
    })
    if (routeMatch && 'error' in routeMatch) {
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
    } else if (routeMatch) {
      const {} = routeMatch
      const isBackgroundAction = formData && formData.action === 'runAction'

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
        const handleMessage = (message) => {
          onMessage({
            ...message,
            commandId: messageId,
            parentCommandId: parentMessageId,
          })
        }

        let runWithApi
        if (
          process.env.NEXT_PUBLIC_BROWSER_STORAGE !== 'true' &&
          'action' in routeMatch
        ) {
          runWithApi = async ({ parentMessage, formData }) => {
            const resp = await this.client.request({
              url: `.${urlArg}`,
              method: 'POST',
              body: {
                action: actionArg,
                params: params,
                parentMessage,
                formData,
              },
            })
            return resp.body
          }
        }
        let result = await this.dispatchAction(routeMatch.handler, {
          url: routeMatch.url,
          resourceType: 'resourceType' in routeMatch && routeMatch.resourceType,
          action:
            isBackgroundAction && routeMatch.handler === this.files
              ? formData.actionName
              : 'action' in routeMatch
              ? routeMatch.action
              : undefined,
          params: 'params' in routeMatch ? routeMatch.params : {},
          parentMessage,
          formData,
          onMessage: handleMessage,
          runWithApi,
        })
        let resultMessages = toArray(result).map((resultMessage) =>
          produce(resultMessage, (draft) => {
            if ('resourceType' in routeMatch) {
              draft.resourceType = routeMatch.resourceType
            }
            draft.commandId = messageId
            if (draft.type === 'message-command') {
              draft.parentCommandId = parentMessageId
            }
            draft.message = message
          })
        )
        onMessage(
          [
            ...resultMessages,
            {
              type: 'loaded',
              commandId: isBackgroundAction ? parentMessageId : messageId,
            },
          ].filter((value) => value)
        )
      }
    } else if ([urlArg, actionArg].some((v) => v !== null && v !== undefined)) {
      onMessage({
        type: 'input',
        text: message,
        commandId: messageId,
      })
      onMessage({
        type: 'error',
        text: 'Command not found.',
        commandId: messageId,
      })
    } else {
      const input = parsed.map((s) => {
        try {
          return JSON.parse(s)
        } catch (e) {
          return s
        }
      })
      onMessage({
        type: 'input',
        text: message.substr(0, 40) + (message.length > 40 ? '…' : ''),
        commandId: messageId,
      })
      onMessage({
        type: 'tree',
        value: {
          input: input.length === 1 ? input[0] : input,
        },
        commandId: messageId,
        state: {
          _showOnly: ['input'],
          input: {
            _expanded: true,
          },
        },
      })
    }
  }

  async runApiCommand({ url, action, params, parentMessage, formData }) {
    const routeMatch = await this.route({ url, action, params })
    let messages: any[] = []
    if ('handler' in routeMatch && 'action' in routeMatch) {
      const message = await this.dispatchAction(routeMatch.handler, {
        url: routeMatch.url,
        resourceType: 'resourceType' in routeMatch && routeMatch.resourceType,
        action: routeMatch.action,
        params: 'params' in routeMatch ? routeMatch.params : {},
        parentMessage,
        formData,
        onMessage: (message) => (messages = [...messages, message]),
      })
      messages = [...messages, message]
    }

    return { messages }
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
