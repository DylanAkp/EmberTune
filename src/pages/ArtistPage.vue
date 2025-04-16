<template>
  <div class="artist-page">
    <div v-if="loading" class="artist-container">
      <div class="skeleton-artist-card">
        <ImageSkeleton :size="200" :border-radius="100" />
        <div class="artist-info">
          <TextSkeleton :width="200" :height="24" />
          <TextSkeleton :width="150" :height="24" />
        </div>
      </div>
      <div class="loading-message">{{ $t('artist.loading') }}</div>
    </div>
    <div v-else-if="error" class="error-message">
      {{ $t('artist.error') }}
    </div>
    <div v-else-if="artist" class="artist-container">
      <div class="artist-header">
        <img
          :src="getOptimalThumbnail(artist.thumbnails, 200)"
          :alt="artist.name"
          class="artist-image"
        />
        <div class="artist-info">
          <div class="artist-info-header">
            <h1>{{ artist.name }}</h1>
            <p v-if="artist.followers">
              {{ artist.followers.followersText }} {{ $t('artistCard.followers') }}
            </p>
          </div>
          <p v-if="artist.description">
            {{ artist.description }}
          </p>
        </div>
      </div>

      <div v-if="artist.albums?.length" class="section albums-section">
        <h3>{{ $t('artist.albums') }}</h3>
        <div class="cards-row">
          <AlbumCard
            v-for="album in artist.albums"
            :key="album?.id"
            :title="album?.name || ''"
            :thumbnail="album?.thumbnails || []"
            :artist="album?.artists?.[0]?.name || ''"
            :id="album?.id || ''"
          />
        </div>
      </div>
      <div v-else class="section albums-section">
        <h3>{{ $t('artist.albums') }}</h3>
        <div class="no-content">{{ $t('artist.noAlbums') }}</div>
      </div>

      <div v-if="artist.songs?.length" class="section">
        <h3>{{ $t('artist.songs') }}</h3>
        <div class="cards-row">
          <SongCard
            v-for="song in artist.songs"
            :key="song?.id"
            :title="song?.title || ''"
            :thumbnail="song?.thumbnails || []"
            :artist="song?.artists?.[0]?.name || ''"
            :id="song?.id || ''"
          />
        </div>
      </div>
      <div v-else class="section">
        <h3>{{ $t('artist.songs') }}</h3>
        <div class="no-content">{{ $t('artist.noSongs') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getOptimalThumbnail } from '../utils/thumbnail'
import SongCard from 'src/components/SongCard.vue'
import AlbumCard from 'src/components/AlbumCard.vue'
import ImageSkeleton from '../components/ImageSkeleton.vue'
import TextSkeleton from '../components/TextSkeleton.vue'

const route = useRoute()
const loading = ref(true)
const artist = ref(null)

const fetchArtistDetails = async () => {
  try {
    loading.value = true
    const result = await window.youtube.getArtistDetails(route.params.id)
    artist.value = result.artist
    artist.value.albums = result.albums
    artist.value.songs = result.songs
  } catch (error) {
    console.error('Error fetching artist details:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchArtistDetails()
})
</script>

<style lang="scss" scoped>
.artist-page {
  padding: 20px;

  .loading-message,
  .error-message,
  .no-content {
    text-align: center;
    padding: 20px;
    color: var(--text-color);
    opacity: 0.7;
  }

  .no-description {
    font-style: italic;
    opacity: 0.7;
  }

  .skeleton-artist-card {
    display: flex;
    gap: 20px;
    align-items: center;

    .artist-info {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  }

  .artist-container {
    .artist-header {
      display: flex;
      gap: 30px;
      align-items: center;
      margin-bottom: 40px;

      .artist-image {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        object-fit: cover;
      }

      .artist-info {
        width: 100%;
        h1 {
          font-size: 32px;
          margin: 0 0 10px 0;
        }

        &-header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          p {
            background-color: var(--secondary-bg);
            padding: 10px;
            border-radius: 10px;
          }
        }

        p {
          font-size: 16px;
          margin: 0;
          color: var(--text-secondary);
        }
      }
    }

    .section {
      margin-bottom: 40px;

      h3 {
        color: var(--text-color);
        font-weight: 600;
        font-size: 20px;
        margin-bottom: 20px;
      }

      &.albums-section {
        .cards-row {
          flex-wrap: nowrap;
          overflow-x: auto;
          padding-bottom: 15px;
        }
      }
    }

    .cards-row {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 15px;
    }
  }
}
</style>
