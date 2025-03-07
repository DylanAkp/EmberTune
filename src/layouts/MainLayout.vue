<template>
  <div class="main-layout">
    <MainSidebar />

    <div class="main-content">
      <SearchBar />
      <div class="router-view-container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import MainSidebar from 'src/widgets/MainSidebar.vue'
import SearchBar from 'src/widgets/SearchBar.vue'
</script>

<style lang="scss" scoped>
.main-layout {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  .main-content {
    padding: var(--content-padding);
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow-y: auto;

    .router-view-container {
      margin-top: var(--search-bar-spacing);
    }
  }
}
</style>
