<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { isFinePointer } from '@/composables/useReducedMotion'

const glow = ref<HTMLDivElement | null>(null)
const visible = ref(false)

let raf = 0
let targetX = 0
let targetY = 0
let currentX = 0
let currentY = 0

function loop() {
  currentX += (targetX - currentX) * 0.11
  currentY += (targetY - currentY) * 0.11
  if (glow.value) {
    glow.value.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
  }
  raf = requestAnimationFrame(loop)
}

function onPointerMove(event: PointerEvent) {
  targetX = event.clientX
  targetY = event.clientY
  if (!visible.value) {
    currentX = targetX
    currentY = targetY
    visible.value = true
  }
}

onMounted(() => {
  if (!isFinePointer()) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  raf = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div
    ref="glow"
    class="cursor-glow"
    :class="{ 'is-visible': visible }"
    aria-hidden="true"
  />
</template>

<style scoped>
.cursor-glow {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -5;
  width: 520px;
  height: 520px;
  margin-top: -260px;
  margin-left: -260px;
  border-radius: 999px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.8s ease;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(139, 92, 246, 0.16),
    rgba(34, 211, 238, 0.06) 42%,
    transparent 68%
  );
  filter: blur(24px);
  mix-blend-mode: screen;
  will-change: transform;
}

.cursor-glow.is-visible {
  opacity: 1;
}
</style>
