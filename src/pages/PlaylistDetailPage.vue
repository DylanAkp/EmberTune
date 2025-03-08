<template>
  <div v-if="playlist" class="playlist-detail">
    <div class="header">
      <div class="playlist-info">
        <div class="thumbnail">
          <q-icon v-if="playlist.id === 'liked-songs'" name="mdi-heart" color="red" size="96px" />
          <img
            v-else-if="playlist.songs.length > 0"
            :src="playlist.songs[0].thumbnails[0].url"
            alt="Playlist Cover"
          />
          <q-icon v-else name="mdi-music" size="96px" class="default-icon" />
        </div>
        <div class="info">
          <div class="playlist-type">
            {{ playlist.isDefault ? 'Default Playlist' : 'Playlist' }}
          </div>
          <div
            class="playlist-name"
            :contenteditable="!playlist.isDefault"
            @blur="updateName"
            ref="nameElement"
          >
            {{ playlist.name }}
          </div>
          <div class="playlist-stats">{{ playlist.songs.length }} songs</div>
        </div>
      </div>
      <div class="actions" v-if="!playlist.isDefault">
        <q-btn flat round color="primary" icon="mdi-play" @click="playPlaylist" />
        <q-btn flat round color="negative" icon="mdi-delete" @click="confirmDelete = true" />
      </div>
    </div>

    <div class="content">
      <div v-if="playlist.songs.length === 0" class="empty-state">
        <q-icon name="mdi-playlist-music" size="64px" />
        <div class="message">This playlist is empty</div>
        <div class="sub-message">Add songs while playing music</div>
      </div>
      <div v-else class="songs-list">
        <div class="list-header">
          <div class="index">#</div>
          <div class="title">Title</div>
          <div class="artist">Artist</div>
          <div class="actions"></div>
        </div>
        <div class="songs-container">
          <div
            v-for="(song, index) in playlist.songs"
            :key="song.id"
            class="song-item"
            draggable="true"
            @dragstart="dragStart($event, index)"
            @dragover.prevent
            @dragenter.prevent
            @drop="handleDrop($event, index)"
            :class="{ 'is-dragging': draggedIndex === index }"
          >
            <div class="index">{{ index + 1 }}</div>
            <div class="title">
              <img :src="song.thumbnails[0].url" alt="Song Thumbnail" />
              {{ song.title }}
            </div>
            <div class="artist">{{ formatArtists(song) }}</div>
            <div class="actions">
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
import DeletePlaylistDialog from '../components/DeletePlaylistDialog.vue'

const route = useRoute()
const router = useRouter()
const playlistStore = usePlaylistStore()
const playerStore = usePlayerStore()
const nameElement = ref(null)
const confirmDelete = ref(false)
const draggedIndex = ref(-1)

const playlist = computed(() => {
  return playlistStore.playlists.find((p) => p.id === route.params.id)
})

onMounted(() => {
  if (!playlist.value) {
    router.push('/playlists')
  }
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
  playerStore.play(song.id)
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

  if (!song.artists) return 'Unknown Artist'
  if (Array.isArray(song.artists)) {
    return song.artists
      .map((artist) => {
        if (typeof artist === 'string') return artist
        return artist.name
      })
      .join(', ')
  }
  return 'Unknown Artist'
}
</script>

<style lang="scss" scoped>
.playlist-detail {
  padding: 20px;

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
          color: rgba(255, 255, 255, 0.7);
        }

        .playlist-name {
          font-size: 3em;
          font-weight: 600;
          margin-bottom: 10px;
          outline: none;

          &[contenteditable='true']:hover {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 5px;
          }
        }

        .playlist-stats {
          font-size: 0.9em;
          color: rgba(255, 255, 255, 0.7);
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
      color: rgba(255, 255, 255, 0.7);

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
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 0.9em;
        color: rgba(255, 255, 255, 0.7);
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
            background: rgba(255, 255, 255, 0.1);
          }

          &.is-dragging {
            opacity: 0.5;
            background: rgba(255, 255, 255, 0.05);
          }

          .index {
            color: rgba(255, 255, 255, 0.7);
          }

          .title {
            display: flex;
            align-items: center;
            gap: 10px;

            img {
              width: 40px;
              height: 40px;
              border-radius: 5px;
              object-fit: cover;
            }
          }

          .artist {
            color: rgba(255, 255, 255, 0.7);
          }

          .actions {
            display: flex;
            gap: 5px;
            opacity: 0;
            transition: opacity 0.2s ease;
          }

          &:hover .actions {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
