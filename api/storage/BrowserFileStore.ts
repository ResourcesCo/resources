import ConsoleError from '../ConsoleError'
import { FileStore } from './FileStore'

class BrowserFileStore implements FileStore {
  localStorage: any
  path: string

  constructor({ path }) {
    this.localStorage = window.localStorage
    this.path = new URL(path + '/', 'file:///').href.replace(/^file:\/\//, '')
  }

  getPath(path) {
    const basePath = new URL('file:///' + this.path).href
    return new URL(path, basePath).href.replace(/^file:\/\//, '')
  }

  async get({ path }) {
    let data = this.localStorage.getItem(this.getPath(path))
    try {
      data = JSON.parse(data)
    } catch (e) {
      data = undefined
    }
    if (data) {
      return {
        ok: true,
        contentType: 'application/json',
        body: data,
      }
    } else {
      return {
        ok: false,
        error: {
          message: 'File not found',
          code: 'not_found',
        },
      }
    }
  }

  async put({ path, value }) {
    this.localStorage.setItem(
      this.getPath(path),
      JSON.stringify(value, null, 2)
    )
    return { ok: true }
  }

  async delete({ path }) {
    this.localStorage.removeItem(this.getPath(path))
    return { ok: true }
  }

  constrain(subpath) {
    return new BrowserFileStore({ path: this.getPath(subpath) })
  }
}

export default BrowserFileStore
