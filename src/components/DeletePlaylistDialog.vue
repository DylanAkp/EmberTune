<template>
  <div v-if="modelValue" class="dialog-overlay" @click="closeDialog">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <h2>Delete Playlist</h2>
        <div class="close-button" @click="closeDialog">
          <q-icon name="mdi-close" size="24px" />
        </div>
      </div>

      <div class="dialog-body">
        <p>Are you sure you want to delete "{{ playlistName }}"?</p>
        <p class="warning">This action cannot be undone.</p>
      </div>

      <div class="dialog-actions">
        <button class="btn-cancel" @click="closeDialog">Cancel</button>
        <button class="btn-delete" @click="handleDelete">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePlaylistStore } from '../stores/playlist'
import { useRouter } from 'vue-router'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  playlistId: {
    type: String,
    required: true,
  },
  playlistName: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])
const playlistStore = usePlaylistStore()
const router = useRouter()

function closeDialog() {
  emit('update:modelValue', false)
}

function handleDelete() {
  playlistStore.deletePlaylist(props.playlistId)
  closeDialog()
  router.push('/playlists')
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

  p {
    margin: 0;
    color: var(--text-color);
    font-size: 16px;
    line-height: 1.5;

    &.warning {
      margin-top: 8px;
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
    }
  }
}

.dialog-actions {
  padding: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid var(--tertiary-bg);

  button {
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
    }
  }

  .btn-cancel {
    background: var(--tertiary-bg);
    color: var(--text-color);
  }

  .btn-delete {
    background: #dc2626; // A nice red color for delete
    color: white;
  }
}
</style>
