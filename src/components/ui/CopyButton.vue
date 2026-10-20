<script setup lang="ts">
import { ref } from 'vue'
import { Check, Copy } from 'lucide-vue-next'
import { useLocale } from '@/composables/useLocale'

const props = withDefaults(
  defineProps<{ value: string; label?: string; iconOnly?: boolean }>(),
  { label: undefined, iconOnly: false },
)

const { t } = useLocale()
const copied = ref(false)
let timer: number | undefined

async function copy() {
  try {
    await navigator.clipboard.writeText(props.value)
  } catch {
    const area = document.createElement('textarea')
    area.value = props.value
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    document.execCommand('copy')
    document.body.removeChild(area)
  }
  copied.value = true
  window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    copied.value = false
  }, 1800)
}
</script>

<template>
  <button
    type="button"
    class="btn btn-ghost text-xs"
    :class="iconOnly ? '!px-2.5 !py-2.5' : '!px-3.5 !py-2'"
    :aria-label="t('a11y.copyEmail')"
    @click="copy"
  >
    <Transition name="toast" mode="out-in">
      <Check v-if="copied" :size="14" class="text-emerald-300" />
      <Copy v-else :size="14" />
    </Transition>
    <span v-if="!iconOnly">{{ copied ? t('common.copied') : (label ?? t('common.copy')) }}</span>
  </button>
</template>
