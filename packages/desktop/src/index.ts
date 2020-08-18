import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import serve from './serve'
import ConsoleWorkspace from './api/workspace/ConsoleWorkspace'
import ConsoleError from './api/ConsoleError'
import LocalFileStore from './api/storage/LocalFileStore'

// eval is useful for highly customizable apps
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1'

app.allowRendererProcessReuse = true

if (!app.isPackaged) {
  require('electron-reloader')(module, { ignore: ['packages'] })
}

const loadURL = serve({ directory: path.resolve(__dirname, '..', 'renderer') })

async function handleFileRequest(req) {
  try {
    const path = req.path
    const workspace = await ConsoleWorkspace.getWorkspace({
      fileStoreClass: LocalFileStore,
      localPath: app.getPath('userData') + '/workspace',
    })
    let responseBody
    if (req.method === 'GET') {
      responseBody = await workspace.fileStore.get({ path })
    } else if (req.method === 'PUT') {
      if (!(req.body && typeof req.body === 'object' && 'value' in req.body)) {
        throw new ConsoleError('Content must be JSON object with value key', {
          status: 422,
        })
      }
      responseBody = await workspace.fileStore.put({ ...req.body, path })
    } else if (req.method === 'DELETE') {
      responseBody = await workspace.fileStore.delete({ path })
    } else {
      throw new ConsoleError('Invalid method for path', { status: 400 })
    }
    return responseBody
  } catch (err) {
    if (err instanceof ConsoleError) {
      return {
        ok: false,
        status: err.data.status,
        body: err.data,
      }
    } else {
      throw err
    }
  }
}

async function requestWithApi({ url, method, body }) {
  let path = new URL(url, 'https://workspace.local/').pathname
  if (path.startsWith('/api/files')) {
    path = path.replace(/^\/api\/files/, '')
  }
  const fileRes = await handleFileRequest({
    path,
    method,
    body,
  })
  return { status: 200, body: fileRes }
}

async function init() {
  await app.whenReady()

  ipcMain.on('rco.request', async (event, messageId, request) => {
    const response = await requestWithApi(request)
    event.reply('rco.response', messageId, response)
  })

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: '#14191e',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.resolve(__dirname, 'preload.js'),
    },
  })

  await loadURL(mainWindow)
}

init()

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit()
})
