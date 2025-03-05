<script setup>
const routes = [
  { name: 'Home', icon: 'mdi-home', path: '/' },
  { name: 'Playlists', icon: 'mdi-playlist-music', path: '/playlists' },
]
</script>

<template>
  <div class="sidebar no-select">
    <div class="header">
      <img class="logo" alt="EmberTune Logo" src="src/assets/EmberTune.svg" @click="switchTheme" />
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
</template>

<style lang="scss" scoped>
.sidebar {
  display: flex;
  background-color: var(--secondary-bg);
  flex-direction: column;
  align-items: center;
  padding: 15px;
  height: 100%;
  gap: 20px;
  border-radius: 0 20px 20px 0;
  overflow: none;
  width: 50%;
  max-width: 300px;
  .header {
    display: flex;
    flex-direction: row;
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
    width: 100%;
    background-color: var(--primary-bg);
    flex-direction: row;
    align-items: center;
    gap: 12px;
    width: 100%;
  }
}
</style>
