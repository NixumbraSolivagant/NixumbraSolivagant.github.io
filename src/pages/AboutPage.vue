<script setup lang="ts">
import { ArrowUpRight, Mail, MapPin } from 'lucide-vue-next'
import PageHeader from '@/components/ui/PageHeader.vue'
import Reveal from '@/components/ui/Reveal.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import SocialIcon from '@/components/ui/SocialIcon.vue'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'
import { experience, profile, skillGroups, socials, stats } from '@/data/site'

const { t, tr, trList } = useLocale()
useSeo(() => ({ title: t('meta.aboutTitle'), description: t('meta.aboutDesc') }))
</script>

<template>
  <div>
    <PageHeader
      :kicker="t('nav.about')"
      :title="t('about.title')"
      :desc="t('about.desc')"
    />

    <section class="pb-20 sm:pb-28">
      <div class="container-page grid gap-14 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <Reveal :y="22">
            <div class="space-y-5 text-[15px] leading-[1.9] text-mist-300">
              <p v-for="(paragraph, index) in trList(profile.bio)" :key="index">
                {{ paragraph }}
              </p>
            </div>
          </Reveal>

          <Reveal :delay="0.1" :y="20">
            <div class="mt-10 grid grid-cols-3 gap-3">
              <div
                v-for="stat in stats"
                :key="stat.value"
                class="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-5"
              >
                <p class="font-display text-2xl font-semibold text-mist-50">
                  {{ stat.value }}
                </p>
                <p class="mt-1 font-mono text-[9.5px] tracking-[0.12em] text-mist-500 uppercase">
                  {{ tr(stat.label) }}
                </p>
              </div>
            </div>
          </Reveal>

          <div class="mt-16">
            <SectionHeading
              :kicker="t('about.skillsKicker')"
              :title="t('about.skillsTitle')"
            />
            <div class="mt-8 space-y-3">
              <Reveal
                v-for="(group, index) in skillGroups"
                :key="group.title.zh"
                :delay="index * 0.06"
                :y="22"
              >
                <div class="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                  <div class="flex items-center justify-between">
                    <h3 class="text-[13.5px] font-medium text-mist-100">
                      {{ tr(group.title) }}
                    </h3>
                    <span class="font-mono text-[10px] text-mist-500">
                      0{{ index + 1 }}
                    </span>
                  </div>
                  <div class="mt-3.5 flex flex-wrap gap-1.5">
                    <span v-for="item in group.items" :key="item" class="chip">
                      {{ item }}
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        <aside class="lg:sticky lg:top-28 lg:self-start">
          <Reveal :delay="0.08" :y="26">
            <GlassCard class="p-6">
              <div class="flex items-center gap-4">
                <img
                  :src="profile.avatar"
                  :alt="tr(profile.name)"
                  width="64"
                  height="64"
                  loading="lazy"
                  class="h-16 w-16 rounded-2xl border border-white/15 object-cover shadow-lg shadow-violet-900/30"
                />
                <div>
                  <p class="text-lg font-semibold tracking-tight text-mist-50">
                    {{ tr(profile.name) }}
                  </p>
                  <p class="mt-0.5 text-[12px] text-mist-400">{{ tr(profile.role) }}</p>
                </div>
              </div>

              <div class="mt-6 space-y-3 text-[12.5px]">
                <p class="flex items-center gap-2 text-mist-300">
                  <MapPin :size="14" class="text-violet-300" />
                  {{ tr(profile.location) }}
                </p>
                <p class="flex items-center gap-2 text-mist-300">
                  <span class="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {{ tr(profile.availability) }}
                </p>
                <a
                  :href="`mailto:${profile.email}`"
                  class="flex items-center gap-2 text-mist-300 transition-colors hover:text-violet-300"
                >
                  <Mail :size="14" class="text-violet-300" />
                  {{ profile.email }}
                </a>
              </div>

              <div class="mt-5 flex items-center gap-2">
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

              <div class="mt-6 hairline" />

              <div class="mt-5 flex items-center gap-2">
                <a :href="`mailto:${profile.email}`" class="btn btn-primary flex-1 !py-2.5 text-[12.5px]">
                  {{ t('home.contactCta') }}
                  <ArrowUpRight :size="14" />
                </a>
                <CopyButton :value="profile.email" icon-only />
              </div>
            </GlassCard>
          </Reveal>
        </aside>
      </div>
    </section>

    <section class="pb-20 sm:pb-28">
      <div class="container-page">
        <SectionHeading
          :kicker="t('about.timelineKicker')"
          :title="t('about.timelineTitle')"
        />

        <ol class="mt-10 ml-1 space-y-10 border-l border-white/[0.08] pl-7">
          <li v-for="(item, index) in experience" :key="item.period" class="relative">
            <Reveal :delay="index * 0.05" :y="20">
              <span
                class="absolute top-2 -left-[34px] h-2.5 w-2.5 rounded-full border border-ink-950 bg-gradient-to-br from-violet-400 to-cyan-300 shadow-[0_0_12px_rgba(139,92,246,0.6)]"
                aria-hidden="true"
              />
              <p class="font-mono text-[10px] tracking-[0.2em] text-mist-500 uppercase">
                {{ item.period }}
              </p>
              <h3 class="mt-2 text-[15px] font-medium text-mist-50">
                {{ tr(item.role) }}
                <span class="text-mist-500">·</span>
                {{ tr(item.org) }}
              </h3>
              <p class="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-mist-400">
                {{ tr(item.desc) }}
              </p>
              <div class="mt-3 flex flex-wrap gap-1.5">
                <span v-for="tag in item.tags" :key="tag" class="chip">{{ tag }}</span>
              </div>
            </Reveal>
          </li>
        </ol>
      </div>
    </section>

    <section class="pb-24 sm:pb-32">
      <div class="container-page">
        <Reveal :y="26">
          <div
            class="relative overflow-hidden rounded-[2.25rem] border border-white/10 px-6 py-12 sm:px-12"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-violet-600/15 via-ink-900/20 to-cyan-500/10"
              aria-hidden="true"
            />
            <div class="relative grid gap-8 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p class="font-mono text-[10px] tracking-[0.22em] text-mist-500 uppercase">
                  {{ t('about.nowKicker') }}
                </p>
                <h2 class="mt-3 text-xl font-semibold text-mist-50">
                  {{ t('about.nowTitle') }}
                </h2>
                <p class="mt-3 max-w-xl text-[13.5px] leading-relaxed text-mist-300">
                  {{ t('about.nowDesc') }}
                </p>
              </div>
              <a :href="`mailto:${profile.email}`" class="btn btn-primary">
                {{ t('home.contactCta') }}
                <Mail :size="15" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  </div>
</template>
