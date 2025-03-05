<template>
  <div class="search-bar">
    <input
      class="search-input"
      type="text"
      placeholder="Search"
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
  background-color: var(--secondary-bg);
  width: fit-content;
  border-radius: 30px;
  padding: 5px;
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin-right: auto;
  margin-left: auto;

  .search-input {
    width: 300px;
    height: 50px;
    border-radius: 25px;
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
    width: 50px;
    height: 50px;
    padding: 10px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
  }
}
</style>
