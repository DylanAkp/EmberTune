/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.js you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('youtube', {
  searchSongs: (query, country) => ipcRenderer.invoke('searchSongs', query, country),
  download: (id) => ipcRenderer.invoke('download', id),
  getSong: (id) => ipcRenderer.invoke('getSong', id),
  getRelatives: (id) => ipcRenderer.invoke('getRelatives', id),
  getLyrics: (id) => ipcRenderer.invoke('getLyrics', id),
  getCharts: (country) => ipcRenderer.invoke('getCharts', country),
})

contextBridge.exposeInMainWorld('discord', {
  updatePresence: (activity) => ipcRenderer.invoke('discord:update-presence', activity),
  clearPresence: () => ipcRenderer.invoke('discord:clear-presence'),
})

contextBridge.exposeInMainWorld('shell', {
  openExternal: (url) => ipcRenderer.invoke('shell:open-external', url),
})

// Expose deeplink functionality
contextBridge.exposeInMainWorld('deeplink', {
  onPlayRequest: (callback) => {
    ipcRenderer.removeAllListeners('deeplink:play')

    ipcRenderer.on('deeplink:play', (event, songId) => {
      if (callback && typeof callback === 'function') {
        callback(songId)
      } else {
        console.error('Preload: Callback is not a function')
      }
    })
  },
})

// Add window control functionality for custom titlebar
contextBridge.exposeInMainWorld('windowControls', {
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  restore: () => ipcRenderer.invoke('window:restore'),
  close: () => ipcRenderer.invoke('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  onMaximizeChange: (callback) => {
    ipcRenderer.removeAllListeners('window:maximized-change')
    ipcRenderer.on('window:maximized-change', (_, isMaximized) => callback(isMaximized))
  },
})
