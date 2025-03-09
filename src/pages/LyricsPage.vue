<template>
  <div class="lyrics-container">
    <h1>{{ player.currentTrack?.title || 'No Track Playing' }}</h1>
    <h2 v-if="player.currentTrack">{{ player.currentTrack.artist }}</h2>

    <div v-if="loading" class="loading">Loading lyrics...</div>

    <div v-else-if="lyrics" class="lyrics-content">
      <div v-if="lyrics.lyrics" v-html="formatLyrics(lyrics.lyrics)"></div>
      <div v-else class="no-lyrics">No lyrics available for this track</div>

      <div v-if="lyrics.source" class="lyrics-source">Source: {{ lyrics.source }}</div>
    </div>

    <div v-else class="no-lyrics">
      <p>No lyrics available</p>
    </div>
  </div>
</template>

<script setup>
import { usePlayerStore } from '../stores/player'
import { ref, watch, onMounted } from 'vue'

const player = usePlayerStore()
const lyrics = ref(null)
const loading = ref(false)

const loadLyrics = async (trackId) => {
  if (!trackId) return

  try {
    loading.value = true
    lyrics.value = null
    const result = await window.youtube.getLyrics(trackId)
    lyrics.value = result
  } catch (error) {
    console.error('Failed to load lyrics:', error)
    lyrics.value = null
  } finally {
    loading.value = false
  }
}

const formatLyrics = (text) => {
  if (!text) return ''
  return text.replace(/\n/g, '<br>')
}

watch(
  () => player.currentTrack?.id,
  (newTrackId) => {
    if (newTrackId) {
      loadLyrics(newTrackId)
    } else {
      lyrics.value = null
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (player.currentTrack?.id) {
    loadLyrics(player.currentTrack.id)
  }
})
</script>

<style lang="scss" scoped>
.lyrics-container {
  background-color: var(--tertiary-bg);
  padding: 20px;
  border-radius: 10px;
  h1 {
    line-height: 1;
  }
}

.lyrics-content {
  white-space: pre-wrap;
  font-size: 16px;
  margin-top: 20px;
}

.loading {
  margin-top: 30px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
}

.no-lyrics {
  margin-top: 30px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
}

.lyrics-source {
  margin-top: 30px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}
</style>
