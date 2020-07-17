import fetch from 'isomorphic-unfetch'
import actions from './actions'
import { FileStore, FileStoreResponse } from './FileStore'
import Client from '../client/Client'
import ConsoleError from '../ConsoleError'

class ClientFileStore implements FileStore {
  path: string
  client: Client
  actions: { [key: string]: Function }

  constructor({ path, client }: { path: string; client: Client }) {
    this.path = path
    this.client = client
    this.actions = actions
  }

  relativePath(path) {
    return path.startsWith('/') ? `.${path}` : path
  }

  async get({ path }) {
    const response = await this.client.request({ url: this.relativePath(path) })
    return response.body
  }

  async put({ path, value }) {
    const response = await this.client.request({
      url: this.relativePath(path),
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: { contentType: 'application/json', value },
    })
    return response.body
  }

  async delete({ path }) {
    const response = await this.client.request({
      url: this.relativePath(path),
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
    return response.body
  }

  async run({ action, ...params }) {
    if (typeof this.actions[action || 'get'] === 'function') {
      return await this.actions[action || 'get']({ ...params, fileStore: this })
    } else {
      throw new ConsoleError('Unknown action')
    }
  }

  constrain(subpath) {
    return new ClientFileStore({
      path: this.path + (this.path.endsWith('/') ? '' : '/') + subpath,
      client: this.client.constrain(subpath),
    })
  }
}

export default ClientFileStore
