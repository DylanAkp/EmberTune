import { defineStore, acceptHMRUpdate } from 'pinia'

export const useSearchStore = defineStore('search', {
  state: () => ({
    results: [],
    query: '',
    loading: false,
    error: null,
  }),

  getters: {},

  actions: {
    async search(query) {
      try {
        this.loading = true
        const results = await window.youtube.searchSongs(query)
        this.results = results.content
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSearchStore, import.meta.hot))
}
