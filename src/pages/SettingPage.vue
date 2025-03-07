<template>
  <div>
    <h1>Settings</h1>
    <h2>Discord Rich Presence</h2>
    <div class="toggle-container">
      <label class="toggle">
        <input type="checkbox" v-model="settingsStore.discordRich" />
        <span class="toggle-slider"></span>
      </label>
      <span class="toggle-label">Enable Discord Rich Presence</span>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from 'src/stores/settings'

const settingsStore = useSettingsStore()
</script>

<style lang="scss" scoped>
.toggle-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;

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

.toggle-label {
  color: var(--text-color);
  font-size: 16px;
}
</style>
