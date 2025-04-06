<template>
  <div class="album-card no-select">
    <div class="artwork-container">
      <ImageSkeleton v-if="skeleton || loading" :size="140" :border-radius="8" />
      <img
        v-show="!loading && !skeleton && thumbnail.length > 0"
        :src="getOptimalThumbnail(thumbnail, 140)"
        @error="loading = true"
        @load="loading = false"
      />
    </div>
    <div class="album-card-title">
      <TextSkeleton v-if="skeleton" :width="140" :height="16" />
      <h3 v-else>
        <q-icon name="mdi-music-box-multiple" size="20px" />
        {{ title }}
      </h3>
      <TextSkeleton v-if="skeleton" :width="100" :height="16" />
      <p v-else>{{ artist }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getOptimalThumbnail } from '../utils/thumbnail'
import ImageSkeleton from './ImageSkeleton.vue'
import TextSkeleton from './TextSkeleton.vue'

const loading = ref(true)

defineProps({
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
</script>

<style lang="scss" scoped>
.album-card {
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

  .album-card-title {
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
