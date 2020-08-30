import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import serve from './serve'
import Ipc from './ipc'

// eval is useful for highly customizable apps
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1'

app.allowRendererProcessReuse = true

if (!app.isPackaged) {
  require('electron-reloader')(module, { ignore: ['packages'] })
}

const loadURL = serve({ directory: path.resolve(__dirname, '..', 'renderer') })

async function init() {
  await app.whenReady()

  new Ipc(app, ipcMain)

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
