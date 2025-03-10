<template>
  <div class="song-card no-select">
    <div class="artwork-container" @click="handlePlay">
      <div v-if="loading" class="artwork-loader"></div>
      <img
        v-show="!loading"
        :src="
          thumbnail.reduce((prev, current) => (prev.width > current.width ? prev : current)).url
        "
        @error="loading = true"
        @load="loading = false"
      />
      <div class="play-overlay">
        <q-icon name="mdi-play" size="48px" />
      </div>
    </div>
    <div class="song-card-title">
      <h3>{{ title }}</h3>
      <p>{{ artist }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePlayerStore } from '../stores/player'

const loading = ref(true)
const player = usePlayerStore()

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
})

const handlePlay = async () => {
  await player.play(props.id, true)
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

  .song-card-title {
    display: flex;
    flex-direction: column;
    gap: 10px;
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
      line-height: 100%;
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

      img {
        filter: brightness(0.7);
      }
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
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
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
