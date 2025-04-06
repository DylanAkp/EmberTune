<script setup>
import { usePlayerStore } from '../../stores/player'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AddToPlaylistDialog from '../AddToPlaylistDialog.vue'
import { usePlaylistStore } from '../../stores/playlist'
import { getOptimalThumbnail } from '../../utils/thumbnail'
import ImageSkeleton from '../ImageSkeleton.vue'

const player = usePlayerStore()
const volume = ref(player.volume * 100)
const copyStatus = ref('initial')
const showVolumeSlider = ref(false)
const showAddToPlaylistDialog = ref(false)
const router = useRouter()
const playlistStore = usePlaylistStore()
const imageLoading = ref(true)

const isLiked = computed(() => {
  if (!player.currentTrack) return false
  const likedPlaylist = playlistStore.playlists.find((p) => p.id === 'liked-songs')
  return likedPlaylist?.songs.some((song) => song.id === player.currentTrack.id) || false
})

const handleSeek = () => {
  player.seekTo(player.currentTime)
}

const goToArtist = () => {
  router.push(`/artist/${player.currentTrack.artists[0].id}`)
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
}

const toggleLike = () => {
  if (!player.currentTrack) return

  if (isLiked.value) {
    playlistStore.removeSongFromPlaylist('liked-songs', player.currentTrack.id)
  } else {
    playlistStore.addSongToPlaylist('liked-songs', {
      id: player.currentTrack.id,
      title: player.currentTrack.title,
      artist: player.currentTrack.artist,
      thumbnails: player.currentTrack.thumbnails,
    })
  }
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

const replayModeIcon = computed(() => {
  switch (player.replayMode) {
    case 'song':
      return 'mdi-repeat-once'
    case 'playlist':
      return 'mdi-repeat'
    default:
      return 'mdi-repeat-off'
  }
})
</script>

<template>
  <div class="playbar no-select" v-if="player.currentTrack">
    <div class="main-content">
      <!-- Left section with song info -->
      <div class="song-info">
        <div class="album-art-container">
          <ImageSkeleton v-if="imageLoading" :size="60" :border-radius="15" />
          <img
            v-show="!imageLoading"
            :src="getOptimalThumbnail(player.currentTrack.thumbnails, 60)"
            alt="Album Art"
            class="album-art"
            @error="imageLoading = true"
            @load="imageLoading = false"
          />
        </div>
        <div class="track-details">
          <div class="title">{{ player.currentTrack.title }}</div>
          <div class="artist" @click="goToArtist">{{ player.currentTrack.artist }}</div>
        </div>
      </div>

      <!-- Center section with controls -->
      <div class="controls">
        <q-icon
          name="mdi-shuffle"
          size="20px"
          :class="{
            clickable: true,
            'text-accent': player.isShuffled,
            'text-grey-6': !player.isShuffled,
          }"
          @click="player.toggleShuffle()"
        />
        <q-icon name="mdi-skip-previous" size="30px" class="clickable" @click="player.previous()" />
        <q-icon
          :name="player.isPlaying ? 'mdi-pause' : 'mdi-play'"
          size="35px"
          class="clickable"
          @click="player.togglePlayPause()"
        />
        <q-icon name="mdi-skip-next" size="30px" class="clickable" @click="player.next()" />
        <q-icon
          :name="replayModeIcon"
          size="20px"
          :class="{
            clickable: true,
            'text-accent': player.replayMode !== 'disabled',
            'text-grey-6': player.replayMode === 'disabled',
          }"
          @click="player.toggleReplayMode()"
        />
      </div>

      <!-- Right section with additional controls -->
      <div class="tools">
        <div class="volume-control">
          <q-icon
            name="mdi-volume-high"
            size="20px"
            class="text-grey-6 clickable"
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
            'text-grey-6': $route.path !== '/lyrics',
          }"
          @click="$route.path === '/lyrics' ? router.back() : router.push('/lyrics')"
        />
        <q-icon
          :name="copyStatus === 'copied' ? 'mdi-check' : 'mdi-link'"
          size="20px"
          :class="{
            clickable: true,
            'text-accent': copyStatus === 'copied',
            'text-grey-6': copyStatus !== 'copied',
          }"
          @click="copyLink"
        />
        <q-icon
          :name="isLiked ? 'mdi-heart' : 'mdi-heart-outline'"
          size="20px"
          :class="{ clickable: true, 'text-accent': isLiked, 'text-grey-6': !isLiked }"
          @click="toggleLike"
        />
        <q-icon
          name="mdi-playlist-plus"
          size="20px"
          class="text-grey-6 clickable"
          @click="showAddToPlaylistDialog = true"
        />
      </div>
    </div>

    <!-- Progress bar -->
    <div class="progress-container">
      <div class="time">{{ formatTime(player.currentTime) }}</div>
      <div class="progress-bar-wrapper">
        <input
          type="range"
          v-model="player.currentTime"
          :min="0"
          :max="player.currentTrack.duration.duration || 1"
          :step="1"
          @input="handleSeek"
          class="progress-slider"
        />
        <div
          class="progress-bar"
          :style="{
            width: `${(player.currentTime / (player.currentTrack.duration.duration || 1)) * 100}%`,
          }"
        ></div>
      </div>
      <div class="time">{{ formatTime(player.currentTrack.duration.duration) }}</div>
    </div>

    <!-- Add to Playlist Dialog -->
    <AddToPlaylistDialog
      v-model="showAddToPlaylistDialog"
      :song="{
        id: player.currentTrack?.id,
        title: player.currentTrack?.title,
        artist: player.currentTrack?.artist,
        thumbnails: player.currentTrack?.thumbnails,
      }"
    />
  </div>
</template>

<style lang="scss" scoped>
.playbar {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
  border-radius: 20px;
}

.main-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.song-info {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 12px;
  min-width: 0;
  max-width: 33%;

  .album-art-container {
    position: relative;
    width: 60px;
    height: 60px;
    flex-shrink: 0;
  }

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
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      cursor: pointer;
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
  margin-right: 10px;

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
          writing-mode: vertical-lr;
          direction: rtl;
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
    color: var(--secondary-text-color);
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
</style>
