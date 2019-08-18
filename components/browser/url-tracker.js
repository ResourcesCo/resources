let browser

class UrlTracker {
  constructor() {
    this.url = null
    this.urls = {}
    this.activeTab = null
    this._init()
  }

  async _init() {
    if (!browser) {
      browser = await import('webextension-polyfill')
    }
  }

  onActivated = async ({tabId}) => {
    this.activeTab = tabId
    if (!this.urls[this.activeTab]) {
      await this.getCurrent()
    }
    await this.update()
  }

  onUpdated = async (tabId, {url}) => {
    if (url) {
      if (tabId == this.activeTab) {
        this.url = url
      }
      this.urls[tabId] = url
    }
    await this.update()
  }

  async getCurrent() {
    const tabs = await browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT})
    if (tabs && tabs.length > 0) {
      const tab = await browser.tabs.get(tabs[0].id)
      if (tab) {
        this.activeTab = tab.id
        this.urls[tab.id] = tab.url
        this.url = tab.url
        return true
      }
    }
  }

  async start() {
    await this._init()
    await this.getCurrent()
    if (!browser.tabs.onActivated.hasListener(this.onActivated)) {
      browser.tabs.onActivated.addListener(this.onActivated)
      browser.tabs.onUpdated.addListener(this.onUpdated)
    }
  }

  stop() {
    browser.tabs.onActivated.removeListener(this.onActivated)
    browser.tabs.onUpdated.removeListener(this.onUpdated)
  }

  addListener(listener) {
    this.listeners = [...this.listeners, listener]
  }

  removeListener(listener) {
    this.listeners = this.listeners.filter(el => el !== listener)
  }

  async update() {
    for (var listener of this.listeners || []) {
      listener()
    }
    await this.save()
  }

  async load() {
    await this._init()
    if (!browser.storage) return
    const {url, urls, activeTab} = await browser.storage.local.get(['url', 'urls', 'activeTab'])
    this.url = url
    if (urls) {
      this.urls = urls
    }
    this.activeTab = activeTab
    return true
  }

  async save() {
    await this._init()
    if (!browser.storage) return
    await browser.storage.local.set({url: this.url, urls: this.urls, activeTab: this.activeTab})
    return true
  }
}

export default UrlTracker
export let urlTracker = new UrlTracker()