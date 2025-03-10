import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const discordRich = ref(true)
    const saveHistory = ref(true)

    function toggleDiscordRich() {
      discordRich.value = !discordRich.value
    }

    function toggleSaveHistory() {
      saveHistory.value = !saveHistory.value
    }

    return {
      discordRich,
      toggleDiscordRich,
      saveHistory,
      toggleSaveHistory,
    }
  },
  {
    persist: true,
  },
)
