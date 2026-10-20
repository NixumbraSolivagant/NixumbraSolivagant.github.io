<script setup lang="ts">
import Reveal from './Reveal.vue'

withDefaults(
  defineProps<{
    kicker?: string
    title: string
    desc?: string
    align?: 'left' | 'center'
  }>(),
  { kicker: undefined, desc: undefined, align: 'left' },
)
</script>

<template>
  <div
    class="flex flex-col gap-5"
    :class="align === 'center' ? 'items-center text-center' : 'items-start'"
  >
    <Reveal v-if="kicker" :y="14" :duration="0.6">
      <span class="eyebrow">{{ kicker }}</span>
    </Reveal>
    <Reveal :delay="0.06" :y="22">
      <h2 class="text-balance text-[clamp(1.85rem,4vw,2.9rem)] font-semibold leading-[1.1] tracking-[-0.02em]">
        {{ title }}
      </h2>
    </Reveal>
    <Reveal v-if="desc" :delay="0.12" :y="18">
      <p class="max-w-2xl text-sm leading-relaxed text-mist-400 sm:text-[15px]">
        {{ desc }}
      </p>
    </Reveal>
    <slot />
  </div>
</template>
