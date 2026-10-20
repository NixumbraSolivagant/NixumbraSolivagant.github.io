<script setup lang="ts">
import { computed, ref } from 'vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import Reveal from '@/components/ui/Reveal.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import ProjectModal from '@/components/project/ProjectModal.vue'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'
import { projects } from '@/data/site'
import type { Project } from '@/lib/types'

const { t } = useLocale()
useSeo(() => ({ title: t('meta.workTitle'), description: t('meta.workDesc') }))

const allTags = ['all', ...Array.from(new Set(projects.map((project) => project.tags[0])))]
const activeTag = ref('all')
const activeProject = ref<Project | null>(null)

const filtered = computed(() =>
  activeTag.value === 'all'
    ? projects
    : projects.filter((project) => project.tags[0] === activeTag.value),
)
</script>

<template>
  <div>
    <PageHeader
      :kicker="t('nav.work')"
      :title="t('work.title')"
      :desc="t('work.desc')"
      :meta="`${projects.length} ${t('work.count')}`"
    />

    <section class="pb-24 sm:pb-32">
      <div class="container-page">
        <Reveal :y="16">
          <div class="-mx-5 flex items-center gap-2 overflow-x-auto px-5 pb-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            <span class="mr-1 shrink-0 font-mono text-[10px] tracking-[0.18em] text-mist-500 uppercase">
              {{ t('work.allTags') }}
            </span>
            <button
              v-for="tag in allTags"
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

        <div class="mt-10 grid gap-5 sm:grid-cols-2">
          <Reveal
            v-for="(project, index) in filtered"
            :key="project.slug"
            :delay="Math.min(index * 0.06, 0.3)"
            :y="30"
          >
            <ProjectCard :project="project" @open="activeProject = $event" />
          </Reveal>
        </div>

        <p
          v-if="!filtered.length"
          class="mt-16 text-center text-sm text-mist-500"
        >
          {{ t('work.empty') }}
        </p>
      </div>
    </section>

    <ProjectModal :project="activeProject" @close="activeProject = null" />
  </div>
</template>
