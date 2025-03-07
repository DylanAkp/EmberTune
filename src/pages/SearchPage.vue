<template>
  <div class="search-page">
    <div v-if="searchStore.loading" class="loading">Loading...</div>
    <div v-else-if="searchStore.error" class="error">
      {{ searchStore.error.message }}
    </div>
    <div v-else class="search-results">
      <div v-if="searchStore.results.length === 0" class="no-results">No results found</div>
      <div v-else class="results-list">
        <div v-for="result in searchStore.results" :key="result.id">
          <SongCard
            :title="result.title"
            :thumbnail="result.thumbnails"
            :artist="result.artists[0].name"
            :id="result.id"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSearchStore } from 'src/stores/search'
import SongCard from 'src/components/SongCard.vue'
const route = useRoute()
const searchStore = useSearchStore()

const performSearch = async (query) => {
  if (query) {
    await searchStore.search(query)
  }
  console.log(searchStore.results)
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
  padding: 20px;

  .loading,
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
