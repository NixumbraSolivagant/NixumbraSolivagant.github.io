<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, ArrowRight, Clock } from 'lucide-vue-next'
import MarkdownBody from '@/components/blog/MarkdownBody.vue'
import TableOfContents from '@/components/blog/TableOfContents.vue'
import PostCard from '@/components/blog/PostCard.vue'
import Reveal from '@/components/ui/Reveal.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'
import { getAdjacentPosts, getPost, getRelatedPosts } from '@/lib/blog'
import { renderMarkdown } from '@/lib/markdown'
import { formatDate } from '@/lib/locale'

const route = useRoute()
const { t, tr, locale } = useLocale()

const post = computed(() => getPost(String(route.params.slug)))

const display = computed(() => {
  const current = post.value
  if (!current) return { html: '', toc: [] }
  const useEnglish = locale.value === 'en' && current.hasEnglish
  return renderMarkdown(useEnglish ? current.body.en : current.body.zh)
})

const fallback = computed(
  () => locale.value === 'en' && post.value && !post.value.hasEnglish,
)

const adjacent = computed(() => (post.value ? getAdjacentPosts(post.value.slug) : {}))
const related = computed(() => (post.value ? getRelatedPosts(post.value, 2) : []))
const shareUrl = computed(() =>
  typeof window === 'undefined' ? '' : `${window.location.origin}${window.location.pathname}`,
)

useSeo(() => ({
  title: post.value
    ? `${tr(post.value.title)} · ${t('meta.postTitle')}`
    : t('meta.notFoundTitle'),
  description: post.value ? tr(post.value.summary) : undefined,
}))
</script>

<template>
  <article v-if="post" class="pb-24">
    <header class="relative overflow-hidden pt-32 pb-10 sm:pt-40">
      <div
        class="pointer-events-none absolute -top-44 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[130px]"
        aria-hidden="true"
      />
      <div class="container-page relative">
        <div class="mx-auto max-w-4xl">
          <Reveal :y="12" :duration="0.6">
            <RouterLink
              to="/blog"
              class="group inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-mist-500 uppercase transition-colors hover:text-mist-200"
            >
              <ArrowLeft :size="12" class="transition-transform group-hover:-translate-x-0.5" />
              {{ t('post.back') }}
            </RouterLink>
          </Reveal>

          <Reveal :delay="0.05" :y="24">
            <div class="mt-7 flex flex-wrap items-center gap-2">
              <span v-for="tag in post.tags" :key="tag" class="chip chip-accent">
                #{{ tag }}
              </span>
            </div>
          </Reveal>

          <Reveal :delay="0.1" :y="30">
            <h1 class="mt-5 text-[clamp(1.9rem,4.8vw,3.4rem)] leading-[1.08] font-semibold tracking-[-0.03em]">
              {{ tr(post.title) }}
            </h1>
          </Reveal>

          <Reveal :delay="0.16" :y="22">
            <p class="mt-5 max-w-3xl text-[15px] leading-relaxed text-mist-300">
              {{ tr(post.summary) }}
            </p>
          </Reveal>

          <Reveal :delay="0.22" :y="16">
            <div class="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-[11px] text-mist-500">
              <span class="font-mono tracking-[0.14em] uppercase">
                {{ formatDate(post.date, locale) }}
              </span>
              <span class="h-1 w-1 rounded-full bg-mist-500" />
              <span class="inline-flex items-center gap-1.5">
                <Clock :size="12" />
                {{ post.readingMinutes[locale] }} {{ t('common.minRead') }}
              </span>
              <CopyButton :value="shareUrl" :label="t('post.copyLink')" class="ml-auto" />
            </div>
          </Reveal>
        </div>
      </div>
    </header>

    <div class="container-page">
      <div class="mx-auto grid max-w-4xl gap-10 lg:grid-cols-[minmax(0,1fr)_232px]">
        <div class="w-full min-w-0">
          <div
            v-if="fallback"
            class="mb-8 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] px-4 py-3 text-[12.5px] text-amber-200/90"
          >
            {{ t('post.onlyZh') }}
          </div>

          <MarkdownBody :html="display.html" />

          <div class="mt-14 hairline" />

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            <RouterLink
              v-if="adjacent.prev"
              :to="`/blog/${adjacent.prev.slug}`"
              class="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-all duration-500 hover:border-white/15 hover:bg-white/[0.05]"
            >
              <span class="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] text-mist-500 uppercase">
                <ArrowLeft :size="11" />
                {{ t('common.prev') }}
              </span>
              <p class="mt-2.5 text-[13.5px] leading-snug text-mist-200 transition-colors group-hover:text-white">
                {{ tr(adjacent.prev.title) }}
              </p>
            </RouterLink>

            <RouterLink
              v-if="adjacent.next"
              :to="`/blog/${adjacent.next.slug}`"
              class="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 text-right transition-all duration-500 hover:border-white/15 hover:bg-white/[0.05] sm:col-start-2"
            >
              <span class="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] text-mist-500 uppercase">
                {{ t('common.next') }}
                <ArrowRight :size="11" />
              </span>
              <p class="mt-2.5 text-[13.5px] leading-snug text-mist-200 transition-colors group-hover:text-white">
                {{ tr(adjacent.next.title) }}
              </p>
            </RouterLink>
          </div>

          <div v-if="related.length" class="mt-14">
            <h2 class="font-mono text-[10px] tracking-[0.22em] text-mist-500 uppercase">
              {{ t('post.related') }}
            </h2>
            <div class="mt-5 grid gap-3">
              <PostCard v-for="item in related" :key="item.slug" :post="item" />
            </div>
          </div>
        </div>

        <TableOfContents :items="display.toc" />
      </div>
    </div>
  </article>

  <section v-else class="flex min-h-[70svh] items-center justify-center px-6 pt-32">
    <div class="text-center">
      <p class="font-mono text-[11px] tracking-[0.3em] text-violet-300/80 uppercase">404</p>
      <h1 class="mt-4 text-2xl font-semibold">{{ t('post.notFoundTitle') }}</h1>
      <p class="mx-auto mt-3 max-w-sm text-sm text-mist-400">{{ t('post.notFoundDesc') }}</p>
      <RouterLink to="/blog" class="btn btn-ghost mt-8">
        <ArrowLeft :size="14" />
        {{ t('post.back') }}
      </RouterLink>
    </div>
  </section>
</template>
