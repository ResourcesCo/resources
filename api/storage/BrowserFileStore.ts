import ConsoleError from '../ConsoleError'
import { FileStore } from './FileStore'

class BrowserFileStore implements FileStore {
  localStorage: any
  path: string

  constructor({ path }) {
    this.localStorage = window.localStorage
    this.path = path
  }

  getItemName(path) {
    if (path.endsWith('.json')) {
      return `${this.path}${path}`
    } else {
      throw new ConsoleError('unsupported file type')
    }
  }

  async get({ path }) {
    let data = this.localStorage.getItem(this.getItemName(path))
    try {
      data = JSON.parse(data)
    } catch (e) {
      throw new ConsoleError('error parsing JSON')
    }
    return {
      ok: true,
      contentType: 'application/json',
      body: data,
    }
  }

  async put({ path, value }) {
    this.localStorage.setItem(
      this.getItemName(path),
      JSON.stringify(value, null, 2)
    )
    return { ok: true }
  }

  async delete({ path }) {
    this.localStorage.removeItem(this.getItemName(path))
    return { ok: true }
  }
}

export default BrowserFileStore
