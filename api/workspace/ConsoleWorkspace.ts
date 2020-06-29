import ConsoleChannel from '../channel/ConsoleChannel'
import ConsoleError from '../ConsoleError'
import Client from '../client/Client'
import ClientFileStore from '../storage/ClientFileStore'
import { FileStore, FileStoreConstructor } from '../storage/FileStore'

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
      return new ClientFileStore({
        path: this.localPath,
        client: this.client.constrain('files'),
      })
    }
  }

  async loadConfig() {
    const resp = await this.fileStore.get({ path: 'workspace.json' })
    if (resp.ok) {
      this.config = resp.body
    } else {
      this.config = defaultConfig
      await this.fileStore.put({ path: 'workspace.json', value: this.config })
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

  static getDefaultConfig() {
    return {
      name: 'workspace',
    }
  }

  static getClientConfig() {
    const useIpc = typeof window !== 'undefined' ? 'rco' in window : false
    const adapter = useIpc ? 'ipc' : 'fetch'
    const apiBaseUrl = useIpc
      ? ''
      : process.env.NEXT_PUBLIC_API_BASE ||
        new URL('/api', new URL('/', window.location.href).href).href
    return {
      adapter,
      apiBaseUrl,
      localPath: './workspace',
    }
  }

  static getWorkspace(config?: WorkspaceConfig) {
    const configValue = {
      ...this.getDefaultConfig(),
      ...config,
      ...this.getClientConfig(),
    }
    console.log({ configValue })
    const { name } = configValue
    if (!(name in ConsoleWorkspace.workspaces)) {
      ConsoleWorkspace.workspaces[name] = new ConsoleWorkspace(configValue)
    }
    return ConsoleWorkspace.workspaces[name]
  }
}

export default ConsoleWorkspace
