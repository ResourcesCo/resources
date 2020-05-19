import shortid from 'shortid'
import ClientFileStore from '../storage/ClientFileStore'
import LocalFileStore from '../storage/LocalFileStore'
import ConsoleError from '../../ConsoleError'
import { splitPath, joinPath } from 'vtv'

class ConsoleChannel {
  constructor({ name, files }) {
    this.name = name
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
    if (resourcePath[0] === 'files' && this.files) {
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
