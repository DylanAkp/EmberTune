<template>
  <div
    class="image-skeleton"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: `${borderRadius}px`,
    }"
  ></div>
</template>

<script setup>
defineProps({
  size: {
    type: Number,
    required: true,
  },
  borderRadius: {
    type: Number,
    default: 5,
  },
})
</script>

<style lang="scss" scoped>
.image-skeleton {
  background: linear-gradient(
    90deg,
    var(--primary-bg) 25%,
    var(--secondary-bg) 50%,
    var(--tertiary-bg) 75%
  );
  background-size: 200% 100%;
  animation: loading 1s infinite;
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
