// This is a modified version of https://github.com/sindresorhus/electron-serve/
// Original copyright notice:

// MIT License

// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import electron from 'electron'

const stat = promisify(fs.stat)

// See https://cs.chromium.org/chromium/src/net/base/net_error_list.h
const FILE_NOT_FOUND = -6

const getPath = async path_ => {
  try {
    const result = await stat(path_)

    if (result.isFile()) {
      return path_
    }

    if (result.isDirectory()) {
      return getPath(path.join(path_, 'index.html'))
    }
  } catch (_) {}
}

export default function(options) {
  options = Object.assign(
    {
      scheme: 'app',
    },
    options
  )

  if (!options.directory) {
    throw new Error('The `directory` option is required')
  }

  options.directory = path.resolve(electron.app.getAppPath(), options.directory)

  const handler = async (request, callback) => {
    const indexPath = path.join(options.directory, 'index.html')
    const filePath = path.join(
      options.directory,
      decodeURIComponent(new URL(request.url).pathname)
    )
    const resolvedPath = await getPath(filePath)

    if (
      resolvedPath ||
      !path.extname(filePath) ||
      path.extname(filePath) === '.html'
    ) {
      callback({
        path: resolvedPath || indexPath,
      })
    } else {
      callback({ error: FILE_NOT_FOUND })
    }
  }

  electron.protocol.registerSchemesAsPrivileged([
    {
      scheme: options.scheme,
      privileges: {
        standard: true,
        secure: true,
        allowServiceWorkers: true,
        supportFetchAPI: true,
        corsEnabled: true,
      },
    },
  ])

  electron.app.on('ready', () => {
    const session = options.partition
      ? electron.session.fromPartition(options.partition)
      : electron.session.defaultSession

    session.protocol.registerFileProtocol(options.scheme, handler)
  })

  return async window_ => {
    await window_.loadURL(`${options.scheme}://workspace.local`)
  }
}
