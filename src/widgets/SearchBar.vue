<template>
  <div class="search-bar">
    <input
      class="search-input"
      type="text"
      :placeholder="t('common.search')"
      v-model="searchQuery"
      @keyup.enter="handleSearch"
    />
    <div class="search-icon" @click="handleSearch">
      <q-icon size="25px" name="mdi-magnify" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchQuery.value },
    })
  }
}
</script>

<style lang="scss" scoped>
.search-bar {
  position: fixed;
  top: var(--content-padding);
  left: calc(var(--sidebar-width) + (100% - var(--sidebar-width)) / 2);
  transform: translateX(-50%);
  z-index: 100;
  background-color: var(--secondary-bg);
  width: fit-content;
  max-width: calc(100% - var(--sidebar-width) - 40px);
  border-radius: calc(var(--search-bar-total-height) / 2);
  padding: 5px;
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;

  .search-input {
    width: 300px;
    max-width: calc(100% - 55px);
    height: var(--search-bar-height);
    border-radius: calc(var(--search-bar-height) / 2);
    border: none;
    padding: 0 20px;
    background-color: var(--tertiary-bg);
    color: var(--text-color);
    font-size: 1rem;
    outline: none;
    transition: all 0.3s ease;

    &::placeholder {
      color: var(--text-color);
      opacity: 0.7;
    }
  }

  .search-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--tertiary-bg);
    width: var(--search-bar-height);
    min-width: var(--search-bar-height);
    max-width: var(--search-bar-height);
    height: var(--search-bar-height);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
  }
}
</style>
