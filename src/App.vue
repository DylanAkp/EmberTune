<template>
  <router-view />
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useSettingsStore } from './stores/settings'

const settings = useSettingsStore()

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
})

onUnmounted(() => {
  clearDiscordPresence()
})
</script>
