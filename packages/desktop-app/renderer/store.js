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

  async load() {
    // if (this.storeLoaded) return true
    // let data = {}
    // const str = window.localStorage.getItem(storageKey)
    // if (typeof str === 'string' && str.length > 0) {
    //   data = JSON.parse(str)
    // }
    // for (let key of keys) {
    //   if (data[key]) {
    //     this[key] = data[key]
    //   }
    // }
    // this.storeLoaded = true
    // return true
  }

  save = throttle(async () => {
    // const data = {}
    // for (let key of keys) {
    //   data[key] = this[key]
    // }
    // window.localStorage.setItem(storageKey, JSON.stringify(data))
  }, 50)
}

export default Store
export let store = new Store()
