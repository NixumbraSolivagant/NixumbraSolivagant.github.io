<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight } from 'lucide-vue-next'
import TiltCard from '@/components/ui/TiltCard.vue'
import ProjectCover from '@/components/project/ProjectCover.vue'
import { useLocale } from '@/composables/useLocale'
import type { Project } from '@/lib/types'

const props = defineProps<{ project: Project }>()
const emit = defineEmits<{ open: [project: Project] }>()

const { t, tr } = useLocale()
const statusLabel = computed(() => t(`status.${props.project.status}`))
</script>

<template>
  <TiltCard :max="5">
    <article class="glass glass-sheen spotlight group relative overflow-hidden rounded-3xl">
      <button
        type="button"
        class="block w-full cursor-pointer text-left"
        :aria-label="`${t('common.openCase')}: ${project.name}`"
        @click="emit('open', project)"
      >
        <div class="relative aspect-[16/9] overflow-hidden">
          <ProjectCover
            :variant="project.cover"
            :from="project.accent.from"
            :to="project.accent.to"
            :tint="project.accent.tint"
          />
          <div class="absolute inset-x-4 top-4 z-10 flex items-center justify-between">
            <span
              class="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/30 px-2.5 py-1 font-mono text-[9px] tracking-[0.14em] text-white/80 uppercase backdrop-blur-md"
            >
              <span
                class="h-1.5 w-1.5 rounded-full"
                :class="project.status === 'live' ? 'bg-emerald-400' : project.status === 'wip' ? 'bg-amber-400' : 'bg-mist-400'"
              />
              {{ statusLabel }}
            </span>
            <span
              class="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/10 text-white/80 backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:bg-white/25"
            >
              <ArrowUpRight :size="15" />
            </span>
          </div>
        </div>

        <div class="p-6">
          <h3 class="text-lg font-semibold tracking-tight text-mist-50 transition-colors group-hover:text-white">
            {{ project.name }}
          </h3>
          <p class="mt-2 text-[13px] leading-relaxed text-mist-400">
            {{ tr(project.tagline) }}
          </p>
          <div class="mt-5 flex flex-wrap gap-1.5">
            <span v-for="tag in project.tags" :key="tag" class="chip">{{ tag }}</span>
          </div>
        </div>
      </button>
    </article>
  </TiltCard>
</template>
