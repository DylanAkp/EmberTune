<template>
  <div class="song-card no-select">
    <div class="artwork-container" @click="handleClick">
      <ImageSkeleton v-if="skeleton || loading" :size="140" :border-radius="8" />
      <img
        v-show="!loading && !skeleton && thumbnail.length > 0"
        :src="getOptimalThumbnail(thumbnail, 140)"
        @error="loading = true"
        @load="loading = false"
      />
      <div
        v-if="!skeleton && player.isLoading && player.loadingTrackId === id"
        class="loading-overlay"
      >
        <ImageSkeleton :size="140" :border-radius="8" />
      </div>
      <div v-if="!skeleton" class="play-overlay">
        <q-icon name="mdi-play" size="48px" />
      </div>
      <div v-if="!skeleton" class="add-to-playlist" @click.stop="showPlaylistDialog = true">
        <q-icon name="mdi-playlist-plus" size="20px" />
      </div>
    </div>
    <div class="song-card-title">
      <TextSkeleton v-if="skeleton" :width="140" :height="16" />
      <h3 v-else>{{ title }}</h3>
      <TextSkeleton v-if="skeleton" :width="100" :height="16" />
      <p v-else>{{ artist }}</p>
    </div>
    <AddToPlaylistDialog v-model="showPlaylistDialog" :song="songData" :show-liked-songs="true" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePlayerStore } from '../stores/player'
import AddToPlaylistDialog from './AddToPlaylistDialog.vue'
import { getOptimalThumbnail } from '../utils/thumbnail'
import ImageSkeleton from './ImageSkeleton.vue'
import TextSkeleton from './TextSkeleton.vue'

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

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.7;
      z-index: 5;
      border-radius: 8px;
      pointer-events: none;
    }

    img {
      width: 140px;
      height: 140px;
      object-fit: cover;
      border-radius: 8px;
    }
  }
}
</style>
