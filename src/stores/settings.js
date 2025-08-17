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
    const overlayShortcut = ref(false)
    const colorAccent = ref('embertune') // Default to EmberTune color

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

    function toggleOverlayShortcut() {
      overlayShortcut.value = !overlayShortcut.value
    }

    function setColorAccent(color) {
      colorAccent.value = color
      applyColorAccent()
    }

    function applyTheme() {
      if (darkMode.value) {
        document.body.classList.remove('light-mode')
      } else {
        document.body.classList.add('light-mode')
      }
    }

    function applyColorAccent() {
      const root = document.documentElement
      let accentColor = '#eb8400'

      switch (colorAccent.value) {
        case 'spotagreen':
          accentColor = '#3be478'
          break
        case 'youred':
          accentColor = '#ff0034'
          break
        case 'googlish':
          accentColor = '#4080ee'
          break
        case 'embertune':
        default:
          accentColor = '#eb8400'
          break
      }

      root.style.setProperty('--accent-color', accentColor)
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
      overlayShortcut,
      toggleOverlayShortcut,
      colorAccent,
      setColorAccent,
      applyColorAccent,
    }
  },
  {
    persist: true,
  },
)
