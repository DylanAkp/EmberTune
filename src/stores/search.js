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
    async search(query, country) {
      try {
        this.loading = true
        this.error = null
        const results = await window.youtube.searchSongs(query, country)
        this.results = results.content
      } catch (error) {
        if (error.code !== 1002) {
          this.error = error
        } else {
          this.results = []
        }
      } finally {
        this.loading = false
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSearchStore, import.meta.hot))
}
