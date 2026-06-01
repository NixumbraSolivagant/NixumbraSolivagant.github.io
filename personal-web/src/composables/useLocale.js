import { computed } from 'vue'
import { i18n } from '@/i18n/index.js'

export function useLocale() {
  const locale = computed(() => i18n.global.locale.value)

  function toggleLocale() {
    const next = locale.value === 'zh' ? 'en' : 'zh'
    i18n.global.locale.value = next
    localStorage.setItem('locale', next)
  }

  return { locale, toggleLocale }
}
