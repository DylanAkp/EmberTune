import { defineStore, acceptHMRUpdate } from 'pinia'

export const useSearchStore = defineStore('search', {
  state: () => ({
    results: {
      songs: [],
    },
    query: '',
    loading: false,
    error: null,
  }),

  getters: {},

  actions: {
    async search(query, country) {
      try {
        this.loading = true
        this.error = null
        const results = await window.youtube.search(query, country)
        this.results = results
      } catch (error) {
        console.error('Search error:', error)
        this.results = { songs: [] }
      } finally {
        this.loading = false
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSearchStore, import.meta.hot))
}
