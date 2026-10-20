import { createI18n } from 'vue-i18n'
import zh from './messages/zh'
import en from './messages/en'
import { detectLocale } from '@/lib/locale'

export const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: { zh, en },
  missingWarn: false,
  fallbackWarn: false,
})

export default i18n
