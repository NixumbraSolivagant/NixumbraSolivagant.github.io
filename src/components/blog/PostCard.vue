<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight, Clock } from 'lucide-vue-next'
import { useLocale } from '@/composables/useLocale'
import { formatDate } from '@/lib/locale'
import { coverStyle } from '@/lib/covers'
import type { Post } from '@/lib/blog'

const props = withDefaults(defineProps<{ post: Post; featured?: boolean }>(), {
  featured: false,
})

const { t, tr, locale } = useLocale()

const title = computed(() => tr(props.post.title))
const summary = computed(() => tr(props.post.summary))
const date = computed(() => formatDate(props.post.date, locale.value))
const reading = computed(() => props.post.readingMinutes[locale.value])
</script>

<template>
  <RouterLink
    v-if="featured"
    :to="`/blog/${post.slug}`"
    class="group glass glass-sheen relative block overflow-hidden rounded-3xl transition-transform duration-700 hover:-translate-y-1"
  >
    <div class="grid lg:grid-cols-[0.82fr_1fr]">
      <div class="relative min-h-[220px] overflow-hidden" :style="coverStyle(post.cover)">
        <div
          class="absolute inset-0 opacity-40"
          style="
            background-image:
              linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
            background-size: 44px 44px;
            mask-image: radial-gradient(ellipse at 30% 20%, #000 10%, transparent 80%);
          "
        />
        <div class="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
        <div class="absolute top-5 left-6 font-mono text-[10px] tracking-[0.24em] text-white/50 uppercase">
          field notes
        </div>
        <div class="absolute bottom-5 left-6 right-6">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 font-mono text-[10px] text-white/70 backdrop-blur-md"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-white/70" />
            {{ t('blog.featured') }}
          </div>
        </div>
        <span
          class="absolute -right-2 -bottom-8 font-display text-[9rem] leading-none font-semibold text-white/[0.07] select-none"
        >
          01
        </span>
      </div>

      <div class="flex flex-col justify-center p-7 sm:p-9">
        <div class="flex items-center gap-3 font-mono text-[10px] tracking-[0.18em] text-mist-500 uppercase">
          <span>{{ date }}</span>
          <span class="h-1 w-1 rounded-full bg-mist-500" />
          <span>{{ reading }} {{ t('common.minRead') }}</span>
        </div>
        <h3 class="mt-4 text-balance text-2xl leading-[1.18] font-semibold tracking-tight text-mist-50 transition-colors group-hover:text-white">
          {{ title }}
        </h3>
        <p class="mt-3 line-clamp-3 text-[13.5px] leading-relaxed text-mist-400">
          {{ summary }}
        </p>
        <div class="mt-6 flex flex-wrap items-center gap-1.5">
          <span v-for="tag in post.tags" :key="tag" class="chip">{{ tag }}</span>
        </div>
        <span
          class="mt-6 inline-flex items-center gap-2 text-[12px] font-medium text-violet-300 transition-colors group-hover:text-violet-200"
        >
          {{ t('common.readMore') }}
          <ArrowUpRight
            :size="13"
            class="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </div>
  </RouterLink>

  <RouterLink
    v-else
    :to="`/blog/${post.slug}`"
    class="group relative grid gap-4 overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.05] sm:grid-cols-[118px_1fr_auto] sm:items-start sm:p-6"
  >
    <span
      class="absolute inset-y-0 left-0 w-[2px] scale-y-0 bg-gradient-to-b from-violet-400 to-cyan-300 transition-transform duration-500 group-hover:scale-y-100"
    />
    <div class="font-mono text-[10.5px] tracking-[0.14em] text-mist-500 uppercase">
      {{ date }}
    </div>
    <div class="min-w-0">
      <h3 class="text-[17px] leading-snug font-medium tracking-tight text-mist-100 transition-colors group-hover:text-white">
        {{ title }}
      </h3>
      <p class="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-mist-400">
        {{ summary }}
      </p>
      <div class="mt-3 flex flex-wrap gap-1.5">
        <span v-for="tag in post.tags" :key="tag" class="chip">{{ tag }}</span>
      </div>
    </div>
    <div class="flex items-center gap-2 text-[11px] text-mist-500 sm:flex-col sm:items-end sm:gap-3">
      <span class="inline-flex items-center gap-1.5">
        <Clock :size="12" :stroke-width="1.6" />
        {{ reading }} {{ t('common.minRead') }}
      </span>
      <span
        class="grid h-7 w-7 place-items-center rounded-full border border-white/10 text-mist-400 transition-all duration-500 group-hover:rotate-45 group-hover:border-white/25 group-hover:text-white"
      >
        <ArrowUpRight :size="13" />
      </span>
    </div>
  </RouterLink>
</template>
