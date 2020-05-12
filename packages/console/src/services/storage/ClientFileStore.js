import fetch from 'isomorphic-unfetch'

class ClientFileStore {
  constructor({ url }) {
    this.url = url
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
}

export default ClientFileStore
