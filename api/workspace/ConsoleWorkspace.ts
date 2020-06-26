import fetch from 'isomorphic-unfetch'
import ConsoleChannel from '../channel/ConsoleChannel'
import ConsoleError from '../ConsoleError'
import Client from '../client/Client'

const defaultConfig = { channels: { main: { apps: ['api-finder'] } } }

interface WorkspaceConfig {
  name: string
  localPath: string
  apiBaseUrl: string
  adapter: 'fetch' | 'ipc'
}

class ConsoleWorkspace implements WorkspaceConfig {
  name: string
  localPath: string
  apiBaseUrl: string
  adapter: 'fetch' | 'ipc'

  channels: any
  config: any
  client: Client

  static LocalFileStore: any

  static workspaces = {}

  constructor({ name, localPath, apiBaseUrl, adapter }: WorkspaceConfig) {
    this.name = name
    this.localPath = localPath
    this.apiBaseUrl = apiBaseUrl
    this.adapter = adapter
    this.channels = {}
    this.client = new Client({
      adapter: this.adapter,
      baseUrl: this.apiBaseUrl,
    })
  }

  async loadConfig() {
    if (typeof window === 'undefined') {
      try {
        const data = await ConsoleWorkspace.LocalFileStore.readFile(
          this.localPath + '/workspace.json'
        )
        this.config = JSON.parse(data)
      } catch (err) {
        this.config = defaultConfig
      }
    } else {
      const response = await this.client.request({
        method: 'POST',
        url: '',
        body: {
          name: name,
          localPath: this.localPath,
          apiBaseUrl: this.apiBaseUrl,
          adapter: this.adapter,
        },
      })
      const { workspaceConfig } = response.body
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

  static getDefaultConfig(): WorkspaceConfig {
    const useIpc = typeof window !== 'undefined' ? 'rco' in window : false
    const adapter = useIpc ? 'ipc' : 'fetch'
    const apiBaseUrl = useIpc ? '' : process.env.API_BASE || '/api'
    return {
      name: 'main',
      adapter,
      apiBaseUrl,
      localPath: '.',
    }
  }

  static getWorkspace(config?: WorkspaceConfig) {
    const configValue = config || this.getDefaultConfig()
    const { name } = configValue
    if (!(name in ConsoleWorkspace.workspaces)) {
      ConsoleWorkspace.workspaces[name] = new ConsoleWorkspace(configValue)
    }
    return ConsoleWorkspace.workspaces[name]
  }
}

export default ConsoleWorkspace
