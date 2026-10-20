<script setup lang="ts">
import type { Component } from 'vue'
import { Github, Linkedin, Mail, Rss } from 'lucide-vue-next'
import type { SocialLink } from '@/lib/types'

withDefaults(defineProps<{ name: SocialLink['icon']; size?: number }>(), { size: 18 })

const icons: Record<string, Component> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  rss: Rss,
}
</script>

<template>
  <svg
    v-if="name === 'x'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      d="M17.53 3h3.02l-6.6 7.55L21.75 21h-6.08l-4.76-6.23L5.46 21H2.44l7.06-8.07L2.25 3h6.24l4.3 5.69L17.53 3Zm-1.06 16.2h1.67L7.62 4.71H5.83L16.47 19.2Z"
    />
  </svg>
  <component
    :is="icons[name]"
    v-else
    :size="size"
    :stroke-width="1.6"
    aria-hidden="true"
  />
</template>
