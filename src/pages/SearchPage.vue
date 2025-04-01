<template>
  <div class="search-page">
    <div v-if="searchStore.error" class="error">
      {{ searchStore.error.message }}
    </div>
    <div class="results-list">
      <template v-if="searchStore.loading">
        <SongCard
          v-for="n in 20"
          :key="n"
          skeleton
          title=""
          artist=""
          :thumbnail="[{ url: '', width: 0 }]"
          id=""
        />
      </template>
      <template v-else-if="searchStore.results.length === 0">
        <div class="no-results">No results found</div>
      </template>
      <template v-else>
        <SongCard
          v-for="result in searchStore.results"
          :key="result.id"
          :title="result.title"
          :thumbnail="result.thumbnails"
          :artist="result.artists[0].name"
          :id="result.id"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSearchStore } from 'src/stores/search'
import SongCard from 'src/components/SongCard.vue'
import { useSettingsStore } from 'src/stores/settings'

const route = useRoute()
const searchStore = useSearchStore()
const settingsStore = useSettingsStore()

const performSearch = async (query) => {
  if (query) {
    await searchStore.search(query, settingsStore.contentLanguage)
  }
}

onMounted(() => {
  performSearch(route.query.q)
})

watch(
  () => route.query.q,
  (newQuery) => {
    performSearch(newQuery)
  },
)
</script>

<style lang="scss" scoped>
.search-page {
  .error,
  .no-results {
    text-align: center;
    padding: 20px;
    color: var(--text-color);
  }

  .results-list {
    display: grid;
    align-items: center;
    justify-items: center;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 15px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
}
</style>
