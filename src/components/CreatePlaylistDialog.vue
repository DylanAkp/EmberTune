<template>
  <div v-if="modelValue" class="dialog-overlay" @click="closeDialog">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <h2>{{ t('dialogs.createPlaylist.title') }}</h2>
        <div class="close-button" @click="closeDialog">
          <q-icon name="mdi-close" size="24px" />
        </div>
      </div>

      <div class="dialog-body">
        <div class="input-group">
          <input
            type="text"
            v-model="playlistName"
            :placeholder="t('dialogs.createPlaylist.placeholder')"
            @keyup.enter="handleCreate"
            ref="inputRef"
          />
        </div>
      </div>

      <div class="dialog-actions">
        <button class="btn-cancel" @click="closeDialog">{{ t('common.cancel') }}</button>
        <button class="btn-create" :disabled="!playlistName" @click="handleCreate">
          {{ t('common.create') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { usePlaylistStore } from '../stores/playlist'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  addSongAfterCreate: {
    type: Boolean,
    default: false,
  },
  song: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const playlistStore = usePlaylistStore()
const playlistName = ref('')
const inputRef = ref(null)

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      playlistName.value = ''
      setTimeout(() => {
        inputRef.value?.focus()
      }, 100)
    }
  },
)

function closeDialog() {
  emit('update:modelValue', false)
}

function handleCreate() {
  if (playlistName.value) {
    playlistStore.createPlaylist(playlistName.value)

    // If we need to add a song after creation (used in PlayBar)
    if (props.addSongAfterCreate && props.song) {
      const newPlaylist = playlistStore.playlists[playlistStore.playlists.length - 1]
      playlistStore.addSongToPlaylist(newPlaylist.id, props.song)
    }

    closeDialog()
  }
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

  .input-group {
    input {
      width: 100%;
      padding: 12px;
      background: var(--tertiary-bg);
      border: none;
      border-radius: 8px;
      color: var(--text-color);
      font-size: 16px;
      outline: none;
      transition: box-shadow 0.2s;

      &:focus {
        box-shadow: 0 0 0 2px var(--accent-color);
      }

      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
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

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .btn-cancel {
    background: var(--tertiary-bg);
    color: var(--text-color);
  }

  .btn-create {
    background: var(--accent-color);
    color: white;
  }
}
</style>
