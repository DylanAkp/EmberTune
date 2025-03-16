import { charts } from 'ytmusic_api_unofficial'
import {addMusicsToCache, get, search} from './../utils/ytRequests.js';
import { ipcMain } from 'electron'

ipcMain.handle('getCharts', async (event, country) => {
  try {
    if (!country) {
      country = 'US'
    }
    const results = await charts(country)
    return JSON.parse(JSON.stringify(results))
  } catch (error) {
    console.error('Get Charts Error:', error)
    throw error
  }
})
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
    const song = await get(id)
    return JSON.parse(JSON.stringify(await song.download('webm')))
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
    relatives.musics.shift()
    addMusicsToCache(relatives.musics)
    return JSON.parse(JSON.stringify(relatives)).musics
  } catch (error) {
    console.error('Get Relatives Error:', error)
    throw error
  }
})

ipcMain.handle('getLyrics', async (event, id) => {
  try {
    const song = await get(id)
    const lyrics = await song.getLyrics()
    return JSON.parse(JSON.stringify(lyrics))
  } catch (error) {
    console.error('Get Lyrics Error:', error)
    throw error
  }
})
