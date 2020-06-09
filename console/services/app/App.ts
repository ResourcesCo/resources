import Provider from './Provider'

// /channel/apps/add asana <api-token>
// /channel/apps/add asana <api-token> as:client-asana
// /close https://app.asana.com/0/1138929626133616/1177203200389571
// /comment https://app.asana.com/0/1138929626133616/1177203200389571 "done!"
// for task that is only in client-asana
// /client-asana/close https://app.asana.com/0/1138143243423432/1123439392834213323

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
