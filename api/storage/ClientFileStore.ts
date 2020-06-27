import fetch from 'isomorphic-unfetch'
import actions from './actions'
import { FileStore, FileStoreResponse } from './FileStore'
import ConsoleError from '../ConsoleError'

class ClientFileStore implements FileStore {
  url: string
  actions: { [key: string]: Function }

  constructor({ path }: { path: string }) {
    this.url = path
    this.actions = actions
  }

  getAbsoluteUrl(path) {
    const baseUrl = new URL(this.url).href
    const url = new URL(baseUrl + '/' + path).href
    if (url.startsWith(baseUrl)) {
      return url
    } else {
      throw new ConsoleError('Invalid path')
    }
  }

  async get({ path }) {
    // TODO: use client
    const response = await fetch(this.getAbsoluteUrl(path))
    const data = await response.json()

    return data
  }

  async put({ path, value }) {
    const response = await fetch(`${this.url}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentType: 'application/json', value }),
    })
    return {
      ok: true,
    }
  }

  async delete({ path }) {
    const response = await fetch(`${this.url}${path}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
    return { ok: true }
  }

  async run({ action, ...params }) {
    if (typeof this.actions[action || 'get'] === 'function') {
      return await this.actions[action || 'get']({ ...params, fileStore: this })
    } else {
      throw new ConsoleError('Unknown action')
    }
  }

  constrain(subpath) {
    return new ClientFileStore({ path: this.getAbsoluteUrl(subpath) })
  }
}

export default ClientFileStore
