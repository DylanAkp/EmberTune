import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import os from 'node:os'
import './ipc/youtube'
import { fileURLToPath } from 'node:url'
import { initializeDiscordRPC, updatePresence, clearPresence } from './discord-rpc'
import dotenv from 'dotenv'

dotenv.config()

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

const currentDir = fileURLToPath(new URL('.', import.meta.url))

let mainWindow

async function createWindow() {
  mainWindow = new BrowserWindow({
    icon: path.resolve(currentDir, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    minWidth: 960,
    minHeight: 600,
    useContentSize: true,
    autoHideMenuBar: true,
    title: 'EmberTune',
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(
        currentDir,
        path.join(
          process.env.QUASAR_ELECTRON_PRELOAD_FOLDER,
          'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION,
        ),
      ),
    },
  })

  if (process.env.DEV) {
    await mainWindow.loadURL(process.env.APP_URL)
  } else {
    await mainWindow.loadFile('index.html')
  }

  if (!process.env.DEBUGGING) {
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Initialize Discord RPC when the app is ready
app.whenReady().then(async () => {
  await createWindow()
  await initializeDiscordRPC()
})

// Set up IPC handlers for Discord Rich Presence
ipcMain.handle('discord:update-presence', async (event, activity) => {
  await updatePresence(activity)
})

ipcMain.handle('discord:clear-presence', async () => {
  await clearPresence()
})

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
