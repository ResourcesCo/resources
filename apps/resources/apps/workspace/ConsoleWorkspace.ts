import ConsoleChannel, { ChannelProps } from '../channel/ConsoleChannel'
import ConsoleError from '../ConsoleError'
import Client from '../client/Client'
import ClientFileStore from '../storage/ClientFileStore'
import { FileStore, FileStoreConstructor } from '../storage/FileStore'
import BrowserFileStore from '../storage/BrowserFileStore'
import { createNanoEvents, Emitter } from 'nanoevents'

interface WorkspaceConfig {
  name: string
  displayName?: string
  channels: {
    [key: string]: ChannelProps
  }
  theme: string
}

interface WorkspaceClientConfig {
  name: string
  localPath: string
  apiBaseUrl: string
  adapter: 'fetch' | 'ipc'
  fileStoreClass?: FileStoreConstructor
  apiOnly?: boolean
}

const defaultChannels = {
  general: {
    name: 'general',
    admin: false,
  },
  admin: {
    name: 'admin',
    admin: true,
  },
}

class ConsoleWorkspace {
  clientConfig: WorkspaceClientConfig
  config?: WorkspaceConfig

  channels: any
  client: Client
  fileStore: FileStore

  emitter: Emitter

  static workspaces = {}

  constructor(clientConfig: WorkspaceClientConfig) {
    this.clientConfig = clientConfig

    this.channels = {}
    this.client = this.getClient()
    this.fileStore = this.getFileStore()
    this.emitter = createNanoEvents()
  }

  getClient() {
    return new Client({
      adapter: this.clientConfig.adapter,
      baseUrl: this.clientConfig.apiBaseUrl,
    })
  }

  getFileStore() {
    if (this.clientConfig.fileStoreClass) {
      return new this.clientConfig.fileStoreClass({
        path: this.clientConfig.localPath,
      })
    } else if (
      typeof window !== 'undefined' &&
      process.env.NEXT_PUBLIC_BROWSER_STORAGE === 'true'
    ) {
      return new BrowserFileStore({ path: '/' })
    } else {
      return new ClientFileStore({
        path: this.clientConfig.localPath,
        client: this.client.constrain('files'),
      })
    }
  }

  async init() {
    await this.loadConfig()
  }

  async loadConfig() {
    const resp = await this.fileStore.get({ path: 'workspace.json' })
    if (resp.ok && Object.keys(resp.body?.channels || {}).length > 0) {
      this.config = resp.body
      if (!this.config.theme) {
        this.config.theme = 'dark'
        await this.saveConfig()
      }
    } else {
      this.config = {
        name: this.clientConfig.name,
        channels: defaultChannels,
        theme: 'dark',
      }
      await this.saveConfig()
    }
  }

  async saveConfig() {
    const res = await this.fileStore.put({
      path: 'workspace.json',
      value: this.config,
    })
    if (!res.ok) {
      console.error('error saving workspace config', res.error)
    }
  }

  async getChannel(name) {
    if (!(name in this.channels)) {
      if (!(name in this.config.channels)) {
        throw new ConsoleError('Not found', { status: 404 })
      }
      this.channels[name] = new ConsoleChannel({
        name,
        admin: this.config.channels[name].admin,
        client: this.client.constrain(`channels/${name}`),
        fileStore: this.fileStore.constrain(`channels/${name}`),
        apiOnly: this.clientConfig.apiOnly,
      })
      await this.channels[name].init()
    }
    return this.channels[name]
  }

  get theme() {
    return this.config.theme
  }

  set theme(value) {
    this.config.theme = value
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

  static getClientConfig(): WorkspaceClientConfig {
    const useIpc = process.env.NEXT_PUBLIC_ELECTRON === 'true'
    const adapter = useIpc ? 'ipc' : 'fetch'
    const currentUrl =
      typeof window !== 'undefined'
        ? window.location.href
        : 'https://workspace.local/'
    const apiBaseUrl = useIpc
      ? 'https://workspace.local/api'
      : process.env.NEXT_PUBLIC_API_BASE ||
        new URL('/api', new URL('/', currentUrl).href).href
    return {
      adapter,
      apiBaseUrl,
      localPath: './workspace',
      name: 'workspace',
    }
  }

  static async getWorkspace(
    config?:
      | WorkspaceClientConfig
      | { fileStoreClass: FileStoreConstructor; localPath?: string }
  ) {
    const configValue = {
      ...this.getClientConfig(),
      ...config,
    }
    const { name } = configValue
    if (!(name in ConsoleWorkspace.workspaces)) {
      ConsoleWorkspace.workspaces[name] = new ConsoleWorkspace(configValue)
      await ConsoleWorkspace.workspaces[name].init()
    }
    return ConsoleWorkspace.workspaces[name]
  }
}

export default ConsoleWorkspace
