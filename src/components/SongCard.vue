<template>
  <div class="song-card no-select">
    <div class="artwork-container" @click="handleClick">
      <div v-if="skeleton || loading" class="artwork-loader"></div>
      <img
        v-show="!loading && !skeleton && thumbnail.length > 0"
        :src="getOptimalThumbnail(thumbnail, 140)"
        @error="loading = true"
        @load="loading = false"
      />
      <div v-if="!skeleton" class="play-overlay">
        <q-icon name="mdi-play" size="48px" />
      </div>
      <div v-if="!skeleton" class="add-to-playlist" @click.stop="showPlaylistDialog = true">
        <q-icon name="mdi-playlist-plus" size="20px" />
      </div>
    </div>
    <div class="song-card-title">
      <div v-if="skeleton" class="skeleton-text"></div>
      <h3 v-else>{{ title }}</h3>
      <div v-if="skeleton" class="skeleton-text"></div>
      <p v-else>{{ artist }}</p>
    </div>
    <AddToPlaylistDialog v-model="showPlaylistDialog" :song="songData" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePlayerStore } from '../stores/player'
import AddToPlaylistDialog from './AddToPlaylistDialog.vue'
import { getOptimalThumbnail } from '../utils/thumbnail'

const loading = ref(true)
const player = usePlayerStore()
const showPlaylistDialog = ref(false)

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: Array,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  skeleton: {
    type: Boolean,
    default: false,
  },
})

const songData = computed(() => ({
  id: props.id,
  title: props.title,
  artist: props.artist,
  thumbnails: props.thumbnail,
}))

const handlePlay = async () => {
  await player.play(props.id, true)
}

const handleClick = () => {
  if (!props.skeleton) {
    handlePlay()
  }
}
</script>

<style lang="scss" scoped>
.song-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background-color: var(--secondary-bg);
  border-radius: 15px;
  width: 160px;
  height: 215px;
  padding: 10px;
  box-sizing: border-box;
  position: relative;

  .song-card-title {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 100%;
    text-align: center;
    box-sizing: border-box;

    .skeleton-text {
      height: 16px;
      background: linear-gradient(
        90deg,
        var(--primary-bg) 25%,
        var(--secondary-bg) 50%,
        var(--tertiary-bg) 75%
      );
      background-size: 200% 100%;
      animation: loading 1s infinite;
      border-radius: 20px;

      &:last-child {
        width: 70%;
        margin: 0 auto;
      }
    }

    h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      line-height: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    p {
      font-size: 14px;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .artwork-container {
    position: relative;
    width: 140px;
    height: 140px;
    cursor: pointer;

    &:hover {
      .play-overlay {
        opacity: 1;
      }

      .add-to-playlist {
        opacity: 1;
      }

      img {
        filter: brightness(0.7);
      }
    }

    .add-to-playlist {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 32px;
      height: 32px;
      border-radius: 16px;
      background-color: var(--accent-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition:
        transform 0.2s ease,
        opacity 0.2s ease;
      z-index: 10;
      opacity: 0;
    }

    .play-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s ease;
      border-radius: 8px;
    }

    .artwork-loader {
      width: 140px;
      height: 140px;
      border-radius: 5px;
      background: linear-gradient(
        90deg,
        var(--primary-bg) 25%,
        var(--secondary-bg) 50%,
        var(--tertiary-bg) 75%
      );
      background-size: 200% 100%;
      animation: loading 1s infinite;
    }

    img {
      width: 140px;
      height: 140px;
      object-fit: cover;
      border-radius: 8px;
    }
  }
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
