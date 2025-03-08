<template>
  <div v-if="modelValue" class="dialog-overlay" @click="closeDialog">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <h2>Add to Playlist</h2>
        <div class="close-button" @click="closeDialog">
          <q-icon name="mdi-close" size="24px" />
        </div>
      </div>

      <div class="dialog-body">
        <div v-if="playlists.length === 0" class="empty-state">
          <q-icon name="mdi-playlist-music" size="48px" class="icon" />
          <p>No playlists yet</p>
          <button class="btn-create" @click="showCreateDialog = true">Create Playlist</button>
        </div>

        <div v-else class="playlists-list">
          <div
            v-for="playlist in playlists"
            :key="playlist.id"
            class="playlist-item"
            @click="addToPlaylist(playlist.id)"
          >
            <div class="playlist-info">
              <div class="thumbnail">
                <img
                  v-if="playlist.songs.length > 0"
                  :src="playlist.songs[0].thumbnails[0].url"
                  alt="Playlist Cover"
                />
                <q-icon v-else name="mdi-music" size="24px" class="default-icon" />
              </div>
              <div class="details">
                <div class="name">{{ playlist.name }}</div>
                <div class="songs-count">{{ playlist.songs.length }} songs</div>
              </div>
            </div>
            <q-icon
              :name="playlist.hasSong ? 'mdi-minus' : 'mdi-plus'"
              :class="['action-icon', playlist.hasSong ? 'remove' : 'add']"
              size="20px"
            />
          </div>
        </div>

        <div class="create-new" @click="showCreateDialog = true">
          <q-icon name="mdi-plus" size="20px" />
          <span>Create New Playlist</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Create Playlist Dialog -->
  <CreatePlaylistDialog
    v-if="showCreateDialog"
    v-model="showCreateDialog"
    :add-song-after-create="true"
    :song="song"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePlaylistStore } from '../stores/playlist'
import CreatePlaylistDialog from './CreatePlaylistDialog.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  song: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])
const playlistStore = usePlaylistStore()
const showCreateDialog = ref(false)

const playlists = computed(() => {
  return playlistStore.playlists
    .filter((playlist) => playlist.id !== 'liked-songs')
    .map((playlist) => ({
      ...playlist,
      hasSong: playlist.songs.some((s) => s.id === props.song.id),
    }))
})

function closeDialog() {
  emit('update:modelValue', false)
}

function addToPlaylist(playlistId) {
  const playlist = playlists.value.find((p) => p.id === playlistId)
  if (playlist.hasSong) {
    playlistStore.removeSongFromPlaylist(playlistId, props.song.id)
  } else {
    playlistStore.addSongToPlaylist(playlistId, props.song)
  }
  closeDialog()
}
</script>

<style lang="scss" scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background: var(--secondary-bg);
  width: 400px;
  border-radius: 15px;
  overflow: hidden;
}

.dialog-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--tertiary-bg);

  h2 {
    margin: 0;
    color: var(--text-color);
  }

  .close-button {
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }
  }
}

.dialog-body {
  padding: 20px;

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 20px 0;

    .icon {
      opacity: 0.7;
    }

    p {
      margin: 0;
      color: rgba(255, 255, 255, 0.7);
    }

    .btn-create {
      background: var(--accent-color);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  .playlists-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
    max-height: 300px;
    overflow-y: auto;

    .playlist-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.1);

        .action-icon {
          opacity: 1;
        }
      }

      .playlist-info {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
        min-width: 0;

        .thumbnail {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          background: var(--tertiary-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .default-icon {
            opacity: 0.5;
          }
        }

        .details {
          min-width: 0;

          .name {
            font-weight: 500;
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .songs-count {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.7);
          }
        }
      }

      .action-icon {
        opacity: 0.7;
        transition:
          opacity 0.2s,
          color 0.2s;

        &.remove {
          color: var(--negative-color);
        }

        &.add {
          color: var(--accent-color);
        }
      }
    }
  }

  .create-new {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
    color: var(--accent-color);

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
