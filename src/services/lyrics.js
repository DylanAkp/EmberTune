import axios from 'axios'

const LRC_API_BASE_URL = 'https://lrclib.net/api'

export const lyricsService = {
  async getSyncedLyrics(trackName, artistName) {
    try {
      const response = await axios.get(`${LRC_API_BASE_URL}/get`, {
        params: {
          track_name: trackName,
          artist_name: artistName,
          format: 'lrc',
        },
      })

      if (response.data && response.data.syncedLyrics) {
        return response.data.syncedLyrics
      }
      return null
    } catch (error) {
      console.error('Error fetching synced lyrics:', error)
      return null
    }
  },

  parseLRC(lrcContent) {
    if (!lrcContent || typeof lrcContent !== 'string') {
      return []
    }

    const lines = lrcContent.split('\n')
    const lyrics = []

    for (const line of lines) {
      const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/)
      if (match) {
        const [, minutes, seconds, milliseconds, text] = match
        const time = parseInt(minutes) * 60 + parseInt(seconds) + parseInt(milliseconds) / 1000
        lyrics.push({ time, text: text.trim() })
      }
    }

    if (lyrics.length === 0) {
      return []
    }

    return lyrics.sort((a, b) => a.time - b.time)
  },
}
