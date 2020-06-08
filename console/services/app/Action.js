export default class Action {
  constructor({ provider, name, args, match }) {
    this.provider = provider
    this.name = name
    this.args = args
    this.match = match
  }

  async run(params) {
    return await this.provider.run({ ...params, action: this })
  }
}
