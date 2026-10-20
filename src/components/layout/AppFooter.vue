<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUp, ArrowUpRight } from 'lucide-vue-next'
import SocialIcon from '@/components/ui/SocialIcon.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import { useLocale } from '@/composables/useLocale'
import { scrollToTop } from '@/composables/useLenis'
import { profile, socials } from '@/data/site'

const { t, tr } = useLocale()
const year = new Date().getFullYear()

const links = computed(() => [
  { to: '/', label: t('nav.home') },
  { to: '/work', label: t('nav.work') },
  { to: '/blog', label: t('nav.blog') },
  { to: '/about', label: t('nav.about') },
])
</script>

<template>
  <footer class="relative mt-20 overflow-hidden border-t border-white/[0.06]">
    <div
      class="pointer-events-none absolute -bottom-32 left-1/2 h-[380px] w-[900px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[120px]"
      aria-hidden="true"
    />

    <div class="container-page relative pt-16 pb-8">
      <div class="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
        <div>
          <RouterLink to="/" class="inline-flex items-center gap-3">
            <span
              class="grid h-10 w-10 place-items-center rounded-2xl border border-white/20 bg-gradient-to-br from-violet-500/90 via-indigo-500/60 to-cyan-400/70 text-[12px] font-semibold text-white shadow-lg shadow-violet-900/40"
            >
              {{ profile.initials }}
            </span>
            <span class="text-sm font-semibold text-mist-50">{{ tr(profile.name) }}</span>
          </RouterLink>
          <p class="mt-5 max-w-xs text-[13px] leading-relaxed text-mist-400">
            {{ t('footer.tagline') }}
          </p>
          <div class="mt-6 flex items-center gap-2">
            <a
              v-for="social in socials"
              :key="social.label"
              :href="social.href"
              target="_blank"
              rel="noreferrer noopener"
              class="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-mist-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:text-white"
              :aria-label="social.label"
            >
              <SocialIcon :name="social.icon" :size="15" />
            </a>
          </div>
        </div>

        <nav :aria-label="t('footer.navTitle')">
          <h2 class="font-mono text-[10px] tracking-[0.22em] text-mist-500 uppercase">
            {{ t('footer.navTitle') }}
          </h2>
          <ul class="mt-5 space-y-2.5">
            <li v-for="link in links" :key="link.to">
              <RouterLink
                :to="link.to"
                class="text-[13px] text-mist-300 transition-colors hover:text-white"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </nav>

        <div>
          <h2 class="font-mono text-[10px] tracking-[0.22em] text-mist-500 uppercase">
            {{ t('footer.socialTitle') }}
          </h2>
          <ul class="mt-5 space-y-2.5">
            <li v-for="social in socials" :key="social.label">
              <a
                :href="social.href"
                target="_blank"
                rel="noreferrer noopener"
                class="group inline-flex items-center gap-1.5 text-[13px] text-mist-300 transition-colors hover:text-white"
              >
                {{ social.label }}
                <ArrowUpRight
                  :size="12"
                  class="text-mist-500 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 class="font-mono text-[10px] tracking-[0.22em] text-mist-500 uppercase">
            {{ t('footer.contactTitle') }}
          </h2>
          <a
            :href="`mailto:${profile.email}`"
            class="mt-5 block text-[13px] text-mist-200 transition-colors hover:text-violet-300"
          >
            {{ profile.email }}
          </a>
          <div class="mt-3">
            <CopyButton :value="profile.email" :label="t('common.copy')" />
          </div>
          <p class="mt-5 flex items-center gap-2 font-mono text-[10px] text-mist-500">
            <span class="relative flex h-1.5 w-1.5">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            {{ t('footer.status') }}
          </p>
        </div>
      </div>

      <div class="mt-14 hairline" />

      <div
        class="mt-6 flex flex-col items-start justify-between gap-4 text-[11px] text-mist-500 sm:flex-row sm:items-center"
      >
        <p>© {{ year }} {{ tr(profile.name) }} · {{ t('footer.rights') }}</p>
        <p class="font-mono tracking-wide">{{ t('footer.built') }}</p>
        <button
          type="button"
          class="group inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 transition-colors hover:border-white/25 hover:text-mist-200"
          @click="scrollToTop()"
        >
          {{ t('common.backToTop') }}
          <ArrowUp
            :size="12"
            class="transition-transform duration-300 group-hover:-translate-y-0.5"
          />
        </button>
      </div>
    </div>

    <div
      class="pointer-events-none relative -mb-4 select-none text-center font-display text-[clamp(4rem,17vw,15rem)] leading-[0.8] font-semibold tracking-[-0.05em] text-transparent"
      aria-hidden="true"
    >
      <span class="bg-gradient-to-b from-white/[0.07] to-white/0 bg-clip-text">NIX</span>
    </div>
  </footer>
</template>
