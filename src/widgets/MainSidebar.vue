<script setup>
import logoImage from '../assets/EmberTune.svg'
import StyledButton from '../components/StyledButton.vue'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()

const routes = computed(() => [
  { name: t('sidebar.home'), icon: 'mdi-home', path: '/' },
  { name: t('sidebar.likedSongs'), icon: 'mdi-heart', path: '/playlists/liked-songs' },
  { name: t('sidebar.playlists'), icon: 'mdi-playlist-music', path: '/playlists' },
  { name: t('sidebar.history'), icon: 'mdi-history', path: '/playlists/history' },
])

const bottomRoutes = computed(() => [
  { name: t('sidebar.settings'), icon: 'mdi-cog', path: '/settings' },
])
</script>

<template>
  <div class="sidebar no-select">
    <div class="top-section">
      <div class="header">
        <img class="logo" alt="EmberTune Logo" :src="logoImage" />
        <div class="brand-name">{{ t('app.name') }}</div>
      </div>
      <div class="navigation">
        <StyledButton
          v-for="(route, index) in routes"
          :key="index"
          :icon="route.icon"
          :text="route.name"
          variant="default"
          :active="$route.path === route.path"
          @click="$router.push(route.path)"
        />
      </div>
    </div>
    <div class="navigation">
      <StyledButton
        v-for="(route, index) in bottomRoutes"
        :key="index"
        :icon="route.icon"
        :text="route.name"
        variant="default"
        :active="$route.path === route.path"
        @click="$router.push(route.path)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  display: flex;
  background-color: var(--secondary-bg);
  flex-direction: column;
  align-items: center;
  padding: 15px;
  height: 100%;
  justify-content: space-between;
  border-radius: 0 20px 20px 0;
  width: var(--sidebar-width);
  max-width: var(--sidebar-width);
  .top-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 20px;
  }
  .header {
    display: flex;
    align-items: center;
    .brand-name {
      margin-top: 10px;
      font-size: 35px;
      margin-left: 10px;
      font-weight: 600;
    }
    .logo {
      width: 70px;
      height: 70px;
    }
  }
  .navigation {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 10px;
  }
}
</style>
