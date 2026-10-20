<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { animate } from 'motion'
import { EASE_SOFT, EASE_TILT } from '@/lib/motion'
import { isFinePointer } from '@/composables/useReducedMotion'

const props = withDefaults(defineProps<{ max?: number; scale?: number }>(), {
  max: 6,
  scale: 1.01,
})

const outer = ref<HTMLElement | null>(null)
const inner = ref<HTMLElement | null>(null)
let raf = 0
let enabled = false

function onEnter() {
  enabled = isFinePointer()
}

function onMove(event: PointerEvent) {
  if (!enabled) return
  const wrapper = outer.value
  const card = inner.value
  if (!wrapper || !card) return

  const rect = wrapper.getBoundingClientRect()
  const px = (event.clientX - rect.left) / rect.width - 0.5
  const py = (event.clientY - rect.top) / rect.height - 0.5

  wrapper.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  wrapper.style.setProperty('--my', `${event.clientY - rect.top}px`)

  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    animate(
      card,
      {
        rotateX: -py * props.max * 2,
        rotateY: px * props.max * 2,
        scale: props.scale,
      },
      { duration: 0.4, ease: EASE_TILT },
    )
  })
}

function onLeave() {
  const card = inner.value
  enabled = false
  cancelAnimationFrame(raf)
  if (!card) return
  animate(
    card,
    { rotateX: 0, rotateY: 0, scale: 1 },
    { duration: 0.8, ease: EASE_SOFT },
  )
}

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div
    ref="outer"
    class="[perspective:1400px]"
    @pointerenter="onEnter"
    @pointermove="onMove"
    @pointerleave="onLeave"
  >
    <div ref="inner" class="will-change-transform [transform-style:preserve-3d]">
      <slot />
    </div>
  </div>
</template>
