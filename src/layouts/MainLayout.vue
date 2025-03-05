<template>
  <div class="main-layout">
    <MainSidebar />
    <div class="main-content">
      <SearchBar />
      <router-view />
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
  .main-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
}
</style>
