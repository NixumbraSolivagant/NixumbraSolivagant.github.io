<script setup lang="ts">
import { ArrowLeft, Home } from 'lucide-vue-next'
import Reveal from '@/components/ui/Reveal.vue'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'

const { t } = useLocale()
useSeo(() => ({ title: t('meta.notFoundTitle') }))
</script>

<template>
  <section class="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6">
    <div
      class="pointer-events-none absolute top-1/4 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[140px]"
      aria-hidden="true"
    />

    <div class="relative text-center">
      <Reveal :y="18" :duration="0.6">
        <p class="font-mono text-[11px] tracking-[0.34em] text-violet-300/80 uppercase">
          {{ t('notFound.code') }}
        </p>
      </Reveal>

      <Reveal :delay="0.06" :y="30" :duration="0.9">
        <h1 class="gradient-text mt-4 font-display text-[clamp(5rem,18vw,11rem)] leading-[0.85] font-semibold tracking-[-0.06em]">
          404
        </h1>
      </Reveal>

      <Reveal :delay="0.14" :y="22">
        <h2 class="mt-6 text-xl font-semibold text-mist-50 sm:text-2xl">
          {{ t('notFound.title') }}
        </h2>
      </Reveal>

      <Reveal :delay="0.2" :y="18">
        <p class="mx-auto mt-3 max-w-md text-[13.5px] leading-relaxed text-mist-400">
          {{ t('notFound.desc') }}
        </p>
      </Reveal>

      <Reveal :delay="0.26" :y="16">
        <div class="mt-9 flex flex-wrap items-center justify-center gap-3">
          <RouterLink to="/" class="btn btn-primary">
            <Home :size="15" />
            {{ t('notFound.cta') }}
          </RouterLink>
          <RouterLink to="/blog" class="btn btn-ghost">
            <ArrowLeft :size="14" />
            {{ t('nav.blog') }}
          </RouterLink>
        </div>
      </Reveal>
    </div>
  </section>
</template>
