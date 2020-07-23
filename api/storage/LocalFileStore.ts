import fs from 'fs'
import path from 'path'
import { FileStore, FileStoreResponse } from './FileStore'
import ConsoleError from '../ConsoleError'
import { dirname } from 'path'

const fsPromises = fs.promises
const pathPosix = path.posix

class LocalFileStore implements FileStore {
  absolutePath: string

  constructor({ path }: { path: string }) {
    this.absolutePath = pathPosix.resolve(path)
  }

  getPath(path: string): string {
    const absolutePath = pathPosix.resolve(
      this.absolutePath,
      path.startsWith('/') ? `.${path}` : path
    )
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
        try {
          const dir = dirname(absolutePath)
          await fsPromises.mkdir(dir, { recursive: true })
        } catch (err) {
          return {
            ok: false,
            error: {
              message: 'Error creating directory',
            },
          }
        }
        try {
          await fsPromises.writeFile(
            absolutePath,
            JSON.stringify(value, null, 2) + '\n'
          )
        } catch (err) {
          return {
            ok: false,
            error: {
              message: 'Error writing file after creating directory',
            },
          }
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
    return { ok: true }
  }

  async delete({ path }) {
    const absolutePath = this.getPath(path)
    await fsPromises.unlink(absolutePath)
    return { ok: true }
  }

  constrain(subpath) {
    return new LocalFileStore({ path: this.getPath(subpath) })
  }
}

export default LocalFileStore
