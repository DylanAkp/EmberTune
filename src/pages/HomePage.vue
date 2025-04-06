<template>
  <div class="welcome-container">
    <div class="charts-container">
      <h2 class="section-title">{{ t('home.trending') }}</h2>
      <div v-if="error" class="error">{{ error }}</div>
      <div class="charts-grid">
        <template v-if="loading">
          <SongCard
            v-for="n in 100"
            :key="n"
            skeleton
            title=""
            artist=""
            :thumbnail="[{ url: '', width: 0 }]"
            id=""
          />
        </template>
        <template v-else>
          <SongCard
            v-for="song in chartMusic"
            :key="song.id"
            :title="song.title"
            :thumbnail="song.thumbnails"
            :artist="song.artists[0].name"
            :id="song.id"
          />
        </template>
      </div>
    </div>

    <div v-if="favorites.length > 0" class="favorites-container">
      <h2 class="section-title">{{ t('home.favorites') }}</h2>
      <div class="favorites-grid">
        <SongCard
          v-for="song in favorites"
          :key="song.id"
          :title="song.title"
          :thumbnail="song.thumbnails"
          :artist="formatArtists(song)"
          :id="song.id"
        />
      </div>
    </div>

    <div v-if="history.length > 0" class="history-container">
      <h2 class="section-title">{{ t('home.recentlyPlayed') }}</h2>
      <div class="history-grid">
        <SongCard
          v-for="song in history"
          :key="song.id"
          :title="song.title"
          :thumbnail="song.thumbnails"
          :artist="formatArtists(song)"
          :id="song.id"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import SongCard from '../components/SongCard.vue'
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '../stores/settings'
import { usePlaylistStore } from '../stores/playlist'

const { t } = useI18n()
const settingsStore = useSettingsStore()
const playlistStore = usePlaylistStore()
const chartMusic = ref([])
const history = ref([])
const favorites = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const charts = await window.youtube.getCharts(settingsStore.contentLanguage)
    chartMusic.value = charts.musics
  } catch (err) {
    error.value = err.message || 'Failed to load charts'
  } finally {
    loading.value = false
  }

  const historyPlaylist = playlistStore.playlists.find((p) => p.id === 'history')
  if (historyPlaylist) {
    history.value = historyPlaylist.songs
  }

  const favoritesPlaylist = playlistStore.playlists.find((p) => p.id === 'liked-songs')
  if (favoritesPlaylist) {
    favorites.value = favoritesPlaylist.songs
  }
})

function formatArtists(song) {
  if (typeof song.artist === 'string') return song.artist

  if (song.artists && typeof song.artists === 'object' && !Array.isArray(song.artists)) {
    if (song.artists.artist) return song.artists.artist
    if (song.artists.artists) song.artists = song.artists.artists
  }

  if (!song.artists) return t('common.unknownArtist')
  if (Array.isArray(song.artists)) {
    return song.artists
      .map((artist) => {
        if (typeof artist === 'string') return artist
        return artist.name
      })
      .join(', ')
  }
  return t('common.unknownArtist')
}
</script>

<style lang="scss" scoped>
.welcome-container {
  height: 100%;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0px;
}

.charts-container,
.history-container,
.favorites-container {
  width: 100%;
  padding-bottom: 10px;
}

.section-title {
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-color);
}

.charts-grid,
.history-grid,
.favorites-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 15px;
  padding-bottom: 15px;
  width: 100%;
}

.loading,
.error {
  text-align: center;
  padding: 20px;
  color: var(--text-color);
  font-size: 1.1rem;
}
</style>
