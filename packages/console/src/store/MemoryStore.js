import throttle from 'lodash/throttle'

const storageKey = 'messages'

const defaults = {
  commandIds: [],
  commands: {},
  env: {},
  theme: 'dark',
  notes: {},
}

const keys = Object.keys(defaults)

class Store {
  constructor() {
    this.storeLoaded = false
    for (let key of keys) {
      this[key] = defaults[key]
    }
  }

  load() {}

  save() {}
}

export default Store
export let store = new Store()
