<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { scrollToElement } from '@/composables/useLenis'
import type { TocItem } from '@/lib/types'

const props = defineProps<{ items: TocItem[] }>()
const { t } = useLocale()

const activeId = ref('')
let observer: IntersectionObserver | null = null

function observe() {
  observer?.disconnect()
  if (!props.items.length || typeof window === 'undefined') return

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]) activeId.value = visible[0].target.id
    },
    { rootMargin: '-96px 0px -62% 0px', threshold: [0, 1] },
  )

  for (const item of props.items) {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  }
}

function goTo(id: string) {
  const el = document.getElementById(id)
  if (el) scrollToElement(el)
}

onMounted(observe)
watch(() => props.items, observe, { deep: true })
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <nav
    v-if="items.length"
    class="sticky top-28 hidden max-h-[calc(100dvh-9rem)] overflow-y-auto pr-2 lg:block"
    :aria-label="t('post.toc')"
  >
    <p class="font-mono text-[10px] tracking-[0.22em] text-mist-500 uppercase">
      {{ t('post.toc') }}
    </p>
    <ul class="mt-4 space-y-1 border-l border-white/[0.08]">
      <li v-for="item in items" :key="item.id">
        <button
          type="button"
          class="relative block w-full rounded-r-md py-1.5 text-left text-[11.5px] leading-snug transition-colors"
          :class="[
            item.level === 3 ? 'pl-6' : 'pl-4',
            activeId === item.id
              ? 'text-violet-200'
              : 'text-mist-400 hover:text-mist-200',
          ]"
          @click="goTo(item.id)"
        >
          <span
            v-if="activeId === item.id"
            class="absolute top-1/2 left-0 h-4 w-[2px] -translate-y-1/2 rounded-full bg-gradient-to-b from-violet-400 to-cyan-300"
          />
          {{ item.text }}
        </button>
      </li>
    </ul>
  </nav>
</template>
