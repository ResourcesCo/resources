import fetch from 'isomorphic-unfetch'
const fsPromises = require('fs').promises
import ConsoleChannel from '../channel/ConsoleChannel'
import ConsoleError from '../../ConsoleError'

const defaultConfig = { channels: { main: { apps: ['api-finder'] } } }

class ConsoleWorkspace {
  constructor({ location }) {
    this.location = location
    this.channels = {}
  }

  async loadConfig() {
    if (typeof window === 'undefined') {
      try {
        const data = await fsPromises.readFile(
          this.location + '/workspace.json'
        )
        this.config = JSON.parse(data)
      } catch (err) {
        this.config = defaultConfig
      }
    } else {
      const response = await fetch(this.location, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiBaseUrl: this.location }),
      })
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
      this.channels[name] = new ConsoleChannel({
        name,
        ...this.config.channels[name],
      })
      await this.channels[name].init()
    }
    return this.channels[name]
  }

  async getClientConfig(params) {
    if (!this.config) {
      await this.loadConfig()
    }
    const clientConfig = { channels: {} }
    for (const channelName of Object.keys(this.config.channels)) {
      const channel = await this.getChannel(channelName)
      clientConfig.channels[channelName] = await channel.getClientConfig(params)
    }
    return clientConfig
  }
}

ConsoleWorkspace.workspaces = {}

function apiBase() {
  return process.env.API_BASE || '/api'
}

ConsoleWorkspace.getWorkspace = options => {
  const defaultOptions = {
    location: typeof window !== 'undefined' ? apiBase() : '.',
  }
  const { location } = options || defaultOptions

  if (!location) {
    throw new Error('no location')
  }
  if (!(location in ConsoleWorkspace.workspaces)) {
    ConsoleWorkspace.workspaces[location] = new ConsoleWorkspace({
      location,
    })
  }
  return ConsoleWorkspace.workspaces[location]
}

export default ConsoleWorkspace
