import fetch from 'isomorphic-unfetch'
import actions from './actions'
import { FileStore, FileStoreResponse } from './FileStore'
import ConsoleError from '../ConsoleError'

class ClientFileStore implements FileStore {
  url: string
  actions: { [key: string]: Function }

  constructor({ path }: { path: string }) {
    this.actions = actions
  }

  async get({ path }) {
    const response = await fetch(`${this.url}${path}`)
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
}

export default ClientFileStore
