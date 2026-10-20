import type { Locale } from './types'

export const LOCALE_STORAGE_KEY = 'nix.locale'

export function normalizeLocale(value: string | null | undefined): Locale | null {
  if (!value) return null
  const v = value.toLowerCase()
  if (v.startsWith('zh')) return 'zh'
  if (v.startsWith('en')) return 'en'
  return null
}

/** 优先使用上次的选择，其次跟随浏览器语言 */
export function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'zh'
  try {
    const stored = normalizeLocale(window.localStorage.getItem(LOCALE_STORAGE_KEY))
    if (stored) return stored
  } catch {
    /* 隐私模式下 localStorage 可能不可用 */
  }
  return normalizeLocale(window.navigator.language) ?? 'en'
}

export function applyLocale(locale: Locale): void {
  if (typeof document === 'undefined') return
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    /* ignore */
  }
}

export function formatDate(iso: string, locale: Locale): string {
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
