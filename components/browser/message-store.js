let browser

class MessageStore {
  constructor() {
    this.messages = []
    this._init()
  }

  async _init() {
    if (!browser) {
      browser = await import('webextension-polyfill')
    }
  }

  async load() {
    await this._init()
    if (!browser.storage) return
    const {messages} = await browser.storage.local.get(['messages'])
    return true
  }

  async save() {
    await this._init()
    if (!browser.storage) return
    await browser.storage.local.set({messages: this.messages})
    return true
  }
}

export default MessageStore
export let messageStore = new MessageStore()