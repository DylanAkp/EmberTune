<template>
  <div class="overlay-container">
    <transition name="fade" mode="out-in">
      <div v-if="currentSong" class="song-info" :key="currentSong.title">
        <div class="music-icon">
          <i class="mdi mdi-music"></i>
        </div>
        <div class="song-details">
          <div class="song-title">{{ currentSong.title }}</div>
          <div class="song-artist">{{ currentSong.artist }}</div>
        </div>
      </div>
      <div v-else class="no-song-info" key="no-song">
        <div class="logo">
          <img src="../assets/EmberTune.svg" alt="Embertune Logo" />
        </div>
        <div class="no-song-details">
          <div class="app-name">Embertune</div>
          <div class="no-song-text">Nothing is playing</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'OverlayPage',
  setup() {
    const currentSong = ref(null)

    const handleSongUpdate = (songInfo) => {
      currentSong.value = songInfo
    }

    onMounted(() => {
      if (window.overlay) {
        window.overlay.onSongUpdate(handleSongUpdate)
      } else {
        console.error('Overlay API not available')
      }
    })

    onUnmounted(() => {
      if (window.overlay) {
        window.overlay.removeSongUpdateListener(handleSongUpdate)
      }
    })

    return {
      currentSong,
    }
  },
}
</script>

<style lang="scss">
body {
  background: transparent;
}

.overlay-container {
  background: transparent;
  color: white;
  padding: 10px;
  user-select: none;

  .song-info,
  .no-song-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .music-icon,
    .logo {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent-color);
      -webkit-app-region: drag;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .song-details,
    .no-song-details {
      flex: 1;
      min-width: 0;

      .song-title,
      .app-name {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }

      .song-artist,
      .no-song-text {
        font-size: 12px;
        opacity: 0.8;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
