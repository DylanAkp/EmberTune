<template>
  <div
    class="text-skeleton"
    :style="{
      width: width + 'px',
      height: height + 'px',
    }"
  ></div>
</template>

<script setup>
defineProps({
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
.text-skeleton {
  background: linear-gradient(
    90deg,
    var(--primary-bg) 25%,
    var(--secondary-bg) 50%,
    var(--tertiary-bg) 75%
  );
  background-size: 200% 100%;
  animation: loading 1s infinite;
  border-radius: 4px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
