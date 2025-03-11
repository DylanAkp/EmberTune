import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import fr from './locales/fr.json'

let savedLocale = 'en'
try {
  const settingsData = localStorage.getItem('settings')
  if (settingsData) {
    const settings = JSON.parse(settingsData)
    if (settings.language) {
      savedLocale = settings.language
    }
  }
} catch (e) {
  console.error('Error loading language preference:', e)
}

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    fr,
  },
  globalInjection: true,
})

export default i18n
