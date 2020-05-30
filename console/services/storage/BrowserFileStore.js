import ConsoleError from '../../ConsoleError'

class BrowserFileStore {
  constructor({ prefix }) {
    this.localStorage = window.LocalStorage
    this.prefix = prefix
  }

  getItemName(path) {
    if (path.endsWith('.json')) {
      return `${prefix}${path}`
    } else {
      throw new ConsoleError('unsupported file type')
    }
  }

  async get({ path }) {
    const data = this.localStorage.getItem(this.getItemName(path))
    try {
      return JSON.parse(data)
    } catch (e) {
      throw new ConsoleError('error parsing JSON')
    }
  }

  async put({ path, value }) {
    this.localStorage.setItem(
      this.getItemName(path),
      JSON.stringify(value, null, 2)
    )
  }

  async delete({ path }) {
    this.localStorage.removeItem(this.getItemName(path))
  }
}

export default BrowserFileStore
