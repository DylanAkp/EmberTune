<template>
  <div v-if="playlist" class="playlist-detail">
    <div class="header">
      <div class="playlist-info">
        <div class="thumbnail">
          <q-icon v-if="playlist.id === 'liked-songs'" name="mdi-heart" color="red" size="96px" />
          <q-icon
            v-else-if="playlist.id === 'history'"
            name="mdi-history"
            color="orange"
            size="96px"
          />
          <img
            v-else-if="playlist.songs.length > 0"
            :src="getOptimalThumbnail(playlist.songs[0].thumbnails, 200)"
            alt="Playlist Cover"
          />
          <q-icon v-else name="mdi-music" size="96px" class="default-icon" />
        </div>
        <div class="info">
          <div class="playlist-type">
            {{ playlist.isDefault ? t('playlists.defaultPlaylist') : t('playlists.playlist') }}
          </div>
          <div
            class="playlist-name"
            :contenteditable="!playlist.isDefault"
            @blur="updateName"
            ref="nameElement"
          >
            {{ playlist.name }}
          </div>
          <div class="playlist-stats">{{ playlist.songs.length }} {{ t('common.songs') }}</div>
        </div>
      </div>
      <div class="header-actions">
        <StyledButton icon="mdi-play" variant="accent" @click="playPlaylist" />
        <div v-if="!playlist.isDefault || playlist.id === 'history'" class="menu-container">
          <q-btn flat round icon="mdi-dots-vertical" size="md" @click="showMenu = !showMenu" />
          <div v-if="showMenu" class="menu-dropdown">
            <div v-if="playlist.id === 'history'" class="menu-item" @click="clearHistory">
              <q-icon name="mdi-delete-sweep" color="negative" />
              <span>{{ t('playlists.clearHistory') }}</span>
            </div>
            <div v-if="!playlist.isDefault" class="menu-item" @click="confirmDelete = true">
              <q-icon name="mdi-delete" color="negative" />
              <span>{{ t('common.delete') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div v-if="playlist.songs.length === 0" class="empty-state">
        <q-icon name="mdi-playlist-music" size="64px" />
        <div class="message">{{ t('playlists.empty') }}</div>
        <div class="sub-message">
          {{
            playlist.id === 'history' ? t('playlists.emptyHistory') : t('playlists.emptySuggestion')
          }}
        </div>
      </div>
      <div v-else class="songs-list">
        <div class="list-header">
          <div class="index">#</div>
          <div class="title">{{ t('common.title') }}</div>
          <div class="artist">{{ t('common.artist') }}</div>
          <div class="actions"></div>
        </div>
        <div class="songs-container">
          <div
            v-for="(song, index) in playlist.songs"
            :key="song.id"
            class="song-item"
            :draggable="!playlist.isDefault && playlist.id !== 'history'"
            @dragstart="dragStart($event, index)"
            @dragover.prevent
            @dragenter.prevent
            @drop="handleDrop($event, index)"
            :class="{ 'is-dragging': draggedIndex === index }"
          >
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
            <div class="artist">{{ formatArtists(song) }}</div>
            <div class="song-actions">
              <q-btn flat round icon="mdi-play" size="sm" @click="playSong(song)" />
              <q-btn
                flat
                round
                icon="mdi-delete"
                size="sm"
                color="negative"
                @click="removeSong(song.id)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <DeletePlaylistDialog
      v-model="confirmDelete"
      :playlist-id="playlist.id"
      :playlist-name="playlist.name"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlaylistStore } from '../stores/playlist'
import { usePlayerStore } from '../stores/player'
import { useI18n } from 'vue-i18n'
import DeletePlaylistDialog from '../components/DeletePlaylistDialog.vue'
import StyledButton from '../components/StyledButton.vue'
import { getOptimalThumbnail } from '../utils/thumbnail'

const route = useRoute()
const router = useRouter()
const playlistStore = usePlaylistStore()
const playerStore = usePlayerStore()
const nameElement = ref(null)
const confirmDelete = ref(false)
const draggedIndex = ref(-1)
const showMenu = ref(false)
const { t } = useI18n()

const playlist = computed(() => {
  return playlistStore.playlists.find((p) => p.id === route.params.id)
})

onMounted(() => {
  if (!playlist.value) {
    router.push('/playlists')
  }

  document.addEventListener('click', (e) => {
    const menuContainer = document.querySelector('.menu-container')
    if (menuContainer && !menuContainer.contains(e.target)) {
      showMenu.value = false
    }
  })
})

function updateName(event) {
  const newName = event.target.innerText.trim()
  if (newName && newName !== playlist.value.name) {
    playlistStore.renamePlaylist(playlist.value.id, newName)
  } else {
    event.target.innerText = playlist.value.name
  }
}

function dragStart(event, index) {
  if (playlist.value.isDefault) return
  draggedIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
}

function handleDrop(event, dropIndex) {
  if (playlist.value.isDefault) return
  event.preventDefault()
  if (draggedIndex.value === dropIndex) return

  playlistStore.reorderPlaylist(playlist.value.id, draggedIndex.value, dropIndex)
  draggedIndex.value = -1
}

function removeSong(songId) {
  playlistStore.removeSongFromPlaylist(playlist.value.id, songId)
}

function playSong(song) {
  if (playlist.value.id === 'history') {
    playerStore.play(song.id)
  } else {
    const songIndex = playlist.value.songs.findIndex((s) => s.id === song.id)
    playerStore.playPlaylist(playlist.value.songs, songIndex)
  }
}

function playPlaylist() {
  if (playlist.value.songs.length > 0) {
    playerStore.playPlaylist(playlist.value.songs)
  }
}

function formatArtists(song) {
  // Why tf you have 2 different variables for artists YouTube?
  if (typeof song.artist === 'string') return song.artist

  if (song.artists && typeof song.artists === 'object' && !Array.isArray(song.artists)) {
    if (song.artists.artist) return song.artists.artist
    if (song.artists.artists) song.artists = song.artists.artists
  }

  if (!song.artists) return t('common.unknownArtist')
  if (Array.isArray(song.artists)) {
    return song.artists
      .map((artist) => {
        if (typeof artist === 'string') return artist
        return artist.name
      })
      .join(', ')
  }
  return t('common.unknownArtist')
}

function clearHistory() {
  playlistStore.clearHistory()
}
</script>

<style lang="scss" scoped>
.playlist-detail {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 40px;

    .playlist-info {
      display: flex;
      gap: 20px;

      .thumbnail {
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

        .playlist-type {
          font-size: 0.9em;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 10px;
          color: var(--text-color);
          opacity: 0.7;
        }

        .playlist-name {
          font-size: 3em;
          font-weight: 600;
          margin-bottom: 10px;
          outline: none;

          &[contenteditable='true']:hover {
            background: var(--tertiary-bg);
            border-radius: 5px;
          }
        }

        .playlist-stats {
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
        grid-template-columns: 50px 1fr 1fr 100px;
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
          grid-template-columns: 50px 1fr 1fr 100px;
          padding: 10px;
          align-items: center;
          border-radius: 10px;
          cursor: move;
          user-select: none;
          transition: background-color 0.2s ease;

          &:hover {
            background: var(--tertiary-bg);
          }

          &.is-dragging {
            opacity: 0.5;
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

          .artist {
            color: var(--text-color);
            opacity: 0.7;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
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
