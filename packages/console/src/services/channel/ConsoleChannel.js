import shortid from 'shortid'
import ClientFileStore from '../storage/ClientFileStore'
import LocalFileStore from '../storage/LocalFileStore'
import ConsoleError from '../../ConsoleError'
import { splitPath, joinPath } from 'vtv'
import { isUrl } from 'vtv/src/model/analyze'
import App from '../app/App'

import apiFinder from 'api-finder'

class ConsoleChannel {
  constructor({ name, apps, files }) {
    this.name = name
    this.config = { apps }
    if (files) {
      if (typeof window != 'undefined') {
        this.files = new ClientFileStore(files)
      } else {
        this.files = new LocalFileStore(files)
      }
    }
    this.messages = {}
    this.messageIds = []
  }

  async init() {
    this.apps = { apiFinder: await App.get({ app: apiFinder }) }
    this.providers = {}
    this.autorun = {}
    for (const [appName, app] of Object.entries(this.apps)) {
      for (const [providerName, provider] of Object.entries(app.providers)) {
        if (providerName in this.providers) {
          console.warn(`Provider already declared: ${providerName}`)
        }
        this.providers[providerName] = { app, name: providerName, actions: {} }
        for (const [actionName, action] of Object.entries(provider.actions)) {
          if (action.autorun?.type === 'url') {
            this.autorun.url = action
          }
        }
      }
    }
  }

  async dispatchCommand(resource, params) {
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
        return { type: 'error', text: 'Error responding to message' }
      }
    }
  }

  async getHandler({ resourcePath, parsed }) {
    if (resourcePath && resourcePath[0] === 'files' && this.files) {
      return this.files
    } else if (!resourcePath && isUrl(parsed[0])) {
      if (this.autorun.url) {
        this.autorun.url.run(parsed[0])
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
    if (!/^\s*\w/.test(parsed[0].substr(0, 10))) {
      return
    }

    const resourcePath = splitPath(parsed[0])
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
      const result = await this.dispatchCommand(this.files, {
        action: action || 'get',
        path: resourcePath.slice(1),
        args: parsed.slice(2),
        parentMessage,
      })
      onMessage(
        [
          result && {
            ...result,
            commandId: messageId,
            message: joinPath(resourcePath),
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
