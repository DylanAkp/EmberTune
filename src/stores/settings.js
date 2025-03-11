import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const discordRich = ref(true)
    const saveHistory = ref(true)
    const language = ref('en')

    function toggleDiscordRich() {
      discordRich.value = !discordRich.value
    }

    function toggleSaveHistory() {
      saveHistory.value = !saveHistory.value
    }

    function setLanguage(lang) {
      language.value = lang
    }

    return {
      discordRich,
      toggleDiscordRich,
      saveHistory,
      toggleSaveHistory,
      language,
      setLanguage,
    }
  },
  {
    persist: true,
  },
)
