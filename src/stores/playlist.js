import { defineStore } from 'pinia'

export const usePlaylistStore = defineStore('playlist', {
  state: () => ({
    playlists: [],
    currentPlaylist: null,
  }),

  actions: {
    initializeDefaultPlaylist() {
      if (!this.playlists.some((p) => p.isDefault)) {
        const defaultPlaylist = {
          id: 'liked-songs',
          name: 'Liked Songs',
          songs: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          isDefault: true,
        }
        this.playlists.push(defaultPlaylist)
      }

      if (!this.playlists.some((p) => p.id === 'history')) {
        const historyPlaylist = {
          id: 'history',
          name: 'History',
          songs: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          isDefault: true,
        }
        this.playlists.push(historyPlaylist)
      }
    },

    createPlaylist(name) {
      const newPlaylist = {
        id: Date.now().toString(),
        name,
        songs: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      this.playlists.push(newPlaylist)
    },

    deletePlaylist(playlistId) {
      const playlist = this.playlists.find((p) => p.id === playlistId)
      if (playlist?.isDefault) {
        console.warn('Cannot delete default playlist')
        return
      }

      this.playlists = this.playlists.filter((p) => p.id !== playlistId)
      if (this.currentPlaylist?.id === playlistId) {
        this.currentPlaylist = null
      }
    },

    renamePlaylist(playlistId, newName) {
      const playlist = this.playlists.find((p) => p.id === playlistId)
      if (playlist) {
        playlist.name = newName
        playlist.updatedAt = Date.now()
      }

      if (this.currentPlaylist?.id === playlistId) {
        this.currentPlaylist.name = newName
      }
    },

    addSongToPlaylist(playlistId, song) {
      const playlist = this.playlists.find((p) => p.id === playlistId)
      if (playlist) {
        if (!playlist.songs.some((existingSong) => existingSong.id === song.id)) {
          playlist.songs.push(song)
          playlist.updatedAt = Date.now()
        }
      }

      if (this.currentPlaylist?.id === playlistId) {
        if (!this.currentPlaylist.songs.some((existingSong) => existingSong.id === song.id)) {
          this.currentPlaylist.songs.push(song)
        }
      }
    },

    removeSongFromPlaylist(playlistId, songId) {
      const playlist = this.playlists.find((p) => p.id === playlistId)
      if (playlist) {
        playlist.songs = playlist.songs.filter((song) => song.id !== songId)
        playlist.updatedAt = Date.now()
      }

      if (this.currentPlaylist?.id === playlistId) {
        this.currentPlaylist.songs = this.currentPlaylist.songs.filter((song) => song.id !== songId)
      }
    },

    reorderPlaylist(playlistId, fromIndex, toIndex) {
      const playlist = this.playlists.find((p) => p.id === playlistId)
      if (playlist) {
        const newSongs = [...playlist.songs]
        const [movedSong] = newSongs.splice(fromIndex, 1)
        newSongs.splice(toIndex, 0, movedSong)
        playlist.songs = newSongs
        playlist.updatedAt = Date.now()

        if (this.currentPlaylist?.id === playlistId) {
          this.currentPlaylist.songs = [...newSongs]
        }
      }
    },

    setCurrentPlaylist(playlist) {
      this.currentPlaylist = playlist
    },

    addSongToHistory(song) {
      const historyPlaylist = this.playlists.find((p) => p.id === 'history')
      if (historyPlaylist) {
        historyPlaylist.songs = historyPlaylist.songs.filter((s) => s.id !== song.id)
        historyPlaylist.songs.unshift(song)
        if (historyPlaylist.songs.length > 50) {
          historyPlaylist.songs = historyPlaylist.songs.slice(0, 50)
        }
        historyPlaylist.updatedAt = Date.now()
      }
    },
  },

  persist: true,
})
