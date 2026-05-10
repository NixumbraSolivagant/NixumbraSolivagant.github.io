import { createI18n } from 'vue-i18n'
import zh from './locales/zh.json'
import en from './locales/en.json'

const savedLocale = localStorage.getItem('locale')
const browserLocale = navigator.language.startsWith('zh') ? 'zh' : 'en'
const defaultLocale = savedLocale || browserLocale

export const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages: { zh, en },
})

export const SUPPORTED_LOCALES = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'EN' },
]
