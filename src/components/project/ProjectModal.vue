<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { ArrowUpRight, Github, X } from 'lucide-vue-next'
import ProjectCover from '@/components/project/ProjectCover.vue'
import { useLocale } from '@/composables/useLocale'
import { lockScroll, unlockScroll } from '@/composables/useLenis'
import type { Project } from '@/lib/types'

const props = defineProps<{ project: Project | null }>()
const emit = defineEmits<{ close: [] }>()

const { t, tr, trList } = useLocale()

const statusLabel = computed(() =>
  props.project ? t(`status.${props.project.status}`) : '',
)

function close() {
  emit('close')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.project) close()
}

watch(
  () => props.project,
  (value) => {
    if (value) lockScroll()
    else unlockScroll()
  },
)

onMounted(() => window.addEventListener('keydown', onKeydown))

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  unlockScroll()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="project"
        class="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
        role="dialog"
        aria-modal="true"
        :aria-label="project.name"
      >
        <div class="absolute inset-0 bg-ink-950/80 backdrop-blur-md" @click="close" />

        <div
          class="modal-panel relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-t-4xl border border-white/10 bg-ink-900/90 shadow-2xl backdrop-blur-2xl sm:rounded-4xl"
        >
          <div class="relative aspect-[16/8] overflow-hidden">
            <ProjectCover
              :variant="project.cover"
              :from="project.accent.from"
              :to="project.accent.to"
              :tint="project.accent.tint"
            />
            <button
              type="button"
              class="absolute top-4 right-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white"
              :aria-label="t('common.close')"
              @click="close"
            >
              <X :size="16" />
            </button>
          </div>

          <div class="p-6 sm:p-8">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[9px] tracking-[0.14em] uppercase"
              >
                <span
                  class="h-1.5 w-1.5 rounded-full"
                  :class="project.status === 'live' ? 'bg-emerald-400' : project.status === 'wip' ? 'bg-amber-400' : 'bg-mist-400'"
                />
                {{ statusLabel }}
              </span>
              <span class="chip">{{ project.year }}</span>
              <span class="chip">{{ tr(project.role) }}</span>
            </div>

            <h2 class="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              {{ project.name }}
            </h2>
            <p class="mt-2 text-[15px] text-mist-300">{{ tr(project.tagline) }}</p>
            <p class="mt-5 text-[14px] leading-relaxed text-mist-400">
              {{ tr(project.description) }}
            </p>

            <div class="mt-7 grid grid-cols-3 gap-3">
              <div
                v-for="metric in project.metrics"
                :key="metric.value"
                class="rounded-2xl border border-white/[0.07] bg-white/[0.03] px-3 py-4 text-center"
              >
                <p class="font-display text-lg font-semibold text-mist-50 sm:text-xl">
                  {{ metric.value }}
                </p>
                <p class="mt-1 text-[10px] tracking-wide text-mist-500">
                  {{ tr(metric.label) }}
                </p>
              </div>
            </div>

            <div class="mt-7">
              <h3 class="font-mono text-[10px] tracking-[0.22em] text-mist-500 uppercase">
                {{ t('common.highlights') }}
              </h3>
              <ul class="mt-3 space-y-2.5">
                <li
                  v-for="(highlight, index) in trList(project.highlights)"
                  :key="index"
                  class="flex gap-3 text-[13.5px] leading-relaxed text-mist-300"
                >
                  <span class="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-violet-400 to-cyan-300" />
                  {{ highlight }}
                </li>
              </ul>
            </div>

            <div class="mt-7 flex flex-wrap gap-1.5">
              <span v-for="tag in project.tags" :key="tag" class="chip">{{ tag }}</span>
            </div>

            <div class="mt-8 flex flex-wrap gap-3">
              <a
                v-if="project.href"
                :href="project.href"
                target="_blank"
                rel="noreferrer noopener"
                class="btn btn-primary text-[13px]"
              >
                {{ t('common.visit') }}
                <ArrowUpRight :size="14" />
              </a>
              <a
                v-if="project.repo"
                :href="project.repo"
                target="_blank"
                rel="noreferrer noopener"
                class="btn btn-ghost text-[13px]"
              >
                <Github :size="14" />
                GitHub
              </a>
              <button type="button" class="btn btn-ghost text-[13px]" @click="close">
                {{ t('common.close') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
