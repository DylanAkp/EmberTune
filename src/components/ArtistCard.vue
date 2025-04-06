<template>
  <div class="artist-card no-select" @click="navigateToArtist">
    <div class="artwork-container">
      <div v-if="skeleton || loading" class="artwork-loader"></div>
      <img
        v-show="!loading && !skeleton && thumbnail.length > 0"
        :src="getOptimalThumbnail(thumbnail, 64)"
        @error="loading = true"
        @load="loading = false"
      />
    </div>
    <div class="artist-card-title">
      <div v-if="skeleton" class="skeleton-text"></div>
      <h3 v-else>{{ artist }}</h3>
      <div v-if="skeleton" class="skeleton-text"></div>
      <p v-else-if="followers">{{ formatFollowers }} {{ $t('artistCard.followers') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getOptimalThumbnail } from '../utils/thumbnail'
import { useRouter } from 'vue-router'

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
  followers: {
    type: Number,
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

const formatFollowers = computed(() => {
  if (props.followers >= 1000000) {
    return `${(props.followers / 1000000).toFixed(1)}M`
  } else if (props.followers >= 1000) {
    return `${(props.followers / 1000).toFixed(1)}K`
  }
  return `${props.followers}`
})
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

    .skeleton-text {
      height: 14px;
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
      }
    }

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

    p {
      font-size: 13px;
      margin: 0;
      line-height: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 140px;
    }
  }

  .artwork-container {
    position: relative;
    width: 64px;
    height: 64px;

    .artwork-loader {
      width: 64px;
      height: 64px;
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
      width: 64px;
      height: 64px;
      object-fit: cover;
      border-radius: 50px;
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
