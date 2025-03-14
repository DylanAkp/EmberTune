<template>
  <div>
    <h1>{{ t('settings.title') }}</h1>
    <template v-for="(section, sectionName) in Settings" :key="sectionName">
      <h2>{{ t(`settings.sections.${sectionName.toLowerCase()}`) }}</h2>
      <div v-for="(setting, key) in section" :key="key" class="toggle-container">
        <div class="label-container">
          <span class="toggle-label">{{ t(`settings.options.${key}.label`) }}</span>
          <div class="toggle-description">
            {{ t(`settings.options.${key}.description`) }}
          </div>
        </div>
        <label v-if="setting.type === 'boolean'" class="toggle">
          <input type="checkbox" v-model="settingsStore[key]" />
          <span class="toggle-slider"></span>
        </label>
        <select
          v-else-if="setting.type === 'select'"
          v-model="settingsStore[key]"
          class="select-input"
          @change="handleSelectChange(key, settingsStore[key])"
        >
          <option v-for="option in setting.options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <StyledButton
          v-else-if="setting.type === 'button'"
          :variant="key === 'version' && updateStatus === 'upToDate' ? 'success' : 'accent'"
          :text="
            key === 'version' && updateStatus === 'upToDate'
              ? t('updates.upToDate')
              : key === 'version' && updateStatus === 'checking'
                ? t('common.loading')
                : t(setting.buttonText)
          "
          :icon="key === 'version' && updateStatus === 'upToDate' ? 'mdi-check' : 'mdi-refresh'"
          @click="setting.action"
          :class="{ checking: key === 'version' && updateStatus === 'checking' }"
        />
      </div>
    </template>

    <!-- Update Dialog -->
    <UpdateDialog
      v-model="showUpdateDialog"
      :current-version="version"
      :latest-version="latestVersion"
    />
  </div>
</template>

<script setup>
import { useSettingsStore } from 'src/stores/settings'
import { watch, ref } from 'vue'
import { i18n } from 'src/boot/i18n'
import { useI18n } from 'vue-i18n'
import { version } from '../../package.json'
import StyledButton from 'src/components/StyledButton.vue'
import UpdateDialog from 'src/components/UpdateDialog.vue'
import { checkForUpdates } from 'src/utils/updateChecker'

const { t } = useI18n()
const showUpdateDialog = ref(false)
const latestVersion = ref('')
const settingsStore = useSettingsStore()
const updateStatus = ref('') // 'upToDate', 'checking', or empty

// Apply language change
const handleSelectChange = (key, value) => {
  if (key === 'language') {
    i18n.global.locale.value = value
  }
}

// Check for updates
const handleUpdateCheck = async () => {
  updateStatus.value = 'checking'

  try {
    const { updateAvailable, latestVersion: latest } = await checkForUpdates(version)
    latestVersion.value = latest

    if (updateAvailable) {
      // Show the update dialog
      updateStatus.value = ''
      showUpdateDialog.value = true
    } else {
      // Show that the app is up to date with the button style
      updateStatus.value = 'upToDate'

      // Reset status after 3 seconds
      setTimeout(() => {
        updateStatus.value = ''
      }, 3000)
    }
  } catch (error) {
    console.error('Failed to check for updates:', error)
    updateStatus.value = ''
  }
}

// Define Settings object after the functions are declared
const Settings = {
  General: {
    saveHistory: {
      type: 'boolean',
    },
    language: {
      type: 'select',
      options: [
        { value: 'en', label: 'English' },
        { value: 'fr', label: 'Français' },
      ],
    },
    darkMode: {
      type: 'boolean',
    },
  },
  Advanced: {
    discordRich: {
      type: 'boolean',
    },
    version: {
      type: 'button',
      buttonText: 'settings.checkUpdates',
      action: handleUpdateCheck,
    },
  },
}

// Initialize language from settings on load
watch(
  () => settingsStore.language,
  (newValue) => {
    i18n.global.locale.value = newValue
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
.toggle-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));

  &:last-of-type {
    border-bottom: none;
    margin-bottom: 24px;
  }
}

.toggle {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  flex-shrink: 0;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .toggle-slider {
      background-color: var(--accent-color);
    }

    &:checked + .toggle-slider:before {
      transform: translateX(26px);
    }
  }

  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--tertiary-bg);
    transition: 0.4s;
    border-radius: 24px;

    &:before {
      position: absolute;
      content: '';
      height: 16px;
      width: 16px;
      left: 4px;
      bottom: 4px;
      background-color: var(--text-color);
      transition: 0.4s;
      border-radius: 50%;
    }
  }
}

.checking {
  opacity: 0.7;
  cursor: progress;
}

.select-input {
  height: 36px;
  min-width: 120px;
  padding: 0 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
  background-color: var(--secondary-bg, #2a2a2a);
  color: var(--text-color, #ffffff);
  font-size: 14px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='6' viewBox='0 0 12 6'%3E%3Cpath fill='%23dfe0e7' d='M6 6L0 0h12z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  cursor: pointer;

  .light-mode & {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='6' viewBox='0 0 12 6'%3E%3Cpath fill='%231a1a1a' d='M6 6L0 0h12z'/%3E%3C/svg%3E");
  }

  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
}

.toggle-label {
  color: var(--text-color);
  font-size: 16px;
  margin-bottom: 4px;
}

.toggle-description {
  color: var(--text-color);
  opacity: 0.7;
  font-size: 14px;
  margin-top: 4px;
}

.label-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>
