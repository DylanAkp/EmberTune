<template>
  <router-view />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const setupDiscordPresence = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  window.discord.updatePresence({
    details: 'Using EmberTune',
    state: 'Not playing',
    largeImageKey: 'idle',
    largeImageText: 'EmberTune',
    startTimestamp: Date.now(),
    type: 2,
  })
}

const clearDiscordPresence = () => {
  window.discord.clearPresence()
}

onMounted(() => {
  setupDiscordPresence()
})

onUnmounted(() => {
  clearDiscordPresence()
})
</script>
