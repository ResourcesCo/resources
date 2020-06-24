import fetch from 'isomorphic-unfetch'
import actions from './actions'
import ConsoleError from '../ConsoleError'

class ClientFileStore {
  url: string
  actions: { [key: string]: Function }

  constructor({ url }) {
    this.url = url
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
    return {}
  }

  async delete({ path }) {
    const response = await fetch(`${this.url}${path}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
    return {}
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
