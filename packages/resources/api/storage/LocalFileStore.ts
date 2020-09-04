import { promises as fsPromises } from 'fs'
import { FileStore, FileStoreResponse } from './FileStore'
import ConsoleError from '../ConsoleError'
import { dirname } from 'path'
import * as path from 'path'

const { readFile, writeFile, mkdir, unlink } = fsPromises

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
    return absolutePath
  }

  getFilePath(path: string): string {
    const absolutePath = this.getPath(path)
    if (!absolutePath.endsWith('.json')) {
      throw new ConsoleError('Unsupported file type', { status: 422 })
    }
    return absolutePath
  }

  async get({ path }) {
    const absolutePath = this.getFilePath(path)
    let data
    try {
      data = await readFile(absolutePath)
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
    const absolutePath = this.getFilePath(path)
    try {
      await writeFile(absolutePath, JSON.stringify(value, null, 2) + '\n')
    } catch (err) {
      if (err.code === 'ENOENT') {
        try {
          const dir = dirname(absolutePath)
          await mkdir(dir, { recursive: true })
        } catch (err) {
          return {
            ok: false,
            error: {
              message: 'Error creating directory',
            },
          }
        }
        try {
          await writeFile(absolutePath, JSON.stringify(value, null, 2) + '\n')
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
    const absolutePath = this.getFilePath(path)
    await unlink(absolutePath)
    return { ok: true }
  }

  constrain(subpath) {
    return new LocalFileStore({ path: this.getPath(subpath) })
  }
}

export default LocalFileStore
