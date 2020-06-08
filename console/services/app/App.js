import Provider from './Provider'

export default class App {
  constructor({ name, providers, run }) {
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
