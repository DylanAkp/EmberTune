<template>
  <div v-if="modelValue" class="dialog-overlay" @click="closeDialog">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <h2>{{ t('dialogs.update.title') }}</h2>
        <div class="close-button" @click="closeDialog">
          <q-icon name="mdi-close" size="24px" />
        </div>
      </div>

      <div class="dialog-body">
        <div class="update-info">
          <q-icon name="mdi-update" size="48px" class="icon" />
          <p>{{ t('dialogs.update.message') }}</p>
          <div class="version-info">
            <span>{{ t('dialogs.update.currentVersion') }}: {{ currentVersion }}</span>
            <span>{{ t('dialogs.update.latestVersion') }}: {{ latestVersion }}</span>
          </div>
          <div class="actions">
            <button class="btn-update" @click="openDownloadPage">
              {{ t('dialogs.update.downloadButton') }}
            </button>
            <button class="btn-later" @click="closeDialog">{{ t('common.later') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  currentVersion: {
    type: String,
    required: true,
  },
  latestVersion: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

function closeDialog() {
  emit('update:modelValue', false)
}

function openDownloadPage() {
  window.shell.openExternal('https://github.com/DylanAkp/EmberTune/releases/latest')
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

  .update-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 20px 0;
    text-align: center;

    .icon {
      opacity: 0.7;
      color: var(--accent-color);
    }

    p {
      margin: 0;
      font-size: 1.1em;
      color: var(--text-color);
    }

    .version-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
      color: var(--secondary-text-color);
    }

    .actions {
      display: flex;
      gap: 12px;
      margin-top: 8px;

      button {
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

      .btn-update {
        background: var(--accent-color);
        color: white;
      }

      .btn-later {
        background: var(--tertiary-bg);
        color: var(--text-color);
      }
    }
  }
}
</style>
