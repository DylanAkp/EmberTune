<template>
  <div v-if="album" class="album-detail">
    <div class="header">
      <div class="album-info">
        <div class="thumbnail">
          <img
            v-if="album.thumbnails && album.thumbnails.length > 0"
            :src="getOptimalThumbnail(album.thumbnails, 200)"
            alt="Album Cover"
          />
          <q-icon v-else name="mdi-music-box-multiple" size="96px" class="default-icon" />
        </div>
        <div class="info">
          <div class="album-type">{{ t('albums.album') }}</div>
          <div class="album-name">{{ album.name }}</div>
          <div class="album-artist" @click="navigateToArtist">{{ getArtistName }}</div>
          <div class="album-stats">{{ album.songs?.length || 0 }} {{ t('common.songs') }}</div>
        </div>
      </div>
      <div class="header-actions">
        <StyledButton icon="mdi-play" variant="accent" @click="playAlbum" />
        <div class="menu-container">
          <q-btn flat round icon="mdi-dots-vertical" size="md" @click="showMenu = !showMenu" />
          <div v-if="showMenu" class="menu-dropdown">
            <div class="menu-item" @click="addToPlaylist">
              <q-icon name="mdi-playlist-plus" />
              <span>{{ t('common.addToPlaylist') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div v-if="loading" class="loading-state">
        <q-spinner color="primary" size="3em" />
        <div class="message">{{ t('common.loading') }}</div>
      </div>
      <div v-else-if="!album.songs?.length" class="empty-state">
        <q-icon name="mdi-music-box-multiple" size="64px" />
        <div class="message">{{ t('albums.empty') }}</div>
        <div class="sub-message">{{ t('albums.emptySuggestion') }}</div>
      </div>
      <div v-else class="songs-list">
        <div class="list-header">
          <div class="index">#</div>
          <div class="title">{{ t('common.title') }}</div>
          <div class="duration">{{ t('common.duration') }}</div>
          <div class="actions"></div>
        </div>
        <div class="songs-container">
          <div v-for="(song, index) in album.songs" :key="song.id" class="song-item">
            <div class="index">{{ index + 1 }}</div>
            <div class="song-title">
              <img
                v-if="song.thumbnails && song.thumbnails.length > 0"
                :src="getOptimalThumbnail(song.thumbnails, 40)"
                alt="Song Thumbnail"
              />
              <q-icon v-else name="mdi-music" size="24px" class="default-icon" />
              <span class="text">{{ song.title }}</span>
            </div>
            <div class="duration">{{ formatDuration(song.duration) }}</div>
            <div class="song-actions">
              <q-btn flat round icon="mdi-play" size="sm" @click="playSong(song)" />
              <q-btn
                flat
                round
                icon="mdi-playlist-plus"
                size="sm"
                @click="addSongToPlaylist(song)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '../stores/player'
import { useI18n } from 'vue-i18n'
import StyledButton from '../components/StyledButton.vue'
import { getOptimalThumbnail } from '../utils/thumbnail'
import { usePlaylistStore } from '../stores/playlist'

const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()
const showMenu = ref(false)
const loading = ref(true)
const error = ref(null)
const { t } = useI18n()

const album = ref(null)

const getArtistName = computed(() => {
  if (!album.value || !album.value.artists || album.value.artists.length === 0) return ''
  return album.value.artists[0].name
})

const getArtistId = computed(() => {
  if (!album.value || !album.value.artists || album.value.artists.length === 0) return ''
  return album.value.artists[0].id
})

const fetchAlbumData = async () => {
  try {
    loading.value = true
    error.value = null
    const albumId = route.params.id

    album.value = await window.youtube.getObject(albumId)

    const songsData = await window.youtube.getAlbumSongs(albumId)
    album.value.songs = songsData
  } catch (err) {
    error.value = 'Failed to load album data'
    console.error('Error fetching album:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAlbumData()

  document.addEventListener('click', (e) => {
    const menuContainer = document.querySelector('.menu-container')
    if (menuContainer && !menuContainer.contains(e.target)) {
      showMenu.value = false
    }
  })
})

function navigateToArtist() {
  if (getArtistId.value) {
    router.push(`/artist/${getArtistId.value}`)
  }
}

function playAlbum() {
  if (album.value.songs.length > 0) {
    playerStore.playPlaylist(album.value.songs)
  }
}

function playSong(song) {
  playerStore.play(song.id)
}

function addSongToPlaylist(song) {
  const playlistStore = usePlaylistStore()
  playlistStore.showAddToPlaylistDialog = true
  playlistStore.songToAdd = song
}

function addToPlaylist() {
  const playlistStore = usePlaylistStore()
  playlistStore.showAddToPlaylistDialog = true
  playlistStore.songToAdd = album.value.songs
  playlistStore.isAddingAlbum = true
}

function formatDuration(seconds) {
  if (!seconds) return '0:00'

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
</script>

<style lang="scss" scoped>
.album-detail {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 40px;
    gap: 20px;

    .album-info {
      display: flex;
      gap: 20px;
      flex: 1;
      min-width: 0;

      .thumbnail {
        flex-shrink: 0;
        width: 200px;
        height: 200px;
        background: var(--tertiary-bg);
        border-radius: 15px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .default-icon {
          color: var(--text-color);
          opacity: 0.5;
        }
      }

      .info {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding-bottom: 10px;
        min-width: 0;

        .album-type {
          font-size: 0.9em;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 10px;
          color: var(--text-color);
          opacity: 0.7;
        }

        .album-name {
          font-size: 3em;
          font-weight: 600;
          margin-bottom: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .album-artist {
          font-size: 1.2em;
          margin-bottom: 10px;
          cursor: pointer;
          color: var(--accent-color);

          &:hover {
            text-decoration: underline;
          }
        }

        .album-stats {
          font-size: 0.9em;
          color: var(--text-color);
          opacity: 0.7;
        }
      }
    }

    .header-actions {
      display: flex;
      gap: 10px;
      align-items: center;

      .menu-container {
        position: relative;

        .q-btn {
          color: var(--text-color);
          opacity: 0.7;
          transition: opacity 0.2s ease;

          &:hover {
            opacity: 1;
          }
        }

        .menu-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: var(--secondary-bg);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          min-width: 160px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 1000;

          .menu-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            cursor: pointer;
            transition: background-color 0.2s ease;

            &:hover {
              background: var(--tertiary-bg);
            }

            .q-icon {
              font-size: 20px;
            }

            span {
              color: var(--text-color);
              font-size: 14px;
            }
          }
        }
      }
    }
  }

  .content {
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
      color: var(--text-color);
      opacity: 0.7;

      .message {
        font-size: 1.2em;
        margin: 10px 0;
      }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
      color: var(--text-color);
      opacity: 0.7;

      .message {
        font-size: 1.2em;
        margin: 10px 0;
      }

      .sub-message {
        font-size: 0.9em;
      }
    }

    .songs-list {
      .list-header {
        display: grid;
        grid-template-columns: 50px 1fr 100px 100px;
        padding: 10px;
        border-bottom: 1px solid var(--border-color);
        font-size: 0.9em;
        color: var(--text-color);
        opacity: 0.7;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .songs-container {
        .song-item {
          display: grid;
          grid-template-columns: 50px 1fr 100px 100px;
          padding: 10px;
          align-items: center;
          border-radius: 10px;
          user-select: none;
          transition: background-color 0.2s ease;

          &:hover {
            background: var(--tertiary-bg);
          }

          .index {
            color: var(--text-color);
            opacity: 0.7;
          }

          .song-title {
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 0;

            img {
              width: 40px;
              height: 40px;
              border-radius: 5px;
              object-fit: cover;
              flex-shrink: 0;
            }

            .text {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }

          .duration {
            color: var(--text-color);
            opacity: 0.7;
          }

          .song-actions {
            display: flex;
            gap: 5px;
            opacity: 0;
            transition: opacity 0.2s ease;
          }

          &:hover .song-actions {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
