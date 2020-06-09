import shortid from 'shortid'
import ClientFileStore from '../storage/ClientFileStore'
import ConsoleError from '../../ConsoleError'
import { isUrl } from 'vtv/model/analyze'
import App from '../app/App'

import apiFinder from '../../apps/api-finder/ApiFinder'

class ConsoleChannel {
  constructor({ name, apps, files }) {
    this.name = name
    this.config = { apps, files }
    this.messages = {}
    this.messageIds = []
  }

  async init() {
    if (this.config.files) {
      if (typeof window !== 'undefined') {
        this.files = new ClientFileStore(this.config.files)
      } else {
        this.files = new ConsoleChannel.LocalFileStore(this.config.files)
      }
    }
    this.apps = { apiFinder: await App.get({ app: apiFinder }) }
    this.providers = {}
    this.matchers = {}
    for (const [appName, app] of Object.entries(this.apps)) {
      for (const [providerName, provider] of Object.entries(app.providers)) {
        if (providerName in this.providers) {
          console.warn(`Provider already declared: ${providerName}`)
        }
        this.providers[providerName] = { app, name: providerName, actions: {} }
        for (const [actionName, action] of Object.entries(provider.actions)) {
          if (action.match?.type === 'url') {
            this.matchers.url = action
          }
        }
      }
    }
  }

  async dispatchAction(resource, params) {
    try {
      const result = await resource.run(params)
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

  async getHandler({ resourcePath, parsed }) {
    if (resourcePath && resourcePath[0] === 'files' && this.files) {
      return this.files
    } else if (!resourcePath && isUrl(parsed[0])) {
      if (this.matchers.url) {
        return this.matchers.url
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
    // TODO: remove once this handles data passed as first parameter
    if (!/^[\w\/]/.test(parsed[0].substr(0, 10))) {
      return
    }
    const resourcePath = parsed[0].startsWith('/')
      ? parsed[0].split('/').slice(1)
      : parsed[0]

    const handler = await this.getHandler({ resourcePath, parsed })
    if (handler) {
      const isBackgroundAction = formData && formData.action === 'runAction'
      const action = isBackgroundAction
        ? formData.actionName
        : parsed.length >= 2
        ? parsed[1]
        : 'get'

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
        action: action || 'get',
        path: Array.isArray(resourcePath) ? resourcePath.slice(1) : undefined,
        url: Array.isArray(resourcePath) ? undefined : parsed[0],
        args: parsed.slice(2),
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
