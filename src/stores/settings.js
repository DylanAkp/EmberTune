import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const discordRich = ref(true)

    function toggleDiscordRich() {
      discordRich.value = !discordRich.value
    }

    return {
      discordRich,
      toggleDiscordRich,
    }
  },
  {
    persist: true,
  },
)
