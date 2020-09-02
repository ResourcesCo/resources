// This is a modified version of https://github.com/sindresorhus/electron-serve/
// Original copyright notice:

// MIT License
//
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import fs from 'fs'
import { join, extname } from 'path'
import { promisify } from 'util'
import electron from 'electron'

const stat = promisify(fs.stat)

// See https://cs.chromium.org/chromium/src/net/base/net_error_list.h
const FILE_NOT_FOUND = -6

const getPath = async path => {
  try {
    const result = await stat(path)

    if (result.isFile()) {
      return path
    }

    if (result.isDirectory()) {
      return getPath(join(path, 'index.html'))
    }
  } catch (_) {}
}

export default function({ directory }) {
  const handler = async (request, callback) => {
    const indexPath = join(directory, 'index.html')
    const filePath = join(
      directory,
      decodeURIComponent(new URL(request.url).pathname)
    )
    const resolvedPath = await getPath(filePath)

    if (resolvedPath || !extname(filePath) || extname(filePath) === '.html') {
      callback({
        statusCode: 200,
        data: fs.createReadStream(resolvedPath || indexPath),
      })
    } else {
      callback({
        statusCode: 404,
      })
    }
  }

  electron.protocol.registerSchemesAsPrivileged([
    {
      scheme: 'resourcesco',
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
    electron.session.defaultSession.protocol.registerStreamProtocol(
      'resourcesco',
      handler
    )
  })

  return async window_ => {
    await window_.loadURL(`resourcesco://workspace.local`)
  }
}
