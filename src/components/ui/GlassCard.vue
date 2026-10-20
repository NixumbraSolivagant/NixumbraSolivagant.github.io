<script setup lang="ts">
withDefaults(defineProps<{ as?: string }>(), { as: 'div' })
</script>

<template>
  <component :is="as" class="glass glass-sheen overflow-hidden rounded-3xl">
    <slot />
  </component>
</template>
