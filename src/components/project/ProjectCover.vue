<script setup lang="ts">
import { useId } from 'vue'
import type { CoverVariant } from '@/lib/types'

defineProps<{
  variant: CoverVariant
  from: string
  to: string
  tint: string
}>()

const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
</script>

<template>
  <div class="project-cover absolute inset-0">
    <svg
      class="h-full w-full"
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient :id="`g-${uid}`" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" :stop-color="from" stop-opacity="0.9" />
          <stop offset="58%" :stop-color="to" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#05060a" stop-opacity="0.15" />
        </linearGradient>
        <radialGradient :id="`r-${uid}`">
          <stop offset="0%" :stop-color="tint" stop-opacity="0.5" />
          <stop offset="100%" :stop-color="tint" stop-opacity="0" />
        </radialGradient>
        <filter :id="`b-${uid}`" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>

      <rect width="400" height="260" :fill="`url(#g-${uid})`" opacity="0.42" />

      <!-- 轨道：环与点 -->
      <g v-if="variant === 'orbit'">
        <circle cx="210" cy="140" r="104" fill="none" :stroke="tint" stroke-opacity="0.16" />
        <circle cx="210" cy="140" r="76" fill="none" :stroke="tint" stroke-opacity="0.22" />
        <circle cx="210" cy="140" r="46" fill="none" :stroke="tint" stroke-opacity="0.3" />
        <circle cx="210" cy="140" r="20" :fill="tint" fill-opacity="0.12" />
        <circle cx="210" cy="140" r="5" :fill="tint" />
        <circle cx="286" cy="140" r="3.5" :fill="to" />
        <circle cx="210" cy="64" r="2.5" :fill="tint" fill-opacity="0.9" />
        <circle cx="148" cy="196" r="2" :fill="tint" fill-opacity="0.7" />
        <line x1="210" y1="36" x2="210" y2="244" stroke="#fff" stroke-opacity="0.05" />
        <line x1="106" y1="140" x2="314" y2="140" stroke="#fff" stroke-opacity="0.05" />
      </g>

      <!-- 图表：面积与柱 -->
      <g v-else-if="variant === 'chart'">
        <g stroke="#fff" stroke-opacity="0.06">
          <line v-for="y in [60, 100, 140, 180, 220]" :key="y" x1="24" :y1="y" x2="376" :y2="y" />
        </g>
        <g :fill="tint" fill-opacity="0.14">
          <rect v-for="(h, i) in [42, 66, 50, 88, 62, 104, 74]" :key="i" :x="36 + i * 48" :y="236 - h" width="26" :height="h" rx="5" />
        </g>
        <path
          d="M36 196 L84 168 L132 178 L180 132 L228 148 L276 96 L324 116 L372 78"
          fill="none"
          :stroke="tint"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-opacity="0.85"
        />
        <path
          d="M36 196 L84 168 L132 178 L180 132 L228 148 L276 96 L324 116 L372 78 L372 236 L36 236 Z"
          :fill="`url(#r-${uid})`"
          opacity="0.5"
        />
        <circle v-for="(p, i) in [[84,168],[180,132],[276,96],[372,78]]" :key="i" :cx="p[0]" :cy="p[1]" r="3" :fill="tint" />
      </g>

      <!-- 笔记：叠放的卡片 -->
      <g v-else-if="variant === 'notes'">
        <g transform="rotate(-8 200 140)">
          <rect x="102" y="58" width="196" height="150" rx="14" fill="#fff" fill-opacity="0.045" stroke="#fff" stroke-opacity="0.1" />
        </g>
        <g transform="rotate(4 210 140)">
          <rect x="110" y="66" width="196" height="150" rx="14" fill="#0a0d17" fill-opacity="0.55" stroke="#fff" stroke-opacity="0.12" />
          <rect x="130" y="88" width="92" height="7" rx="3.5" :fill="tint" fill-opacity="0.55" />
          <rect x="130" y="108" width="150" height="4" rx="2" fill="#fff" fill-opacity="0.16" />
          <rect x="130" y="122" width="132" height="4" rx="2" fill="#fff" fill-opacity="0.12" />
          <rect x="130" y="136" width="146" height="4" rx="2" fill="#fff" fill-opacity="0.1" />
          <rect x="130" y="158" width="60" height="18" rx="9" :fill="tint" fill-opacity="0.16" />
          <rect x="198" y="158" width="44" height="18" rx="9" fill="#fff" fill-opacity="0.06" />
        </g>
      </g>

      <!-- 渐变：柔光与玻璃框 -->
      <g v-else>
        <circle cx="120" cy="80" r="90" :fill="`url(#r-${uid})`" :filter="`url(#b-${uid})`" />
        <circle cx="320" cy="200" r="80" :fill="`url(#r-${uid})`" :filter="`url(#b-${uid})`" opacity="0.8" />
        <rect x="96" y="52" width="208" height="156" rx="20" fill="#fff" fill-opacity="0.04" stroke="#fff" stroke-opacity="0.14" />
        <rect x="114" y="70" width="80" height="8" rx="4" :fill="tint" fill-opacity="0.6" />
        <rect x="114" y="92" width="150" height="4" rx="2" fill="#fff" fill-opacity="0.14" />
        <rect x="114" y="106" width="120" height="4" rx="2" fill="#fff" fill-opacity="0.1" />
        <circle cx="126" cy="164" r="10" :fill="tint" fill-opacity="0.2" :stroke="tint" stroke-opacity="0.5" />
      </g>
    </svg>
  </div>
</template>
