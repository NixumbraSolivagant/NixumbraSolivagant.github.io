<script setup lang="ts">
import Reveal from './Reveal.vue'

defineProps<{
  kicker?: string
  title: string
  desc?: string
  meta?: string
}>()
</script>

<template>
  <header class="relative overflow-hidden pt-32 pb-10 sm:pt-40 sm:pb-12">
    <div
      class="pointer-events-none absolute -top-40 left-1/2 h-[440px] w-[760px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[130px]"
      aria-hidden="true"
    />
    <div class="container-page relative">
      <Reveal v-if="kicker" :y="14" :duration="0.6">
        <span class="eyebrow">{{ kicker }}</span>
      </Reveal>
      <Reveal :delay="0.05" :y="30">
        <h1 class="mt-5 text-[clamp(2.7rem,7vw,5rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
          {{ title }}<span class="text-violet-400">.</span>
        </h1>
      </Reveal>
      <Reveal v-if="desc" :delay="0.12" :y="22">
        <p class="mt-6 max-w-2xl text-[15px] leading-relaxed text-mist-300">
          {{ desc }}
        </p>
      </Reveal>
      <Reveal v-if="meta" :delay="0.18" :y="14">
        <p class="mt-6 font-mono text-[10px] tracking-[0.24em] text-mist-500 uppercase">
          {{ meta }}
        </p>
      </Reveal>
      <slot />
    </div>
  </header>
</template>
