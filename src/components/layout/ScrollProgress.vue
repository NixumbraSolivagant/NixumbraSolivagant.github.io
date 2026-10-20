<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const progress = ref(0)
let raf = 0

function update() {
  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
}

function onScroll() {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(update)
}

onMounted(() => {
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-white/[0.04]">
    <div
      class="h-full origin-left bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-300 shadow-[0_0_12px_rgba(139,92,246,0.8)]"
      :style="{ transform: `scaleX(${progress})` }"
    />
  </div>
</template>
