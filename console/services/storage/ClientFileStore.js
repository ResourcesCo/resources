import fetch from 'isomorphic-unfetch'
import actions from './actions'
import ConsoleError from '../../ConsoleError'

class ClientFileStore {
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
    const absolutePath = this.getAbsolutePath(path)
    await fsPromises.unlink(absolutePath)
    return {}
  }

  async run({ action, ...params }) {
    if (typeof this.actions[action] === 'function') {
      return await this.actions[action]({ ...params, fileStore: this })
    } else {
      throw new ConsoleError('Unknown action')
    }
  }
}

export default ClientFileStore
