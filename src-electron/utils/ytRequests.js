import NodeCache from 'node-cache/index.js'
import ytmusic from 'ytmusic_api_unofficial/dist/index.js'

const MusicCache = new NodeCache()

export const get = async function async(id) {
  return new Promise((resolve, reject) => {
    const music = MusicCache.get(id)
    if (music) return resolve(music)
    else {
      ytmusic
        .get(id)
        .then((song) => {
          MusicCache.set(id, song)
          return resolve(song)
        })
        .catch((error) => {
          reject(error)
        })
    }
  })
}

export const search = async function async(query, filter) {
  return new Promise((resolve, reject) => {
    ytmusic
      .search(query, filter)
      .then((response) => {
        resolve(response)
        response
          .filter((result) => {
            return result.resultType === 'song' || result.resultType === 'video'
          })
          .forEach((result) => {
            MusicCache.set(result.id, result)
          })
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const addMusicsToCache = function async(musics) {
  musics.forEach((music) => {
    MusicCache.set(music.id, music)
  })
}
