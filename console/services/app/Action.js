export default class Action {
  constructor({ provider, name, args, autorun }) {
    this.provider = provider
    this.name = name
    this.args = args
    this.autorun = autorun
  }

  async run(params) {
    this.provider.run({ ...params, action: this })
  }
}
