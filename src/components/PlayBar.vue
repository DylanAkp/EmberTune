<script setup>
import { usePlayerStore } from '../stores/player'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const player = usePlayerStore()
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(player.volume * 100)
const isLiked = ref(false)
const copyStatus = ref('initial')
const showVolumeSlider = ref(false)
const router = useRouter()

const updateTime = () => {
  if (player.audio) {
    currentTime.value = Math.floor(player.audio.currentTime)
    duration.value = Math.floor(player.audio.duration)
  }
}

const handleSeek = () => {
  player.seekTo(currentTime.value)
}

const updateVolume = () => {
  player.updateVolume(volume.value / 100)
}

const copyLink = () => {
  const songId = player.currentTrack?.id || ''
  navigator.clipboard.writeText(`https://music.youtube.com/watch?v=${songId}`)
  copyStatus.value = 'copied'
  setTimeout(() => {
    copyStatus.value = 'initial'
  }, 2000)
  console.log(player.currentTrack.artist)
}

const toggleLike = () => {
  isLiked.value = !isLiked.value
  notImplemented('Like/Unlike')
}

const notImplemented = (feature) => {
  console.log(feature)
}

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const toggleVolumeSlider = () => {
  showVolumeSlider.value = !showVolumeSlider.value
}

let timeUpdateInterval

onMounted(() => {
  timeUpdateInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeUpdateInterval) {
    clearInterval(timeUpdateInterval)
  }
})
</script>

<template>
  <div class="playbar no-select" v-if="player.currentTrack">
    <div class="main-content">
      <!-- Left section with song info -->
      <div class="song-info">
        <img
          :src="
            player.currentTrack.thumbnail.reduce((prev, current) =>
              prev.width > current.width ? prev : current,
            ).url
          "
          alt="Album Art"
          class="album-art"
        />
        <div class="track-details">
          <div class="title">{{ player.currentTrack.title }}</div>
          <div class="artist">{{ player.currentTrack.artist }}</div>
        </div>
      </div>

      <!-- Center section with controls -->
      <div class="controls">
        <q-icon
          name="mdi-skip-previous"
          size="30px"
          class="clickable"
          @click="player.hasPrevious && player.previous()"
        />
        <q-icon
          :name="player.isPlaying ? 'mdi-pause' : 'mdi-play'"
          size="35px"
          class="clickable"
          @click="player.togglePlayPause()"
        />
        <q-icon
          name="mdi-skip-next"
          size="30px"
          class="clickable"
          @click="player.hasNext && player.next()"
        />
      </div>

      <!-- Right section with additional controls -->
      <div class="tools">
        <div class="volume-control">
          <q-icon
            name="mdi-volume-high"
            size="20px"
            class="text-grey clickable"
            @click="toggleVolumeSlider"
            @mouseenter="showVolumeSlider = true"
          />
          <div class="volume-popup" v-if="showVolumeSlider" @mouseleave="showVolumeSlider = false">
            <div class="slider-container">
              <input
                type="range"
                v-model="volume"
                min="0"
                max="100"
                orient="vertical"
                class="volume-slider"
                @input="updateVolume"
              />
              <div class="volume-fill" :style="{ height: volume + '%' }"></div>
            </div>
          </div>
        </div>
        <q-icon
          name="mdi-microphone-variant"
          size="20px"
          :class="{
            clickable: true,
            'text-accent': $route.path === '/lyrics',
            'text-grey': $route.path !== '/lyrics',
          }"
          @click="router.push('/lyrics')"
        />
        <q-icon
          :name="copyStatus === 'copied' ? 'mdi-check' : 'mdi-link'"
          size="20px"
          :class="{
            clickable: true,
            'text-accent': copyStatus === 'copied',
            'text-grey': copyStatus !== 'copied',
          }"
          @click="copyLink"
        />
        <q-icon
          :name="isLiked ? 'mdi-heart' : 'mdi-heart-outline'"
          size="20px"
          :class="{ clickable: true, 'text-accent': isLiked, 'text-grey': !isLiked }"
          @click="toggleLike"
        />
        <q-icon
          name="mdi-playlist-music"
          size="20px"
          class="clickable text-grey"
          @click="notImplemented('Add to Playlist')"
        />
      </div>
    </div>

    <!-- Progress bar -->
    <div class="progress-container">
      <div class="time">{{ formatTime(currentTime) }}</div>
      <div class="progress-bar-wrapper">
        <input
          type="range"
          v-model="currentTime"
          :min="0"
          :max="duration"
          :step="1"
          @change="handleSeek"
          class="progress-slider"
        />
        <div class="progress-bar" :style="{ width: `${(currentTime / duration) * 100}%` }"></div>
      </div>
      <div class="time">{{ formatTime(duration) }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.playbar {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: calc(100% - var(--sidebar-width) - 20px);
  background: var(--secondary-bg);
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px 20px;
  border-radius: 20px;
  z-index: 1000;
}

.main-content {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10%;
}

.song-info {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 12px;
  min-width: 0;
  max-width: 33%;

  .album-art {
    width: 60px;
    height: 60px;
    border-radius: 15px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .track-details {
    min-width: 0;
    width: 100%;
    overflow: hidden;

    .title {
      font-weight: 500;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }
    .artist {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }
  }
}

.controls {
  display: flex;
  align-items: center;
  gap: 5%;
  justify-content: center;
  flex: 1;
  flex-shrink: 0;
}

.tools {
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: flex-end;
  flex: 1;
  flex-shrink: 0;

  .volume-control {
    position: relative;

    .volume-popup {
      position: absolute;
      bottom: 25px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--secondary-bg);
      border-radius: 10px;
      padding: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      z-index: 100;

      .slider-container {
        position: relative;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;

        .volume-slider {
          position: absolute;
          -webkit-appearance: slider-vertical;
          width: 4px;
          height: 80px;
          background: var(--tertiary-bg);
          border-radius: 2px;
          opacity: 0;
          z-index: 2;
          cursor: pointer;
          margin: 0;
          padding: 0;
        }

        .volume-fill {
          position: absolute;
          bottom: 0;
          width: 4px;
          background-color: var(--accent-color);
          border-radius: 2px;
          pointer-events: none;
          z-index: 1;
        }
      }
    }
  }
}

.progress-container {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;

  .time {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    min-width: 45px;
  }
}

.progress-bar-wrapper {
  flex: 1;
  position: relative;
  height: 4px;

  .progress-slider {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 2;
  }

  .progress-bar {
    position: absolute;
    height: 100%;
    background: var(--accent-color);
    border-radius: 2px;
  }

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--tertiary-bg);
    border-radius: 2px;
  }
}

.clickable {
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.text-accent {
  color: var(--accent-color);
}

.text-grey {
  color: rgba(255, 255, 255, 0.7);
}
</style>
