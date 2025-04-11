import { app, BrowserWindow, ipcMain, shell, globalShortcut } from 'electron'
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
let overlayWindow
let overlayShortcutEnabled = false

async function createWindow() {
  mainWindow = new BrowserWindow({
    icon: path.resolve(currentDir, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    minWidth: 960,
    minHeight: 600,
    useContentSize: true,
    frame: false,
    title: 'EmberTune',
    webPreferences: {
      contextIsolation: true,
      backgroundThrottling: false,
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

  mainWindow.on('maximize', () => {
    if (mainWindow) mainWindow.webContents.send('window:maximized-change', true)
  })

  mainWindow.on('unmaximize', () => {
    if (mainWindow) mainWindow.webContents.send('window:maximized-change', false)
  })

  if (process.env.DEV) {
    await mainWindow.loadURL(process.env.APP_URL)
  } else {
    await mainWindow.loadFile('index.html')
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

async function createOverlayWindow() {
  overlayWindow = new BrowserWindow({
    width: 400,
    height: 70,
    transparent: true,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    roundedCorners: false,
    x: 10,
    y: 10,
    webPreferences: {
      contextIsolation: true,
      backgroundThrottling: false,
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
    await overlayWindow.loadURL(`${process.env.APP_URL}/#/overlay`)
  } else {
    await overlayWindow.loadFile('index.html', { hash: 'overlay' })
  }

  overlayWindow.hide()
}

// Register the embertune:// protocol
function registerProtocolHandler() {
  try {
    if (!app.isDefaultProtocolClient('embertune')) {
      app.setAsDefaultProtocolClient('embertune')
    }
  } catch (error) {
    console.error('Error registering protocol handler:', error)
  }
}

// Call the registration function
registerProtocolHandler()

// Handle second instance with protocol activation
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine) => {
    // Focus the main window
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()

      const deepLinkArg = commandLine.find(
        (arg) => arg.includes('embertune://') || arg.includes('embertune:/'),
      )

      if (deepLinkArg) {
        handleDeepLink(deepLinkArg)
      }
    }
  })
}

// MacOS Support
app.on('open-url', (event, url) => {
  event.preventDefault()
  handleDeepLink(url)
})

// Parse deeplink and extract song ID
function handleDeepLink(url) {
  if (!url || typeof url !== 'string') return

  try {
    // Extract embertune://play/songId pattern
    const match = url.match(/embertune:\/\/play\/([a-zA-Z0-9_-]+)/)

    if (match && match[1]) {
      const songId = match[1]
      if (mainWindow) {
        mainWindow.webContents.send('deeplink:play', songId)
      }
    }
  } catch (error) {
    console.error('Error processing deeplink:', error)
  }
}

app.whenReady().then(async () => {
  await createWindow()
  await createOverlayWindow()
  await initializeDiscordRPC()

  registerOverlayShortcut()

  const deepLinkArg = process.argv.find(
    (arg) => arg.includes('embertune://') || arg.includes('embertune:/'),
  )

  if (deepLinkArg) {
    setTimeout(() => {
      handleDeepLink(deepLinkArg)
    }, 500)
  }
})

function registerOverlayShortcut() {
  globalShortcut.unregister('Alt+E')

  if (overlayShortcutEnabled) {
    globalShortcut.register('Alt+E', () => {
      if (overlayWindow) {
        if (overlayWindow.isVisible()) {
          overlayWindow.hide()
        } else {
          overlayWindow.show()
        }
      }
    })
  }
}

// Set up IPC handlers for Discord Rich Presence
ipcMain.handle('discord:update-presence', async (event, activity) => {
  await updatePresence(activity)
})

ipcMain.handle('discord:clear-presence', async () => {
  await clearPresence()
})

// Set up IPC handler for opening external links
ipcMain.handle('shell:open-external', async (event, url) => {
  await shell.openExternal(url)
})

// Window control handlers for custom titlebar
ipcMain.handle('window:minimize', () => {
  if (mainWindow) mainWindow.minimize()
  return true
})

ipcMain.handle('window:maximize', () => {
  if (mainWindow) mainWindow.maximize()
  return true
})

ipcMain.handle('window:restore', () => {
  if (mainWindow) mainWindow.unmaximize()
  return true
})

ipcMain.handle('window:close', () => {
  if (mainWindow) {
    if (overlayWindow) {
      overlayWindow.close()
    }
    mainWindow.close()
  }
  return true
})

ipcMain.handle('window:isMaximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false
})

ipcMain.handle('overlay:update-song', async (event, songInfo) => {
  if (overlayWindow && overlayWindow.isVisible()) {
    overlayWindow.webContents.send('song:update', songInfo)
  }
})

ipcMain.handle('overlay:set-shortcut-enabled', async (event, enabled) => {
  overlayShortcutEnabled = enabled
  registerOverlayShortcut()
  return true
})

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll()
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
