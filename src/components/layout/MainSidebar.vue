<script setup>
import StyledButton from '../StyledButton.vue'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import NextSong from './NextSong.vue'

const { t } = useI18n()

const routes = computed(() => [
  { name: t('sidebar.home'), icon: 'mdi-home', path: '/' },
  { name: t('sidebar.likedSongs'), icon: 'mdi-heart', path: '/playlists/liked-songs' },
  { name: t('sidebar.playlists'), icon: 'mdi-playlist-music', path: '/playlists' },
  { name: t('sidebar.history'), icon: 'mdi-history', path: '/playlists/history' },
])
</script>

<template>
  <div class="sidebar no-select">
    <div class="navigation">
      <StyledButton
        v-for="(route, index) in routes"
        :key="index"
        :icon="route.icon"
        :text="route.name"
        variant="nav"
        :active="$route.path === route.path"
        @click="$router.push(route.path)"
      />
    </div>
    <NextSong />
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 15px 15px 15px 0;
  justify-content: space-between;
  border-radius: 0 20px 20px 0;
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  background-color: var(--secondary-bg);
  .navigation {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: 10px;
  }
}
</style>
