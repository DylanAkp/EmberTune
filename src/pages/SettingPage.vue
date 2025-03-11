<template>
  <div>
    <h1>Settings</h1>
    <template v-for="(section, sectionName) in Settings" :key="sectionName">
      <h2>{{ sectionName }}</h2>
      <div v-for="(setting, key) in section" :key="key" class="toggle-container">
        <div class="label-container">
          <span class="toggle-label">{{ setting.label }}</span>
          <div class="toggle-description">
            {{ setting.description }}
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
      </div>
    </template>
  </div>
</template>

<script setup>
import { useSettingsStore } from 'src/stores/settings'
import { watch } from 'vue'
import { i18n } from 'src/boot/i18n'

const Settings = {
  General: {
    saveHistory: {
      label: 'Save Play History',
      description: 'Save your listening history to view and access recently played tracks.',
      type: 'boolean',
    },
    language: {
      label: 'Language',
      description: 'Select your preferred language for the application interface.',
      type: 'select',
      options: [
        { value: 'en', label: 'English' },
        { value: 'fr', label: 'Français' },
      ],
    },
  },
  Advanced: {
    discordRich: {
      label: 'Enable Discord Rich Presence',
      description: 'This will show the current song playing in your Discord status.',
      type: 'boolean',
    },
  },
}

const settingsStore = useSettingsStore()

// Apply language change
const handleSelectChange = (key, value) => {
  if (key === 'language') {
    i18n.global.locale.value = value
  }
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
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }
  }
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
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='6' viewBox='0 0 12 6'%3E%3Cpath fill='%23ffffff' d='M6 6L0 0h12z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  cursor: pointer;

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
