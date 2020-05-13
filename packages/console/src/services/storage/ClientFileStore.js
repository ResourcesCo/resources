import fetch from 'isomorphic-unfetch'
import actions from './actions'

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
    const absolutePath = this.getAbsolutePath(path)
    await fsPromises.writeFile(absolutePath, JSON.stringify(value, null, 2))
    return {}
  }

  async delete({ path }) {
    const absolutePath = this.getAbsolutePath(path)
    await fsPromises.unlink(absolutePath)
    return {}
  }

  async run({ action, ...params }) {
    return await this.actions[action]({ ...params, fileStore: this })
  }
}

export default ClientFileStore
