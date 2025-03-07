<template>
  <div class="setting-icon">
    <q-icon size="25px" name="mdi-cog" @click="$router.push('/settings')" />
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.setting-icon {
  position: fixed;
  top: calc(var(--content-padding) + 10px);
  right: calc(var(--content-padding) + 10px);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--secondary-bg);
  width: 40px;
  min-width: 40px;
  max-width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  align-items: center;
}
</style>
