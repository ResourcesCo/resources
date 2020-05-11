import fetch from 'isomorphic-unfetch'
const fsPromises = require('fs').promises
import ConsoleChannel from '../channel/ConsoleChannel'
import ConsoleError from '../../ConsoleError'

class ConsoleWorkspace {
  constructor({ location, isServer, isClient }) {
    this.location = location
    this.isServer = isServer
    this.isClient = isClient
    this.channels = {}
  }

  async loadConfig() {
    if (this.isServer) {
      const data = await fsPromises.readFile(this.location + '/workspace.json')
      this.config = JSON.parse(data)
    } else if (this.isClient) {
      const response = await fetch(this.location)
      const data = await response.json()
      const { workspaceConfig } = data
      this.config = workspaceConfig
    }
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

  async getClientConfig() {
    if (!this.config) {
      await this.loadConfig()
    }
    return this.config
  }
}

ConsoleWorkspace.workspaces = {}

ConsoleWorkspace.getWorkspace = options => {
  const defaultOptions = {
    location: typeof window !== 'undefined' ? '/api' : '.',
    isClient: typeof window !== 'undefined',
    isServer: typeof window == 'undefined',
  }
  const { isServer, isClient, location } = options || defaultOptions

  if (!location) {
    throw new Error('no location')
  }
  if (!(location in ConsoleWorkspace.workspaces)) {
    ConsoleWorkspace.workspaces[location] = new ConsoleWorkspace({
      isServer: isServer || false,
      isClient: isClient || false,
      location,
    })
  }
  return ConsoleWorkspace.workspaces[location]
}

export default ConsoleWorkspace
