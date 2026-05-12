<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { initTheme } from '@/composables/useTheme.js'

const route = useRoute()
const showNav = computed(() => route.path !== '/')

onMounted(() => {
  initTheme()
})
</script>

<template>
  <div>
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <div class="nix-filter"></div>
    <video
      id="background-video"
      class="background-video"
      muted
      loop
      playsinline
      preload="auto"
    ></video>

    <router-view id="main-content" v-slot="{ Component, route: r }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="r.fullPath" />
      </Transition>
    </router-view>
  </div>
</template>

<style>
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  z-index: 99999;
  padding: 8px 16px;
  background: var(--accent);
  color: #fff;
  font-weight: 600;
  text-decoration: none;
  border-radius: 0 0 8px 0;
  transition: top 0.2s;
}
.skip-link:focus {
  top: 0;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
