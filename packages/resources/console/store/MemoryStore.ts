import { throttle } from 'lodash-es'

const storageKey = 'messages'

class Store {
  storeLoaded = false

  commandIds = [] // TODO: remove
  commands = {} // TODO: remove
  env = {} // TODO: remove
  theme: string = 'dark'
  notes: object = {}
  storedKeys = ['commandIds', 'commands', 'env', 'theme', 'notes']

  load() {}

  save() {}
}

export default Store
export let store = new Store()
