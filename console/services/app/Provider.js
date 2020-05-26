import Action from './Action'

export default class Provider {
  constructor({ app, name, path, actions }) {
    this.app = app
    this.name = name
    this.path = path
    this.actions = {}
    for (const [actionName, action] of Object.entries(actions)) {
      this.actions[actionName] = new Action({
        ...action,
        name: actionName,
        provider: this,
      })
    }
  }

  run(params) {
    this.app.run({ ...params, provider: this })
  }
}
