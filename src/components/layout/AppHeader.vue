<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowUpRight, Menu, X } from 'lucide-vue-next'
import LanguageToggle from '@/components/ui/LanguageToggle.vue'
import SocialIcon from '@/components/ui/SocialIcon.vue'
import { useLocale } from '@/composables/useLocale'
import { lockScroll, unlockScroll } from '@/composables/useLenis'
import { profile, socials } from '@/data/site'

const { t, tr } = useLocale()
const route = useRoute()

const scrolled = ref(false)
const open = ref(false)

const links = computed(() => [
  { to: '/', label: t('nav.home') },
  { to: '/work', label: t('nav.work') },
  { to: '/blog', label: t('nav.blog') },
  { to: '/about', label: t('nav.about') },
])

function isActive(to: string): boolean {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(`${to}/`)
}

function onScroll() {
  scrolled.value = window.scrollY > 24
}

function closeMenu() {
  open.value = false
}

watch(open, (value) => {
  if (value) lockScroll()
  else unlockScroll()
})

watch(
  () => route.fullPath,
  () => {
    if (open.value) closeMenu()
  },
)

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) closeMenu()
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
  unlockScroll()
})
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-5">
    <div class="container-page">
      <div
        class="flex items-center justify-between gap-3 rounded-full border px-2.5 py-2 transition-all duration-500 sm:px-3"
        :class="
          scrolled || open
            ? 'glass glass-sheen border-white/10 bg-ink-950/70 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]'
            : 'border-transparent bg-transparent'
        "
      >
        <RouterLink
          to="/"
          class="group flex items-center gap-2.5 rounded-full py-1 pr-2 pl-1"
          :aria-label="tr(profile.name)"
        >
          <span
            class="relative grid h-9 w-9 place-items-center overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-violet-500/90 via-indigo-500/60 to-cyan-400/70 text-[11px] font-semibold tracking-tight text-white shadow-lg shadow-violet-900/40 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105"
          >
            <span
              class="absolute inset-0 bg-gradient-to-t from-white/0 via-white/0 to-white/25 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
            <span class="relative">{{ profile.initials }}</span>
          </span>
          <span class="hidden flex-col leading-tight sm:flex">
            <span class="text-[13px] font-semibold tracking-tight text-mist-50">
              {{ tr(profile.name) }}
            </span>
            <span class="font-mono text-[9px] tracking-[0.16em] text-mist-500 uppercase">
              {{ tr(profile.tagline) }}
            </span>
          </span>
        </RouterLink>

        <nav class="hidden items-center gap-0.5 md:flex" :aria-label="t('nav.menu')">
          <RouterLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="nav-link"
            :class="{ 'is-active': isActive(link.to) }"
          >
            {{ link.label }}
          </RouterLink>
        </nav>

        <div class="flex items-center gap-2">
          <LanguageToggle />
          <a
            :href="`mailto:${profile.email}`"
            class="btn btn-primary hidden !px-4 !py-2 text-[12px] sm:inline-flex"
          >
            {{ t('nav.contact') }}
            <ArrowUpRight :size="13" :stroke-width="2" />
          </a>
          <button
            type="button"
            class="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-mist-200 transition-colors hover:bg-white/10 md:hidden"
            :aria-label="open ? t('a11y.closeMenu') : t('a11y.openMenu')"
            :aria-expanded="open"
            @click="open = !open"
          >
            <component :is="open ? X : Menu" :size="17" :stroke-width="1.8" />
          </button>
        </div>
      </div>
    </div>
  </header>

  <Teleport to="body">
    <Transition name="menu">
      <div v-if="open" class="fixed inset-0 z-40 md:hidden">
        <div
          class="absolute inset-0 bg-ink-950/75 backdrop-blur-xl"
          @click="closeMenu"
        />
        <div class="relative mx-4 mt-24 overflow-hidden rounded-3xl border border-white/10 bg-ink-900/80 p-5 shadow-2xl backdrop-blur-2xl">
          <nav class="flex flex-col">
            <RouterLink
              v-for="(link, index) in links"
              :key="link.to"
              :to="link.to"
              class="group flex items-center justify-between border-b border-white/5 py-3.5 last:border-0"
              @click="closeMenu"
            >
              <span
                class="text-2xl font-medium tracking-tight transition-colors"
                :class="isActive(link.to) ? 'text-white' : 'text-mist-300 group-hover:text-white'"
              >
                {{ link.label }}
              </span>
              <span class="font-mono text-[10px] text-mist-500">
                0{{ index + 1 }}
              </span>
            </RouterLink>
          </nav>

          <div class="mt-5 flex items-center justify-between gap-3">
            <a
              :href="`mailto:${profile.email}`"
              class="btn btn-primary flex-1 !py-2.5 text-[13px]"
            >
              {{ t('nav.contact') }}
              <ArrowUpRight :size="14" />
            </a>
            <div class="flex items-center gap-1.5">
              <a
                v-for="social in socials"
                :key="social.label"
                :href="social.href"
                target="_blank"
                rel="noreferrer noopener"
                class="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-mist-300 transition-colors hover:text-white"
                :aria-label="social.label"
              >
                <SocialIcon :name="social.icon" :size="15" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
