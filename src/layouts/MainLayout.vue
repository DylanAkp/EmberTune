<template>
  <div class="main-layout">
    <TitleBar />

    <div class="layout-content">
      <MainSidebar />

      <div class="main-content">
        <SearchBar />
        <div class="router-view-container">
          <router-view />
        </div>
      </div>

      <PlayBar />
    </div>
  </div>
</template>

<script setup>
import MainSidebar from 'src/widgets/MainSidebar.vue'
import SearchBar from 'src/widgets/SearchBar.vue'
import PlayBar from 'src/components/PlayBar.vue'
import TitleBar from 'src/components/TitleBar.vue'
</script>

<style lang="scss" scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.layout-content {
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow: hidden;

  .main-content {
    padding: var(--content-padding);
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding-bottom: 90px;

    .router-view-container {
      margin-top: var(--search-bar-spacing);
      margin-bottom: var(--playbar-safe-height);
    }
  }
}
</style>
