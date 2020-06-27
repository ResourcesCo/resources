const fsPromises = require('fs').promises
const pathPosix = require('path').posix
import { FileStore, FileStoreResponse } from './FileStore'
import ConsoleError from '../ConsoleError'

class LocalFileStore implements FileStore {
  absolutePath: string

  constructor({ path }: { path: string }) {
    this.absolutePath = pathPosix.resolve(path)
  }

  getAbsolutePath(path) {
    const absolutePath = pathPosix.resolve(this.absolutePath, path)
    if (!absolutePath.startsWith(this.absolutePath)) {
      throw new ConsoleError('Invalid path', { status: 400 })
    }
    if (!absolutePath.endsWith('.json')) {
      throw new ConsoleError('Unsupported file type', { status: 422 })
    }
    return absolutePath
  }

  async get({ path }) {
    const absolutePath = this.getAbsolutePath(path)
    const data = await fsPromises.readFile(absolutePath)

    return {
      ok: true,
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
    return { ok: true }
  }

  async delete({ path }) {
    const absolutePath = this.getAbsolutePath(path)
    await fsPromises.unlink(absolutePath)
    return { ok: true }
  }

  constrain(subpath) {
    return new LocalFileStore(this.getAbsolutePath(subpath))
  }
}

export default LocalFileStore
