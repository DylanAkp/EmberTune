<template>
  <div class="playlist-page">
    <div class="header">
      <h1>{{ t('playlists.title') }}</h1>
      <StyledButton
        icon="mdi-plus"
        :text="t('playlists.create')"
        variant="accent"
        @click="showCreateDialog = true"
      />
    </div>

    <div class="playlists-grid">
      <div
        v-for="playlist in playlistStore.playlists"
        :key="playlist.id"
        class="playlist-card clickable"
        @click="openPlaylist(playlist)"
      >
        <div class="playlist-thumbnail">
          <q-icon
            v-if="playlist.id === 'liked-songs'"
            class="default-icon"
            name="mdi-heart"
            size="64px"
          />
          <q-icon
            v-else-if="playlist.id === 'history'"
            class="default-icon"
            name="mdi-history"
            size="64px"
          />
          <img
            v-else-if="playlist.songs.length > 0"
            :src="playlist.songs[0].thumbnails[0].url"
            alt="Playlist Cover"
          />
          <q-icon v-else name="mdi-music" size="64px" class="default-icon" />
        </div>
        <div class="playlist-info">
          <div class="playlist-name">{{ playlist.name }}</div>
          <div class="playlist-details">{{ playlist.songs.length }} {{ t('common.songs') }}</div>
        </div>
      </div>
    </div>

    <CreatePlaylistDialog v-model="showCreateDialog" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlaylistStore } from '../stores/playlist'
import CreatePlaylistDialog from '../components/CreatePlaylistDialog.vue'
import StyledButton from '../components/StyledButton.vue'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const playlistStore = usePlaylistStore()
const showCreateDialog = ref(false)
const { t } = useI18n()

onMounted(() => {
  playlistStore.initializeDefaultPlaylist()
})

function openPlaylist(playlist) {
  playlistStore.setCurrentPlaylist(playlist)
  router.push(`/playlists/${playlist.id}`)
}
</script>

<style lang="scss" scoped>
.playlist-page {
  padding: 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;

    h1 {
      margin: 0;
      font-size: 2em;
      font-weight: 600;
    }
  }

  .playlists-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .playlist-card {
    width: 200px;
    max-width: 300px;
    background: var(--secondary-bg);
    border-radius: 15px;
    overflow: hidden;

    .playlist-thumbnail {
      aspect-ratio: 1;
      background: var(--tertiary-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .default-icon {
        opacity: 0.5;
      }
    }

    .playlist-info {
      padding: 15px;

      .playlist-name {
        font-weight: 500;
        font-size: 1.1em;
        margin-bottom: 5px;
      }

      .playlist-details {
        font-size: 0.9em;
        color: var(--text-color);
        opacity: 0.7;
      }
    }
  }
}
</style>
