import Provider from './Provider'

export interface AppSpec {
  name: string
  defaultProvider?: string
  providers: {
    [key: string]: {
      path: string[]
      defaultAction?: string
      actions: {
        [key: string]: {
          args: string[]
          match: {
            type: string
            host: string
            path: string
          }
        }
      }
    }
  }
  run(props: {
    path?: string[]
    url?: string
    action?: string
    params?: object
  }): object
}

export default class App {
  name: string
  providers: { [key: string]: Provider }
  onRun: Function

  constructor({ name, providers, run }: AppSpec) {
    this.name = name
    this.providers = {}
    this.onRun = run
    for (const [providerName, provider] of Object.entries(providers)) {
      this.providers[providerName] = new Provider({
        ...provider,
        name: providerName,
        app: this,
      })
    }
  }

  async run({ provider, action, ...params }) {
    return await this.onRun({ action: action.name, ...params })
  }

  static async get({ app: appBuilder }) {
    const appSpec = await appBuilder()
    return new App(appSpec)
  }
}
