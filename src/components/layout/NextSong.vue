<template>
  <transition name="fade" mode="out-in">
    <div
      :key="displayTrack?.id"
      class="next-song"
      v-if="displayTrack && !playerStore.isShuffled && playerStore.queue.length > 0"
    >
      <div class="next-song-label">{{ playModeLabel }}</div>
      <div class="next-song-content">
        <img :src="optimalThumbnail" :alt="displayTrack.title" class="next-song-thumbnail" />
        <div class="next-song-info">
          <div class="next-song-title">{{ displayTrack.title }}</div>
          <div class="next-song-artist">{{ displayTrack.artist }}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { usePlayerStore } from 'src/stores/player'
import { getOptimalThumbnail } from 'src/utils/thumbnail'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const playerStore = usePlayerStore()

const displayTrack = computed(() => {
  if (playerStore.replayMode === 'song' && playerStore.currentTrack) {
    return playerStore.currentTrack
  }
  if (!playerStore.hasNext) {
    if (playerStore.replayMode === 'playlist' && playerStore.queue.length > 0) {
      return playerStore.queue[0]
    }
    return null
  }
  return playerStore.queue[playerStore.currentIndex + 1]
})

const optimalThumbnail = computed(() => {
  if (!displayTrack.value?.thumbnails) return ''
  return getOptimalThumbnail(displayTrack.value.thumbnails, 40)
})

const playModeLabel = computed(() => {
  switch (playerStore.replayMode) {
    case 'song':
      return t('common.nextSong.repeating')
    default:
      return t('common.nextSong.nextUp')
  }
})
</script>

<style lang="scss" scoped>
.next-song {
  padding: 15px;
  background-color: var(--primary-bg);
  border-radius: 10px;
  margin-top: auto;
  margin-left: auto;
  margin-right: auto;
  width: calc(100% - 30px);
  max-width: 200px;

  .next-song-label {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-align: center;
  }

  .next-song-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .next-song-thumbnail {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    object-fit: cover;
  }

  .next-song-info {
    flex: 1;
    min-width: 0;

    .next-song-title {
      font-size: 0.85rem;
      color: var(--text-color);
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .next-song-artist {
      font-size: 0.75rem;
      color: var(--text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
