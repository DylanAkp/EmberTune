<template>
  <div class="search-page">
    <div v-if="searchStore.error" class="error">
      {{ searchStore.error.message }}
    </div>
    <div>
      <template v-if="searchStore.loading">
        <div class="cards-row">
          <SongCard
            v-for="n in 20"
            :key="n"
            skeleton
            title=""
            artist=""
            :thumbnail="[{ url: '', width: 0 }]"
            id=""
          />
        </div>
      </template>
      <template
        v-else-if="!searchStore.results?.songs?.length && !searchStore.results?.artists?.length"
      >
        <div class="no-results">
          {{ $t('search.noResults') }}
        </div>
      </template>
      <template v-else>
        <div v-if="searchStore.results.artists?.length" class="section">
          <h3>
            {{ $t('search.artists') }}
          </h3>
          <div class="cards-row">
            <ArtistCard
              v-for="result in searchStore.results.artists"
              :key="result.id"
              :artist="result.name"
              :thumbnail="result.thumbnails"
              :followers="result.followers"
            />
          </div>
        </div>
        <div v-if="searchStore.results.albums?.length" class="section albums-section">
          <h3>
            {{ $t('search.albums') }}
          </h3>
          <div class="cards-row">
            <AlbumCard
              v-for="result in searchStore.results.albums"
              :key="result.id"
              :title="result.name"
              :thumbnail="result.thumbnails"
              :artist="result.artists[0].name"
              :id="result.id"
            />
          </div>
        </div>
        <div v-if="searchStore.results.songs?.length" class="section">
          <h3>
            {{ $t('search.songs') }}
          </h3>
          <div class="cards-row">
            <SongCard
              v-for="result in searchStore.results.songs"
              :key="result.id"
              :title="result.title"
              :thumbnail="result.thumbnails"
              :artist="result.artists[0].name"
              :id="result.id"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSearchStore } from 'src/stores/search'
import SongCard from 'src/components/SongCard.vue'
import ArtistCard from 'src/components/ArtistCard.vue'
import AlbumCard from 'src/components/AlbumCard.vue'
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

  .section {
    h3 {
      color: var(--text-color);
      font-weight: 600;
      font-size: 20px;
    }

    &.albums-section {
      .cards-row {
        flex-wrap: nowrap;
        overflow-x: auto;
        padding-bottom: 15px;
      }
    }
  }

  .cards-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 15px;
  }
}
</style>
