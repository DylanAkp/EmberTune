import { defineStore, acceptHMRUpdate } from 'pinia'
import { useSettingsStore } from './settings'
import { usePlaylistStore } from './playlist'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    currentTrack: null,
    isPlaying: false,
    queue: [],
    currentIndex: -1,
    audio: new Audio(),
    volume: 1,
    replayMode: 'disabled',
    isShuffled: false,
  }),

  getters: {
    hasNext: (state) => state.currentIndex < state.queue.length - 1,
    hasPrevious: (state) => state.currentIndex > 0,
  },

  actions: {
    metadata() {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: this.currentTrack.title || 'Unknown',
        artist: this.currentTrack.artist || 'Unknown',
        artwork: [
          {
            src: this.currentTrack.thumbnails[this.currentTrack.thumbnails.length - 1].url,
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      })
      navigator.mediaSession.setActionHandler('play', function () {
        usePlayerStore().togglePlayPause()
      })
      navigator.mediaSession.setActionHandler('pause', function () {
        usePlayerStore().togglePlayPause()
      })
      navigator.mediaSession.setActionHandler('nexttrack', function () {
        usePlayerStore().next()
      })
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        usePlayerStore().previous()
      })
    },
    async updateDiscordPresence() {
      this.metadata()
      const settings = useSettingsStore()
      if (!settings.discordRich || !this.currentTrack) return

      const track = this.currentTrack
      const activity = {
        details: track.title,
        state: `by ${track.artist}`,
        largeImageKey: track.thumbnails[0]?.url || 'idle',
        largeImageText: 'EmberTune',
        smallImageKey: 'embertune_logo',
        smallImageText: this.isPlaying ? 'Playing' : 'Paused',
        startTimestamp: Date.now(),
        buttons: [
          {
            label: 'Listen on EmberTune',
            url: `embertune://play/${track.id}`,
          },
          {
            label: 'Download EmberTune',
            url: 'https://github.com/DylanAkp/EmberTune',
          },
        ],
      }

      if (this.isPlaying) {
        activity.startTimestamp = Date.now()
      }

      await window.discord.updatePresence(activity)
    },
    async play(music, newPlay = false) {
      try {
        if (newPlay) {
          this.queue = []
          this.currentIndex = -1
        }
        let songDetails
        if (typeof music === 'object') {
          songDetails = music
        } else songDetails = await window.youtube.getSong(music)

        // Get song details
        const downloadDetails = await window.youtube.download(songDetails.id)

        // Create a track object
        const track = {
          ...songDetails,
          artist: this.formatArtists(songDetails.artists),
          url: downloadDetails.urlDecoded,
        }

        // Update queue and set current track
        const trackIndex = this.queue.findIndex((t) => t.id === track.id)
        if (trackIndex === -1) {
          this.queue.push(track)
          this.currentIndex = this.queue.length - 1
        } else {
          this.currentIndex = trackIndex
        }

        this.currentTrack = track

        const playlistStore = usePlaylistStore()
        playlistStore.addSongToHistory(track)

        // Handle audio playback first
        if (this.audio?.src) {
          this.audio.pause()
        }

        this.audio.src = track.url
        await this.audio.play()
        this.isPlaying = true

        // Update Discord presence
        await this.updateDiscordPresence()

        // Handle audio ending
        this.audio.onended = () => {
          if (this.replayMode === 'song') {
            this.seekTo(0)
            this.audio.play()
          } else if (this.hasNext) {
            this.next()
          } else if (this.replayMode === 'playlist' && this.queue.length > 0) {
            this.currentIndex = -1
            this.next()
          } else {
            this.isPlaying = false
          }
        }

        // Fetch relatives after playback has started
        if (trackIndex === -1) {
          this.fetchRelatives(track.id).catch((error) => {
            console.error('Error fetching recommendations:', error)
          })
        }
      } catch (error) {
        console.error('Error playing track:', error)
        this.isPlaying = false
      }
    },

    async fetchRelatives(id) {
      let relatives = []
      let retryCount = 0
      const maxRetries = 3

      while (retryCount < maxRetries) {
        relatives = await window.youtube.getRelatives(id)

        if (relatives.length > 1) {
          break
        }

        retryCount++

        if (retryCount < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      }

      if (relatives.length > 1) {
        this.queue.push(...relatives)
      } else {
        console.warn('Failed to fetch enough relatives after maximum retries')
      }
    },

    async pause() {
      if (this.audio?.src) {
        this.audio.pause()
      }
      this.isPlaying = false
      await this.updateDiscordPresence()
    },

    async next() {
      if (!this.hasNext) return
      if (this.isShuffled) {
        const remainingIndices = Array.from({ length: this.queue.length }, (_, i) => i).filter(
          (i) => i !== this.currentIndex,
        )
        if (remainingIndices.length > 0) {
          const randomIndex = Math.floor(Math.random() * remainingIndices.length)
          this.currentIndex = remainingIndices[randomIndex]
        } else {
          this.currentIndex++
        }
      } else {
        this.currentIndex++
      }
      const nextTrack = this.queue[this.currentIndex]
      await this.play(nextTrack)
      await this.updateDiscordPresence()
    },

    async previous() {
      if (!this.hasPrevious) return
      this.currentIndex--
      const prevTrack = this.queue[this.currentIndex]
      await this.play(prevTrack)
    },

    async togglePlayPause() {
      if (!this.currentTrack) return

      if (this.isPlaying) {
        await this.pause()
      } else if (this.audio?.src) {
        await this.audio.play()
        this.isPlaying = true
        await this.updateDiscordPresence()
      } else {
        await this.play(this.currentTrack)
      }
    },

    updateVolume(value) {
      this.volume = value
      if (this.audio) {
        this.audio.volume = value
      }
    },

    seekTo(time) {
      if (this.audio?.src) {
        const newTime = parseFloat(time)
        if (!isNaN(newTime) && isFinite(newTime) && newTime >= 0) {
          this.audio.currentTime = newTime
          return newTime
        }
      }
      return this.audio?.currentTime || 0
    },

    formatArtists(artists) {
      if (!artists.length) return 'Unknown Artist'
      return artists.map((artist) => artist.name).join(', ')
    },

    async playPlaylist(songs) {
      if (!songs || songs.length === 0) return

      // Clear the current queue and reset index
      this.queue = []
      this.currentIndex = -1

      this.queue = songs
      await this.play(this.queue[0])
    },

    toggleReplayMode() {
      const modes = ['disabled', 'song', 'playlist']
      const currentIndex = modes.indexOf(this.replayMode)
      this.replayMode = modes[(currentIndex + 1) % modes.length]
    },

    toggleShuffle() {
      this.isShuffled = !this.isShuffled
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePlayerStore, import.meta.hot))
}
