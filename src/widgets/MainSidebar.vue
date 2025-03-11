<script setup>
import logoImage from '../assets/EmberTune.svg'
import StyledButton from '../components/StyledButton.vue'

const routes = [
  { name: 'Home', icon: 'mdi-home', path: '/' },
  { name: 'Liked Songs', icon: 'mdi-heart', path: '/playlists/liked-songs' },
  { name: 'Playlists', icon: 'mdi-playlist-music', path: '/playlists' },
  { name: 'History', icon: 'mdi-history', path: '/playlists/history' },
]

const bottomRoutes = [{ name: 'Settings', icon: 'mdi-cog', path: '/settings' }]
</script>

<template>
  <div class="sidebar no-select">
    <div class="top-section">
      <div class="header">
        <img class="logo" alt="EmberTune Logo" :src="logoImage" @click="switchTheme" />
        <div class="brand-name">EmberTune</div>
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
