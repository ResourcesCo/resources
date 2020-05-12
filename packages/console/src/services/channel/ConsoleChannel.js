import shortid from 'shortid'
import ClientFileStore from '../storage/ClientFileStore'
import LocalFileStore from '../storage/LocalFileStore'
import { splitPath } from 'vtv'

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

  async runFilesCommand({ path, args }) {
    if (path.length === 0) {
      return {
        type: 'text',
        text: 'List not yet implemented',
      }
    } else {
      let result
      try {
        result = await this.files.get({
          path: '/' + path.map(s => encodeURIComponent(s)).join('/'),
        })
      } catch (err) {
        return {
          type: 'text',
          text: 'Error getting file',
        }
      }
      return {
        type: 'tree',
        name: path[path.length - 1],
        value: result.body,
        state: {},
        message: 'files',
      }
    }
  }

  async runCommand({ message, parsed, onMessage }) {
    // TODO: remove once this handles data passed as first parameter
    if (!/^\s*\w/.test(parsed[0].substr(0, 10))) {
      return
    }

    const resourcePath = splitPath(parsed[0])
    if (resourcePath[0] === 'files') {
      const messageId = shortid()
      onMessage({
        type: 'input',
        text: message,
        commandId: messageId,
        loading: true,
      })
      const result = await this.runFilesCommand({
        path: resourcePath.slice(1),
        args: parsed.slice(1),
      })
      onMessage([
        {
          ...result,
          commandId: messageId,
        },
        { type: 'loaded', commandId: messageId },
      ])
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
