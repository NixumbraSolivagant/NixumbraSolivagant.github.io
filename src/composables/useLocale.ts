import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { L, Locale } from '@/lib/types'
import { applyLocale } from '@/lib/locale'

/**
 * 统一的双语访问入口：
 * - `t` 用于界面文案（来自 i18n 字典）
 * - `tr` / `trList` 用于数据层里已经写好的双语字段
 */
export function useLocale() {
  const { locale, t } = useI18n({ useScope: 'global' })

  const current = computed<Locale>(() => (locale.value === 'en' ? 'en' : 'zh'))

  function tr(value: L | string): string {
    if (typeof value === 'string') return value
    return value[current.value] ?? value.zh
  }

  function trList(value: Record<Locale, string[]>): string[] {
    return value[current.value] ?? value.zh
  }

  function setLocale(next: Locale): void {
    locale.value = next
    applyLocale(next)
  }

  function toggleLocale(): void {
    setLocale(current.value === 'zh' ? 'en' : 'zh')
  }

  return {
    locale: current,
    isZh: computed(() => current.value === 'zh'),
    t,
    tr,
    trList,
    setLocale,
    toggleLocale,
  }
}
