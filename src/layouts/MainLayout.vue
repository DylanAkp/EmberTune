<template>
  <div class="main-layout">
    <MainSidebar />
    <router-view />
  </div>
</template>

<script setup>
import MainSidebar from 'src/widgets/MainSidebar.vue'
</script>

<style lang="scss" scoped>
.main-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
}
</style>
