<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { animate, inView } from 'motion'
import { EASE_SOFT } from '@/lib/motion'

const props = withDefaults(
  defineProps<{
    as?: string
    delay?: number
    y?: number
    duration?: number
    once?: boolean
  }>(),
  { as: 'div', delay: 0, y: 26, duration: 0.8, once: true },
)

const el = ref<HTMLElement | null>(null)
const hidden = ref(true)

let stop: (() => void) | null = null
let fallback: number | undefined
let revealed = false

function reveal(withAnimation: boolean) {
  if (revealed) return
  revealed = true
  hidden.value = false
  window.clearTimeout(fallback)

  const node = el.value
  if (!node) return

  if (withAnimation) {
    animate(
      node,
      { opacity: [0, 1], y: [props.y, 0] },
      { duration: props.duration, delay: props.delay, ease: EASE_SOFT },
    )
  }

  if (props.once) stop?.()
}

onMounted(() => {
  const node = el.value
  if (!node) return

  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !('IntersectionObserver' in window)
  ) {
    revealed = true
    hidden.value = false
    return
  }

  stop = inView(node, () => reveal(true), {
    amount: 0.12,
    margin: '0px 0px -8% 0px',
  })

  // 兜底：只对「已经在视口里」的元素生效，避免把首屏之外的内容提前显形
  fallback = window.setTimeout(() => {
    const rect = node.getBoundingClientRect()
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0
    if (inViewport) reveal(false)
  }, 2500)
})

onBeforeUnmount(() => {
  stop?.()
  window.clearTimeout(fallback)
})
</script>

<template>
  <component :is="as" ref="el" :class="{ 'reveal-hidden': hidden }">
    <slot />
  </component>
</template>
