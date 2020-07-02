const fsPromises = require('fs').promises
const pathPosix = require('path').posix
import { FileStore, FileStoreResponse } from './FileStore'
import ConsoleError from '../ConsoleError'
import mkdirp from 'mkdirp'
import { dirname } from 'path'

class LocalFileStore implements FileStore {
  absolutePath: string

  constructor({ path }: { path: string }) {
    this.absolutePath = pathPosix.resolve(path)
  }

  getPath(path) {
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
    const absolutePath = this.getPath(path)
    let data
    try {
      data = await fsPromises.readFile(absolutePath)
    } catch (err) {
      if (err.code === 'ENOENT') {
        return {
          ok: false,
          error: {
            message: 'File not found',
            code: 'not_found',
          },
        }
      } else {
        return {
          ok: false,
          error: {
            message: 'Unknown error',
          },
        }
      }
    }

    return {
      ok: true,
      contentType: 'application/json',
      body: JSON.parse(data),
    }
  }

  async put({ path, value }) {
    const absolutePath = this.getPath(path)
    try {
      await fsPromises.writeFile(
        absolutePath,
        JSON.stringify(value, null, 2) + '\n'
      )
    } catch (err) {
      if (err.code === 'ENOENT') {
        await mkdirp(dirname(absolutePath))
        await fsPromises.writeFile(
          absolutePath,
          JSON.stringify(value, null, 2) + '\n'
        )
      } else {
        throw err
      }
    }
    return { ok: true }
  }

  async delete({ path }) {
    const absolutePath = this.getPath(path)
    await fsPromises.unlink(absolutePath)
    return { ok: true }
  }

  constrain(subpath) {
    return new LocalFileStore(this.getPath(subpath))
  }
}

export default LocalFileStore
