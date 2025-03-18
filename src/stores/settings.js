import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const discordRich = ref(true)
    const saveHistory = ref(true)
    const language = ref('en')
    const darkMode = ref(true)
    const contentLanguage = ref('ZZ')

    function toggleDiscordRich() {
      discordRich.value = !discordRich.value
    }

    function toggleSaveHistory() {
      saveHistory.value = !saveHistory.value
    }

    function setLanguage(lang) {
      language.value = lang
    }

    function setContentLanguage(lang) {
      contentLanguage.value = lang
    }

    function toggleDarkMode() {
      darkMode.value = !darkMode.value
      applyTheme()
    }

    function setDarkMode(value) {
      darkMode.value = value
      applyTheme()
    }

    function applyTheme() {
      if (darkMode.value) {
        document.body.classList.remove('light-mode')
      } else {
        document.body.classList.add('light-mode')
      }
    }

    return {
      discordRich,
      toggleDiscordRich,
      saveHistory,
      toggleSaveHistory,
      language,
      setLanguage,
      darkMode,
      toggleDarkMode,
      setDarkMode,
      applyTheme,
      contentLanguage,
      setContentLanguage,
    }
  },
  {
    persist: true,
  },
)
