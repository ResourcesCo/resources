const fsPromises = require('fs').promises
import ConsoleChannel from '../channel/ConsoleChannel'
import ConsoleError from '../../ConsoleError'

class ConsoleWorkspace {
  constructor({ path }) {
    this.path = path
    this.channels = {}
  }

  async loadConfig() {
    const data = await fsPromises.readFile(this.path + 'workspace.json')
    this.config = JSON.parse(data)
  }

  async getChannel(name) {
    if (!this.config) {
      await this.loadConfig()
    }
    if (!(name in this.channels)) {
      if (!(name in this.config.channels)) {
        throw new ConsoleError('Not found', { status: 404 })
      }
      return new ConsoleChannel({ name, ...this.config.channels[name] })
    }
    return this.channels[name]
  }
}

ConsoleWorkspace.workspaces = {}

ConsoleWorkspace.getWorkspace = path => {
  if (!(path in ConsoleWorkspace.workspaces)) {
    ConsoleWorkspace.workspaces[path] = new ConsoleWorkspace({ path })
  }
  return ConsoleWorkspace.workspaces[path]
}

export default ConsoleWorkspace
