<template>
  <div class="lyrics-container">
    <h1>{{ player.currentTrack?.title || $t('lyrics.noTrack') }}</h1>
    <h2 v-if="player.currentTrack">{{ player.currentTrack.artist }}</h2>

    <div v-if="loading || !player.currentTrack" class="loading">{{ $t('lyrics.loading') }}</div>

    <div v-else-if="syncedLyrics.length > 0" class="lyrics-content">
      <div
        v-for="(line, index) in syncedLyrics"
        :key="index"
        :class="['lyric-line', { active: currentLineIndex === index }]"
        @click="seekTo(line.time)"
        :id="'line-' + index"
      >
        {{ line.text }}
      </div>
    </div>

    <div v-else-if="lyrics">
      <div v-if="lyrics.lyrics" class="lyrics-content" v-html="formatLyrics(lyrics.lyrics)"></div>
      <div v-else class="lyrics-content">{{ $t('lyrics.noLyrics') }}</div>
      <div v-if="lyrics.source" class="lyrics-source">
        {{ $t('lyrics.source') }}: {{ lyrics.source }}
      </div>
    </div>

    <div v-else class="lyrics-content">{{ $t('lyrics.noLyrics') }}</div>
  </div>
</template>

<script setup>
import { usePlayerStore } from '../stores/player'
import { ref, computed, watch, onMounted } from 'vue'
import { lyricsService } from '../services/lyrics'

const player = usePlayerStore()
const lyrics = ref(null)
const syncedLyrics = ref([])
const loading = ref(false)

const currentLineIndex = computed(() => {
  if (!player.currentTime) return -1
  return syncedLyrics.value.findIndex((line) => line.time > player.currentTime) - 1
})

const scrollToCurrentLine = () => {
  if (currentLineIndex.value >= 0) {
    const element = document.getElementById(`line-${currentLineIndex.value}`)
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const loadLyrics = async (track) => {
  if (!track) return

  try {
    loading.value = true
    lyrics.value = null
    syncedLyrics.value = []

    const syncedLyricsContent = await lyricsService.getSyncedLyrics(track.title, track.artist)
    if (syncedLyricsContent) {
      syncedLyrics.value = lyricsService.parseLRC(syncedLyricsContent)
    } else {
      lyrics.value = await window.youtube.getLyrics(track.id)
    }
  } catch (error) {
    console.error('Failed to load lyrics:', error)
    lyrics.value = null
    syncedLyrics.value = []
  } finally {
    loading.value = false
  }
}

const formatLyrics = (text) => text?.replace(/\n/g, '<br>') || ''
const seekTo = (time) => player.seekTo(time)

watch(() => currentLineIndex.value, scrollToCurrentLine)
watch(() => player.currentTrack, loadLyrics, { immediate: true })

onMounted(() => player.currentTrack && loadLyrics(player.currentTrack))
</script>

<style lang="scss" scoped>
.lyrics-container {
  background-color: var(--tertiary-bg);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  h1 {
    line-height: 1;
  }
}

.lyrics-content {
  white-space: pre-wrap;
  font-size: 24px;
  margin-top: 20px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  flex: 1;
  overflow-y: auto;
  padding: 0 20px;
  scroll-behavior: smooth;
}

.lyric-line {
  padding: 12px 0;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.5;
  text-align: center;
  font-size: 24px;
  transform: scale(1);
  color: var(--text-color);

  &:hover {
    opacity: 0.8;
    transform: scale(1.02);
  }

  &.active {
    opacity: 1;
    font-weight: 600;
    color: var(--accent-color);
    transform: scale(1.05);
  }
}

.loading {
  margin-top: 30px;
  font-size: 16px;
  color: var(--secondary-text-color);
  text-align: center;
}

.lyrics-source {
  margin-top: 30px;
  font-size: 12px;
  color: var(--secondary-text-color);
  text-align: center;
}
</style>
