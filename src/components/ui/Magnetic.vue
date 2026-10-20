<script setup lang="ts">
import { ref } from 'vue'
import { animate } from 'motion'
import { EASE_SOFT } from '@/lib/motion'
import { isFinePointer } from '@/composables/useReducedMotion'

const props = withDefaults(defineProps<{ strength?: number }>(), { strength: 0.22 })

const root = ref<HTMLElement | null>(null)
const active = ref(false)

function onEnter() {
  if (!isFinePointer()) return
  active.value = true
}

function onMove(event: PointerEvent) {
  if (!active.value) return
  const el = root.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = (event.clientX - rect.left - rect.width / 2) * props.strength
  const y = (event.clientY - rect.top - rect.height / 2) * props.strength
  animate(el, { x, y }, { duration: 0.45, ease: EASE_SOFT })
}

function onLeave() {
  const el = root.value
  if (!el) return
  active.value = false
  animate(el, { x: 0, y: 0 }, { type: 'spring', stiffness: 220, damping: 18 })
}
</script>

<template>
  <div
    ref="root"
    class="inline-flex will-change-transform"
    @pointerenter="onEnter"
    @pointermove="onMove"
    @pointerleave="onLeave"
  >
    <slot />
  </div>
</template>
