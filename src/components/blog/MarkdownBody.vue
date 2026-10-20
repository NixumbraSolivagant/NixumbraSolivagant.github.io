<script setup lang="ts">
defineProps<{ html: string }>()
</script>

<template>
  <div class="prose-custom" v-html="html" />
</template>
