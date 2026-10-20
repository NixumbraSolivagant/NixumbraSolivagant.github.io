import { watchEffect } from 'vue'

interface SeoInput {
  title: string
  description?: string
}

function setMeta(attr: 'name' | 'property', key: string, value: string): void {
  if (typeof document === 'undefined') return
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

/**
 * 随语言与路由更新标题、描述和 OG 标签。
 * 传入 getter，以便语言切换时重新计算。
 */
export function useSeo(get: () => SeoInput): void {
  watchEffect(() => {
    const { title, description } = get()
    document.title = title
    setMeta('property', 'og:title', title)
    if (description) {
      setMeta('name', 'description', description)
      setMeta('property', 'og:description', description)
    }
    setMeta('property', 'og:url', window.location.href)
  })
}
