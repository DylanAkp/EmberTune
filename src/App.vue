<template>
  <div :class="{ 'light-mode': !settings.darkMode }">
    <router-view />
    <UpdateDialog
      v-model="showUpdateDialog"
      :current-version="version"
      :latest-version="latestVersion"
    />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, watch, ref } from 'vue'
import { useSettingsStore } from './stores/settings'
import { version } from '../package.json'
import UpdateDialog from './components/UpdateDialog.vue'
import { i18n } from './boot/i18n'

const settings = useSettingsStore()
const showUpdateDialog = ref(false)
const latestVersion = ref('')

watch(
  () => settings.language,
  (newValue) => {
    i18n.global.locale.value = newValue
  },
  { immediate: true },
)

watch(
  () => settings.darkMode,
  () => {
    settings.applyTheme()
  },
  { immediate: true },
)

const setupDiscordPresence = async () => {
  if (!settings.discordRich) {
    window.discord.clearPresence()
    return
  }

  await new Promise((resolve) => setTimeout(resolve, 1000))

  window.discord.updatePresence({
    details: 'Using EmberTune',
    state: 'Not playing',
    largeImageKey: 'idle',
    largeImageText: 'EmberTune',
    startTimestamp: Date.now(),
  })
}

const clearDiscordPresence = () => {
  window.discord.clearPresence()
}

const checkForUpdates = async () => {
  try {
    const response = await fetch('https://api.github.com/repos/DylanAkp/EmberTune/releases/latest')
    const data = await response.json()
    const latest = data.tag_name.replace('v', '')
    latestVersion.value = latest

    // Compare versions
    const currentParts = version.split('.').map(Number)
    const latestParts = latest.split('.').map(Number)

    for (let i = 0; i < 3; i++) {
      if (latestParts[i] > currentParts[i]) {
        showUpdateDialog.value = true
        break
      } else if (latestParts[i] < currentParts[i]) {
        break
      }
    }
  } catch (error) {
    console.error('Failed to check for updates:', error)
  }
}

watch(
  () => settings.discordRich,
  async (newValue) => {
    if (newValue) {
      await setupDiscordPresence()
    } else {
      clearDiscordPresence()
    }
  },
  { immediate: true },
)

onMounted(() => {
  setupDiscordPresence()
  checkForUpdates()
  settings.applyTheme()
})

onUnmounted(() => {
  clearDiscordPresence()
})
</script>
