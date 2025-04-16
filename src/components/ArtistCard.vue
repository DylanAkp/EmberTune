<template>
  <div class="artist-card no-select" @click="navigateToArtist">
    <div class="artwork-container">
      <ImageSkeleton v-if="skeleton || loading" :size="64" :border-radius="50" />
      <img
        v-show="!loading && !skeleton && thumbnail.length > 0"
        :src="getOptimalThumbnail(thumbnail, 64)"
        @error="loading = true"
        @load="loading = false"
      />
    </div>
    <div class="artist-card-title">
      <TextSkeleton v-if="skeleton" :width="180" :height="14" />
      <h3 v-else>{{ artist }}</h3>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getOptimalThumbnail } from '../utils/thumbnail'
import { useRouter } from 'vue-router'
import ImageSkeleton from './ImageSkeleton.vue'
import TextSkeleton from './TextSkeleton.vue'

const router = useRouter()
const loading = ref(true)

const props = defineProps({
  artist: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: Array,
    required: true,
  },
  skeleton: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    required: true,
  },
})

const navigateToArtist = () => {
  if (!props.skeleton) {
    router.push(`/artist/${props.id}`)
  }
}
</script>

<style lang="scss" scoped>
.artist-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  background-color: var(--secondary-bg);
  border-radius: 50px;
  width: fit-content;
  height: 80px;
  padding: 8px;
  padding-right: 16px;
  box-sizing: border-box;
  position: relative;
  cursor: pointer;

  .artist-card-title {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    text-align: left;
    box-sizing: border-box;
    min-width: 0;

    h3 {
      font-size: 15px;
      font-weight: 600;
      margin: 0;
      line-height: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 180px;
    }
  }

  .artwork-container {
    position: relative;
    width: 64px;
    height: 64px;

    img {
      width: 64px;
      height: 64px;
      object-fit: cover;
      border-radius: 50px;
    }
  }
}
</style>
