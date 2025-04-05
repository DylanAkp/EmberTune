<template>
  <div class="artist-card no-select">
    <div class="artwork-container">
      <div v-if="skeleton || loading" class="artwork-loader"></div>
      <img
        v-show="!loading && !skeleton && thumbnail.length > 0"
        :src="
          thumbnail.reduce(
            (prev, current) => (prev.width > current.width ? prev : current),
            thumbnail[0],
          ).url
        "
        @error="loading = true"
        @load="loading = false"
      />
    </div>
    <div class="artist-card-title">
      <div v-if="skeleton" class="skeleton-text"></div>
      <h3 v-else>{{ artist }}</h3>
      <div v-if="skeleton" class="skeleton-text"></div>
      <p v-else>{{ formatFollowers }} {{ $t('artistCard.followers') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

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
})

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
  gap: 15px;
  background-color: var(--secondary-bg);
  border-radius: 15px;
  width: 300px;
  height: 100px;
  padding: 10px;
  box-sizing: border-box;
  position: relative;

  .artist-card-title {
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex: 1;
    text-align: left;
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
      line-height: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .artwork-container {
    position: relative;
    width: 80px;
    height: 80px;

    .artwork-loader {
      width: 80px;
      height: 80px;
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
      width: 80px;
      height: 80px;
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
