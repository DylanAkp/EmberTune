<template>
  <div
    class="styled-button clickable"
    :class="[`variant-${variant}`, { active: active }, { 'icon-only': !text }]"
    @click="$emit('click')"
  >
    <q-icon v-if="icon" :name="icon" :size="iconSize" />
    <span v-if="text" class="button-text">{{ text }}</span>
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  iconSize: {
    type: String,
    default: '24px',
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['accent', 'default', 'light', 'success'].includes(value),
  },
  active: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])
</script>

<style lang="scss" scoped>
.styled-button {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  font-size: 18px;
  gap: 12px;
  transition: all 0.2s ease;

  &.icon-only {
    justify-content: center;
  }

  &.variant-default {
    background-color: var(--primary-bg);
    width: 100%;

    &.active {
      background-color: var(--tertiary-bg);
      color: var(--accent-color);
    }

    &:hover:not(.active) {
      background-color: var(--tertiary-bg);
      opacity: 0.8;
    }
  }

  &.variant-accent {
    background-color: var(--accent-color);
    color: white;

    &:hover {
      opacity: 0.9;
    }
  }

  &.variant-success {
    background-color: var(--success-color, #4caf50);
    color: white;

    &:hover {
      opacity: 0.9;
    }
  }

  &.variant-light {
    padding: 1rem;
    border-radius: 8px;
    background: var(--tertiary-bg);
    width: 100%;

    .q-icon {
      color: var(--accent-color);
    }
  }
}
</style>
