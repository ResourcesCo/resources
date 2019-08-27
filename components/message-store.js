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
    if (browser.storage) {
      const {messages} = await storage.get(['messages'])
    } else {
      const str = window.localStorage.getItem('messages')
      if (typeof str === 'string' && str.length > 0) {
        const parsed = JSON.parse(str)
        this.messages = parsed.messages;
      }
    }
    return true
  }

  async save() {
    await this._init()
    if (browser.storage) {
      await browser.storage.local.set({messages: this.messages})
    } else {
      window.localStorage.setItem('messages', JSON.stringify({messages: this.messages}))
    }
  }
}

export default MessageStore
export let messageStore = new MessageStore()