<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@/composables/useLocale'

const { locale, setLocale, t } = useLocale()
const isZh = computed(() => locale.value === 'zh')
</script>

<template>
  <div
    class="relative flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md"
    role="group"
    :aria-label="t('a11y.toggleLocale')"
  >
    <span
      class="absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      :style="{ transform: isZh ? 'translateX(0)' : 'translateX(100%)' }"
      aria-hidden="true"
    />
    <button
      type="button"
      class="relative z-10 w-9 rounded-full py-1 text-[11px] font-medium transition-colors duration-300"
      :class="isZh ? 'text-white' : 'text-mist-400 hover:text-mist-200'"
      :aria-pressed="isZh"
      @click="setLocale('zh')"
    >
      中
    </button>
    <button
      type="button"
      class="relative z-10 w-9 rounded-full py-1 font-mono text-[10px] font-medium tracking-wide transition-colors duration-300"
      :class="!isZh ? 'text-white' : 'text-mist-400 hover:text-mist-200'"
      :aria-pressed="!isZh"
      @click="setLocale('en')"
    >
      EN
    </button>
  </div>
</template>
