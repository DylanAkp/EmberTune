<script setup>
import logoImage from '../assets/EmberTune.svg'

const routes = [
  { name: 'Home', icon: 'mdi-home', path: '/' },
  { name: 'Playlists', icon: 'mdi-playlist-music', path: '/playlists' },
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
        <div
          class="nav-item clickable"
          v-for="(route, index) in routes"
          :key="index"
          @click="$router.push(route.path)"
        >
          <q-icon :name="route.icon" size="24px" />
          {{ route.name }}
        </div>
      </div>
    </div>
    <div class="navigation">
      <div
        class="nav-item clickable"
        v-for="(route, index) in bottomRoutes"
        :key="index"
        @click="$router.push(route.path)"
      >
        <q-icon :name="route.icon" size="24px" />
        {{ route.name }}
      </div>
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
  .nav-item {
    display: flex;
    padding: 10px;
    border-radius: 10px;
    font-size: 18px;
    background-color: var(--primary-bg);
    align-items: center;
    gap: 12px;
    width: 100%;
  }
}
</style>
