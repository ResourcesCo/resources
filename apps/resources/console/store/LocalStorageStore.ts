import throttle from 'lodash/throttle'

const storageKey = 'messages'

class Store {
  storeLoaded = false

  commandIds = [] // TODO: remove
  commands = {} // TODO: remove
  env = {} // TODO: remove
  theme: string = 'dark'
  notes: object = {}
  storedKeys = ['commandIds', 'commands', 'env', 'theme', 'notes']

  async load() {
    if (this.storeLoaded) return true
    let data = {}
    const str = window.localStorage.getItem(storageKey)
    if (typeof str === 'string' && str.length > 0) {
      data = JSON.parse(str)
    }
    for (let key of this.storedKeys) {
      if (data[key]) {
        this[key] = data[key]
      }
    }
    this.storeLoaded = true
    return true
  }

  save = throttle(async () => {
    const data = {}
    for (let key of this.storedKeys) {
      data[key] = this[key]
    }
    window.localStorage.setItem(storageKey, JSON.stringify(data))
  }, 50)
}

export default Store
export let store = new Store()
