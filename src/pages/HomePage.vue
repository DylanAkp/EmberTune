<template>
  <div class="welcome-container">
    <div class="charts-container">
      <h2 class="section-title">{{ t('home.trending') }}</h2>
      <div v-if="error" class="error">{{ error }}</div>
      <div class="charts-grid">
        <template v-if="loading">
          <SongCard
            v-for="n in 100"
            :key="n"
            skeleton
            title=""
            artist=""
            :thumbnail="[{ url: '', width: 0 }]"
            id=""
          />
        </template>
        <template v-else>
          <SongCard
            v-for="song in chartMusic"
            :key="song.id"
            :title="song.title"
            :thumbnail="song.thumbnails"
            :artist="song.artists[0].name"
            :id="song.id"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import SongCard from '../components/SongCard.vue'
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '../stores/settings'

const { t } = useI18n()
const settingsStore = useSettingsStore()
const chartMusic = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const charts = await window.youtube.getCharts(settingsStore.contentLanguage)
    chartMusic.value = charts.musics
  } catch (err) {
    error.value = err.message || 'Failed to load charts'
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.welcome-container {
  height: 100%;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.charts-container {
  width: 100%;
  max-width: 1200px;
  padding-bottom: 10px;
}

.section-title {
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-color);
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
  width: 100%;
}

.loading,
.error {
  text-align: center;
  padding: 20px;
  color: var(--text-color);
  font-size: 1.1rem;
}
</style>
