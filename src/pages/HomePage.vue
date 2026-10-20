<script setup lang="ts">
import { ref } from 'vue'
import { ArrowDown, ArrowRight, ArrowUpRight, Mail, MapPin, Sparkles } from 'lucide-vue-next'
import Reveal from '@/components/ui/Reveal.vue'
import Magnetic from '@/components/ui/Magnetic.vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import ProjectModal from '@/components/project/ProjectModal.vue'
import PostCard from '@/components/blog/PostCard.vue'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'
import { scrollToElement } from '@/composables/useLenis'
import { marqueeTags, profile, projects, stats } from '@/data/site'
import { latestPosts } from '@/lib/blog'
import type { Project } from '@/lib/types'

const { t, tr, trList } = useLocale()
useSeo(() => ({ title: t('meta.homeTitle'), description: t('meta.homeDesc') }))

const activeProject = ref<Project | null>(null)
</script>

<template>
  <div>
    <!-- ============================ Hero ============================ -->
    <section class="relative flex min-h-[100svh] items-center overflow-hidden pt-32 pb-16 sm:pt-36">
      <div class="container-page relative grid items-center gap-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
        <div class="relative z-10">
          <Reveal :y="16" :duration="0.7">
            <div
              class="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pr-3.5 pl-2 backdrop-blur-md"
            >
              <span class="relative flex h-1.5 w-1.5">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span class="font-mono text-[10px] tracking-[0.16em] text-mist-300 uppercase">
                {{ t('home.eyebrow') }}
              </span>
            </div>
          </Reveal>

          <Reveal :delay="0.08" :y="34" :duration="0.95">
            <h1 class="mt-7 text-[clamp(2.15rem,4.8vw,3.9rem)] leading-[1.08] font-semibold tracking-[-0.035em]">
              <span class="block text-mist-50">{{ t('home.headlineTop') }}</span>
              <span class="gradient-text mt-1 block">{{ t('home.headlineBottom') }}</span>
            </h1>
          </Reveal>

          <Reveal :delay="0.18" :y="24">
            <p class="mt-7 max-w-[34rem] text-[15px] leading-relaxed text-mist-300 sm:text-base">
              {{ t('home.intro') }}
            </p>
          </Reveal>

          <Reveal :delay="0.26" :y="20">
            <div class="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <RouterLink to="/work" class="btn btn-primary">
                  {{ t('home.ctaWork') }}
                  <ArrowUpRight :size="15" />
                </RouterLink>
              </Magnetic>
              <Magnetic :strength="0.14">
                <RouterLink to="/blog" class="btn btn-ghost">
                  {{ t('home.ctaBlog') }}
                  <ArrowRight :size="15" />
                </RouterLink>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal :delay="0.34" :y="18">
            <dl class="mt-12 flex flex-wrap gap-x-10 gap-y-5">
              <div v-for="stat in stats" :key="stat.value">
                <dt class="font-display text-2xl font-semibold text-mist-50">
                  {{ stat.value }}
                </dt>
                <dd class="mt-0.5 font-mono text-[10px] tracking-[0.14em] text-mist-500 uppercase">
                  {{ tr(stat.label) }}
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <!-- 代码窗口 -->
        <Reveal :delay="0.2" :y="40" :duration="1" class="relative">
          <div class="relative mx-auto w-full max-w-[440px]">
            <div
              class="pointer-events-none absolute -inset-12 rounded-[3rem] bg-gradient-to-tr from-violet-600/25 via-transparent to-cyan-400/20 blur-3xl"
              aria-hidden="true"
            />

            <div
              class="glass glass-sheen relative overflow-hidden rounded-3xl shadow-[0_40px_100px_-40px_rgba(0,0,0,1)]"
            >
              <div class="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
                <span class="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span class="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span class="h-2.5 w-2.5 rounded-full bg-white/[0.07]" />
                <span class="ml-2 font-mono text-[10px] text-mist-500">~/studio/craft.ts</span>
                <span class="ml-auto inline-flex items-center gap-1.5 font-mono text-[9px] text-emerald-400/80">
                  <span class="h-1 w-1 rounded-full bg-emerald-400" />
                  live
                </span>
              </div>

              <pre
                class="overflow-x-auto px-5 py-5 font-mono text-[11.5px] leading-[1.95] text-mist-300"
              ><code><span class="text-violet-300">const</span> <span class="text-cyan-200">craft</span> = {
  focus: <span class="text-emerald-300">'pixels &amp; motion'</span>,
  stack: [<span class="text-emerald-300">'vue'</span>, <span class="text-emerald-300">'ts'</span>, <span class="text-emerald-300">'css'</span>],
  shipping: <span class="text-amber-300">true</span>,
  curiosity: <span class="text-amber-300">Infinity</span>,
}<span class="caret ml-0.5 inline-block h-3 w-[6px] translate-y-[1px] bg-violet-300/80" /></code></pre>

              <div class="flex items-center justify-between border-t border-white/[0.06] px-4 py-3">
                <span class="font-mono text-[9px] tracking-wide text-mist-500">
                  TypeScript · Vue 3 · Motion
                </span>
                <span class="flex items-center gap-1" aria-hidden="true">
                  <span class="h-1 w-6 rounded-full bg-gradient-to-r from-violet-400 to-cyan-300 opacity-80" />
                  <span class="h-1 w-3 rounded-full bg-white/10" />
                </span>
              </div>
            </div>

            <!-- 浮动小卡片 -->
            <div class="animate-float-slow absolute -top-6 -left-7 hidden sm:block" style="animation-delay: -1.2s">
              <div class="glass flex items-center gap-2 rounded-2xl px-3 py-2">
                <span class="grid h-6 w-6 place-items-center rounded-lg bg-violet-500/20 text-violet-300">
                  <Sparkles :size="13" />
                </span>
                <span class="font-mono text-[10px] text-mist-300">motion-first</span>
              </div>
            </div>

            <div
              class="animate-float-slow absolute -right-7 -bottom-5 hidden sm:block"
              style="animation-delay: -4s"
            >
              <div class="glass flex items-center gap-2 rounded-2xl px-3 py-2">
                <span class="grid h-6 w-6 place-items-center rounded-lg bg-cyan-500/20 text-cyan-300">
                  <MapPin :size="13" />
                </span>
                <span class="font-mono text-[10px] text-mist-300">{{ tr(profile.location) }}</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <button
        type="button"
        class="group absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
        @click="scrollToElement('#about')"
      >
        <span class="font-mono text-[9px] tracking-[0.24em] text-mist-500 uppercase">
          {{ t('common.scroll') }}
        </span>
        <span class="relative h-9 w-px overflow-hidden bg-white/10">
          <span class="scroll-cue absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-violet-300 to-transparent" />
        </span>
        <ArrowDown :size="12" class="text-mist-500 transition-transform duration-500 group-hover:translate-y-0.5" />
      </button>
    </section>

    <!-- ============================ Marquee ============================ -->
    <section class="relative border-y border-white/[0.05] bg-white/[0.012] py-5">
      <div class="mask-fade-x flex overflow-hidden">
        <div class="animate-marquee flex w-max shrink-0 items-center gap-8 hover:[animation-play-state:paused]">
          <template v-for="copy in 2" :key="copy">
            <span
              v-for="tag in marqueeTags"
              :key="`${copy}-${tag}`"
              class="flex items-center gap-8"
            >
              <span class="font-mono text-[10.5px] tracking-[0.18em] text-mist-500 uppercase">
                {{ tag }}
              </span>
              <span class="h-1 w-1 rounded-full bg-violet-400/50" />
            </span>
          </template>
        </div>
      </div>
    </section>

    <!-- ============================ About ============================ -->
    <section id="about" class="relative py-24 sm:py-32">
      <div class="container-page grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionHeading
            :kicker="t('home.aboutKicker')"
            :title="t('home.aboutTitle')"
            :desc="t('home.aboutDesc')"
          />
          <Reveal :delay="0.1" :y="20">
            <div class="mt-8 space-y-4 text-[14.5px] leading-relaxed text-mist-400">
              <p v-for="(paragraph, index) in trList(profile.bio)" :key="index">
                {{ paragraph }}
              </p>
            </div>
          </Reveal>
          <Reveal :delay="0.16" :y="16">
            <RouterLink
              to="/about"
              class="link-underline mt-8 inline-flex items-center gap-1.5 text-[13px] font-medium"
            >
              {{ t('home.aboutLink') }}
              <ArrowUpRight :size="13" />
            </RouterLink>
          </Reveal>
        </div>

        <div class="space-y-4">
          <Reveal :delay="0.06" :y="24">
            <GlassCard class="p-6">
              <div class="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-mist-500 uppercase">
                <span class="relative flex h-1.5 w-1.5">
                  <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                {{ t('home.nowTitle') }}
              </div>
              <p class="mt-3 text-[13.5px] leading-relaxed text-mist-300">
                {{ t('home.nowDesc') }}
              </p>
            </GlassCard>
          </Reveal>

          <Reveal :delay="0.12" :y="24">
            <GlassCard class="p-6">
              <p class="font-mono text-[10px] tracking-[0.2em] text-mist-500 uppercase">
                {{ t('home.stackTitle') }}
              </p>
              <div class="mt-4 flex flex-wrap gap-1.5">
                <span v-for="tag in marqueeTags.slice(0, 10)" :key="tag" class="chip">
                  {{ tag }}
                </span>
              </div>
            </GlassCard>
          </Reveal>

          <Reveal :delay="0.18" :y="24">
            <GlassCard class="relative overflow-hidden p-6">
              <div class="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-violet-500/15 blur-2xl" />
              <p class="font-mono text-[10px] tracking-[0.2em] text-mist-500 uppercase">
                {{ t('home.contactKicker') }}
              </p>
              <a
                :href="`mailto:${profile.email}`"
                class="mt-3 inline-block text-[15px] font-medium text-mist-100 transition-colors hover:text-violet-300"
              >
                {{ profile.email }}
              </a>
              <div class="mt-4">
                <CopyButton :value="profile.email" />
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>

    <!-- ============================ Work ============================ -->
    <section class="relative py-24 sm:py-32">
      <div class="container-page">
        <div class="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            :kicker="t('home.workKicker')"
            :title="t('home.workTitle')"
            :desc="t('home.workDesc')"
          />
          <Reveal :delay="0.14" :y="16">
            <RouterLink to="/work" class="btn btn-ghost">
              {{ t('common.viewAll') }}
              <ArrowUpRight :size="14" />
            </RouterLink>
          </Reveal>
        </div>

        <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal
            v-for="(project, index) in projects.slice(0, 3)"
            :key="project.slug"
            :delay="index * 0.08"
            :y="32"
          >
            <ProjectCard :project="project" @open="activeProject = $event" />
          </Reveal>
        </div>
      </div>
    </section>

    <!-- ============================ Writing ============================ -->
    <section class="relative py-24 sm:py-32">
      <div class="container-page">
        <div class="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            :kicker="t('home.writingKicker')"
            :title="t('home.writingTitle')"
            :desc="t('home.writingDesc')"
          />
          <Reveal :delay="0.14" :y="16">
            <RouterLink to="/blog" class="btn btn-ghost">
              {{ t('common.viewAll') }}
              <ArrowUpRight :size="14" />
            </RouterLink>
          </Reveal>
        </div>

        <div class="mt-12 space-y-4">
          <Reveal :y="32">
            <PostCard :post="latestPosts[0]" featured />
          </Reveal>
          <div class="grid gap-4">
            <Reveal
              v-for="(post, index) in latestPosts.slice(1, 3)"
              :key="post.slug"
              :delay="0.06 + index * 0.06"
              :y="26"
            >
              <PostCard :post="post" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================ Contact ============================ -->
    <section id="contact" class="relative pt-24 pb-20 sm:pt-32 sm:pb-24">
      <div class="container-page">
        <Reveal :y="30">
          <div
            class="relative overflow-hidden rounded-[2.5rem] border border-white/10 px-6 py-14 text-center sm:px-16 sm:py-16"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-ink-900/30 to-cyan-500/10"
              aria-hidden="true"
            />
            <div
              class="pointer-events-none absolute -top-32 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-violet-500/25 blur-[110px]"
              aria-hidden="true"
            />
            <div
              class="pointer-events-none absolute inset-0 opacity-[0.35]"
              style="
                background-image:
                  linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                background-size: 56px 56px;
                mask-image: radial-gradient(ellipse at 50% 30%, #000 5%, transparent 70%);
              "
              aria-hidden="true"
            />

            <div class="relative">
              <span class="eyebrow justify-center">{{ t('home.contactKicker') }}</span>
              <h2 class="mt-5 text-[clamp(2rem,4.6vw,3.4rem)] font-semibold tracking-[-0.03em] text-mist-50">
                {{ t('home.contactTitle') }}
              </h2>
              <p class="mx-auto mt-4 max-w-2xl text-balance text-[14px] leading-relaxed text-mist-300">
                {{ t('home.contactDesc') }}
              </p>
              <div class="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Magnetic>
                  <a :href="`mailto:${profile.email}`" class="btn btn-primary">
                    {{ t('home.contactCta') }}
                    <Mail :size="15" />
                  </a>
                </Magnetic>
                <CopyButton :value="profile.email" :label="t('common.copy')" />
              </div>
              <p class="mt-7 font-mono text-[10px] tracking-[0.18em] text-mist-500">
                {{ t('home.emailLabel') }} · <span class="normal-case">{{ profile.email }}</span>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    <ProjectModal :project="activeProject" @close="activeProject = null" />
  </div>
</template>
