import ConsoleChannel from '../channel/ConsoleChannel'
import ConsoleError from '../ConsoleError'
import Client from '../client/Client'
import ClientFileStore from '../storage/ClientFileStore'
import { FileStore, FileStoreConstructor } from '../storage/FileStore'

const defaultConfig = { channels: { main: { apps: ['api-finder'] } } }

interface WorkspaceConfig {
  name: string
  localPath: string
  apiBaseUrl: string
  adapter: 'fetch' | 'ipc'
  fileStoreClass?: FileStoreConstructor
}

class ConsoleWorkspace implements WorkspaceConfig {
  name: string
  localPath: string
  apiBaseUrl: string
  adapter: 'fetch' | 'ipc'

  channels: any
  config: any
  client: Client
  fileStore: FileStore

  fileStoreClass: FileStoreConstructor | null = null

  static workspaces = {}

  constructor({
    name,
    localPath,
    apiBaseUrl,
    adapter,
    fileStoreClass,
  }: WorkspaceConfig) {
    this.name = name
    this.localPath = localPath
    this.apiBaseUrl = apiBaseUrl
    this.adapter = adapter
    this.channels = {}
    console.log('apiBaseUrl', apiBaseUrl)
    this.client = new Client({
      adapter: this.adapter,
      baseUrl: this.apiBaseUrl,
    })
    if (fileStoreClass) {
      this.fileStoreClass = fileStoreClass
    }
    this.fileStore = this.getFileStore()
  }

  getFileStore() {
    if (this.fileStoreClass !== null) {
      return new this.fileStoreClass({ path: this.localPath })
    } else {
      return new ClientFileStore({ path: this.localPath, client: this.client })
    }
  }

  getFileStoreClass() {}

  async loadConfig() {
    if (typeof window === 'undefined') {
      try {
        const file = await this.fileStore.get({ path: 'workspace.json' })
        console.log(file.body)
        this.config = file.body
      } catch (err) {
        console.log('Error loading workspace', err)
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
    const apiBaseUrl = useIpc
      ? ''
      : process.env.NEXT_PUBLIC_API_BASE ||
        new URL('/api', new URL('/', window.location.href).href).href
    return {
      name: 'workspace',
      adapter,
      apiBaseUrl,
      localPath: './workspace',
    }
  }

  static getWorkspace(config?: WorkspaceConfig) {
    const configValue = { ...this.getDefaultConfig(), ...config }
    const { name } = configValue
    if (!(name in ConsoleWorkspace.workspaces)) {
      ConsoleWorkspace.workspaces[name] = new ConsoleWorkspace(configValue)
    }
    return ConsoleWorkspace.workspaces[name]
  }
}

export default ConsoleWorkspace
