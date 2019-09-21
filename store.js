let browser

const storageKey = 'messages'

const defaults = {
  commandIds: [],
  commands: {},
  env: {}
}

const keys = Object.keys(defaults)

class Store {
  constructor() {
    for (let key of keys) {
      this[key] = defaults[key]
    }
    this._init()
  }

  async _init() {
    if (!browser) {
      browser = await import('webextension-polyfill')
    }
  }

  async load() {
    await this._init()
    let data = {}
    if (browser.storage) {
      const result = await storage.get([storageKey])
      if (result[storageKey]) {
        data = result[storageKey]
      }
    } else {
      const str = window.localStorage.getItem(storageKey)
      if (typeof str === 'string' && str.length > 0) {
        data = JSON.parse(str)
      }
    }
    for (let key of keys) {
      if (data[key]) {
        this[key] = data[key]
      }
    }
    return true
  }

  async save() {
    await this._init()
    const data = {}
    for (let key of keys) {
      data[key] = this[key]
    }
    if (browser.storage) {
      await browser.storage.local.set({[storageKey]: data})
    } else {
      window.localStorage.setItem(storageKey, JSON.stringify(data))
    }
  }
}

export default Store
export let store = new Store()
