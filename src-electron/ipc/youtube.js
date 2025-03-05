import { get, download, search } from 'ytmusic_api_unofficial'
import { ipcMain } from 'electron'

ipcMain.handle('searchSongs', async (event, query) => {
  try {
    const response = await search(query, 'SONG')
    return JSON.parse(JSON.stringify(response))
  } catch (error) {
    console.error('Search Error:', error)
    throw error
  }
})

ipcMain.handle('download', async (event, id) => {
  try {
    return JSON.parse(JSON.stringify(await download(id, 'webm')))
  } catch (error) {
    console.error('Download Error:', error)
    throw error
  }
})

ipcMain.handle('getSong', async (event, id) => {
  try {
    const song = await get(id)
    return JSON.parse(JSON.stringify(song))
  } catch (error) {
    console.error('Get Song Error:', error)
    throw error
  }
})

ipcMain.handle('getRelatives', async (event, id) => {
  try {
    const music = await get(id)
    const relatives = await music.getRadioPlaylist()
    return JSON.parse(JSON.stringify(relatives))
  } catch (error) {
    console.error('Get Relatives Error:', error)
    throw error
  }
})
