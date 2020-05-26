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
    if (!absolutePath.endsWith('.json')) {
      throw new Error('Unsupported file type', { status: 422 })
    }
    return absolutePath
  }

  async get({ path }) {
    const absolutePath = this.getAbsolutePath(path)
    const data = await fsPromises.readFile(absolutePath)

    return {
      contentType: 'application/json',
      body: JSON.parse(data),
    }
  }

  async put({ path, value }) {
    const absolutePath = this.getAbsolutePath(path)
    await fsPromises.writeFile(
      absolutePath,
      JSON.stringify(value, null, 2) + '\n'
    )
    return {}
  }

  async delete({ path }) {
    const absolutePath = this.getAbsolutePath(path)
    await fsPromises.unlink(absolutePath)
    return {}
  }
}

LocalFileStore.readFile = fsPromises.readFile

export default LocalFileStore
