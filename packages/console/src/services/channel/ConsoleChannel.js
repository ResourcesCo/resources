import shortid from 'shortid'
import ClientFileStore from '../storage/ClientFileStore'
import LocalFileStore from '../storage/LocalFileStore'
import { splitPath, joinPath } from 'vtv'

class ConsoleChannel {
  constructor({ name, files }) {
    this.name = name
    if (typeof window != 'undefined') {
      this.files = new ClientFileStore(files)
    } else {
      this.files = new LocalFileStore(files)
    }
    this.messages = {}
    this.messageIds = []
  }

  async runCommand({ message, parsed, onMessage, formData }) {
    // TODO: remove once this handles data passed as first parameter
    if (!/^\s*\w/.test(parsed[0].substr(0, 10))) {
      return
    }

    const resourcePath = splitPath(parsed[0])
    if (resourcePath[0] === 'files') {
      let action = null
      if (formData && formData.action === 'runAction') {
        action = formData.actionName
      }

      const messageId = shortid()
      if (!action) {
        onMessage({
          type: 'input',
          text: message,
          commandId: messageId,
          loading: true,
        })
      }
      const result = await this.files.run({
        action: 'get',
        path: resourcePath.slice(1),
        args: parsed.slice(1),
      })
      onMessage(
        [
          {
            ...result,
            commandId: messageId,
            message: joinPath(resourcePath),
          },
          { type: 'loaded', commandId: messageId },
        ].filter(value => value)
      )
      return result
    }
  }

  async getClientConfig({ apiBaseUrl }) {
    return {
      files: {
        url: `${apiBaseUrl}/channels/${this.name}/files`,
        path: this.files.path,
      },
    }
  }
}

export default ConsoleChannel
