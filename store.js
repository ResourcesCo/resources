let browser

const storageKey = 'messages'

const defaults = {
  commandIds: [],
  commands: {},
  env: {},
  theme: 'dark',
}

const keys = Object.keys(defaults)

class Store {
  constructor() {
    this.storeLoaded = false
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
    if (this.storeLoaded) return true
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
    this.storeLoaded = true
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
