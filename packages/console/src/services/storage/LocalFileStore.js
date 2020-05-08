const fsPromises = require('fs').promises
const pathPosix = require('path').posix
import ConsoleError from '../../ConsoleError'

class LocalFileStore {
  constructor({ path }) {
    this.path = path
    this.absolutePath = pathPosix.resolve(path)
  }

  getAbsolutePath(path) {
    const absolutePath = pathPosix.resolve(this.path, path)
    if (!absolutePath.startsWith(this.absolutePath)) {
      throw new ConsoleError('Invalid path', { status: 400 })
    }
    return absolutePath
  }

  async get({ path }) {
    const absolutePath = this.getAbsolutePath(path)
    if (!absolutePath.endsWith('.json')) {
      throw new Error('Unsupported file type', { status: 422 })
    }
    const data = await fsPromises.readFile(absolutePath)

    return {
      contentType: 'application/json',
      body: JSON.parse(data),
    }
  }

  async put(path, value) {}

  async delete(path) {}
}

export default LocalFileStore
