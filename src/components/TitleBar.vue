<template>
  <div class="title-bar" :class="{ 'title-bar-maximized': isMaximized }">
    <div class="title-bar-drag-region">
      <div class="title-bar-title">
        <img :src="EmberTuneLogo" alt="EmberTune" class="title-bar-app-logo" />
        <span class="title-bar-app-name">EmberTune</span>
      </div>
    </div>
    <div class="title-bar-controls">
      <button class="title-bar-btn minimize-btn" @click="minimizeWindow">
        <q-icon name="mdi-minus" size="14px" />
      </button>
      <button class="title-bar-btn" @click="toggleMaximize">
        <q-icon :name="isMaximized ? 'mdi-window-restore' : 'mdi-window-maximize'" size="14px" />
      </button>
      <button class="title-bar-btn close-btn" @click="closeWindow">
        <q-icon name="mdi-close" size="14px" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import EmberTuneLogo from 'src/assets/EmberTune.svg'

const isMaximized = ref(false)

// Initialize window state
onMounted(async () => {
  if (window.windowControls) {
    isMaximized.value = await window.windowControls.isMaximized()

    // Listen for window maximize/restore events
    window.windowControls.onMaximizeChange((maximized) => {
      isMaximized.value = maximized
    })
  }
})

// Window control functions
const minimizeWindow = () => {
  if (window.windowControls) {
    window.windowControls.minimize()
  }
}

const toggleMaximize = () => {
  if (window.windowControls) {
    if (isMaximized.value) {
      window.windowControls.restore()
    } else {
      window.windowControls.maximize()
    }
  }
}

const closeWindow = () => {
  if (window.windowControls) {
    window.windowControls.close()
  }
}
</script>

<style lang="scss" scoped>
.title-bar {
  height: var(--titlebar-height);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  -webkit-app-region: drag;
  user-select: none;
  position: relative;
  z-index: 1000;

  &-drag-region {
    flex: 1;
    display: flex;
    align-items: center;
    height: 100%;
  }

  &-title {
    display: flex;
    align-items: center;
    padding-left: 16px;
    gap: 10px;
    img {
      width: 20px;
      height: 20px;
    }
  }

  &-app-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-color);
  }

  &-controls {
    display: flex;
    height: 100%;
  }

  &-btn {
    height: 100%;
    width: 46px;
    background: transparent;
    border: none;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary-text-color);
    -webkit-app-region: no-drag;
    border-radius: 0 0 8px 8px;
    transition: all 0.2s ease;

    &:hover {
      background-color: var(--tertiary-bg);
    }

    &.close-btn:hover {
      background-color: var(--error-color);
      color: white;
    }
  }
}
</style>
