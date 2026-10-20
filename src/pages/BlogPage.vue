<script setup lang="ts">
import { computed, ref } from 'vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import Reveal from '@/components/ui/Reveal.vue'
import PostCard from '@/components/blog/PostCard.vue'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'
import { allTags, posts } from '@/lib/blog'

const { t } = useLocale()
useSeo(() => ({ title: t('meta.blogTitle'), description: t('meta.blogDesc') }))

const activeTag = ref('all')
const filtered = computed(() =>
  activeTag.value === 'all'
    ? posts
    : posts.filter((post) => post.tags.includes(activeTag.value)),
)

const featured = computed(() => (activeTag.value === 'all' ? filtered.value[0] : undefined))
const rest = computed(() => (featured.value ? filtered.value.slice(1) : filtered.value))
</script>

<template>
  <div>
    <PageHeader
      :kicker="t('nav.blog')"
      :title="t('blog.title')"
      :desc="t('blog.desc')"
      :meta="`${posts.length} ${t('blog.count')}`"
    />

    <section class="pb-24 sm:pb-32">
      <div class="container-page">
        <Reveal :y="16">
          <div class="-mx-5 flex items-center gap-2 overflow-x-auto px-5 pb-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            <span class="mr-1 shrink-0 font-mono text-[10px] tracking-[0.18em] text-mist-500 uppercase">
              {{ t('blog.allTags') }}
            </span>
            <button
              v-for="tag in ['all', ...allTags]"
              :key="tag"
              type="button"
              class="chip shrink-0 cursor-pointer transition-all duration-300"
              :class="
                activeTag === tag
                  ? 'chip-accent'
                  : 'hover:border-white/25 hover:text-white'
              "
              :aria-pressed="activeTag === tag"
              @click="activeTag = tag"
            >
              {{ tag === 'all' ? t('common.all') : tag }}
            </button>
          </div>
        </Reveal>

        <div class="mt-12 space-y-5">
          <Reveal v-if="featured" :y="30">
            <PostCard :post="featured" featured />
          </Reveal>

          <div class="grid gap-4">
            <Reveal
              v-for="(post, index) in rest"
              :key="post.slug"
              :delay="Math.min(index * 0.05, 0.25)"
              :y="24"
            >
              <PostCard :post="post" />
            </Reveal>
          </div>
        </div>

        <p
          v-if="!filtered.length"
          class="mt-16 rounded-3xl border border-white/[0.06] bg-white/[0.02] py-16 text-center text-sm text-mist-500"
        >
          {{ t('blog.noResults') }}
        </p>
      </div>
    </section>
  </div>
</template>
