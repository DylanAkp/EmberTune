<template>
  <div class="album-card no-select">
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
    <div class="album-card-title">
      <div v-if="skeleton" class="skeleton-text"></div>
      <h3 v-else>
        <q-icon name="mdi-music-box-multiple" size="20px" />
        {{ title }}
      </h3>
      <div v-if="skeleton" class="skeleton-text"></div>
      <p v-else>{{ artist }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
    gap: 10px;
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
