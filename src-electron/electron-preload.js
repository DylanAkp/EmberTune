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
  searchSongs: (query) => ipcRenderer.invoke('searchSongs', query),
  download: (id) => ipcRenderer.invoke('download', id),
  getSong: (id) => ipcRenderer.invoke('getSong', id),
  getRelatives: (id) => ipcRenderer.invoke('getRelatives', id),
  getLyrics: (id) => ipcRenderer.invoke('getLyrics', id),
})

contextBridge.exposeInMainWorld('discord', {
  updatePresence: (activity) => ipcRenderer.invoke('discord:update-presence', activity),
  clearPresence: () => ipcRenderer.invoke('discord:clear-presence'),
})

contextBridge.exposeInMainWorld('shell', {
  openExternal: (url) => ipcRenderer.invoke('shell:open-external', url),
})
