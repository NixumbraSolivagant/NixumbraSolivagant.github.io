import Lenis from 'lenis'

let lenis: Lenis | null = null

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/** 全局只初始化一次；减少动效偏好下直接放弃平滑滚动 */
export function initLenis(): void {
  if (typeof window === 'undefined' || lenis || prefersReducedMotion()) return

  lenis = new Lenis({
    autoRaf: true,
    duration: 1.05,
    smoothWheel: true,
    touchMultiplier: 1.4,
    easing: (t: number) => 1 - Math.pow(1 - t, 3),
  })
}

export function destroyLenis(): void {
  lenis?.destroy()
  lenis = null
}

export function scrollToTop(immediate = false): void {
  if (lenis) {
    lenis.scrollTo(0, { immediate })
    return
  }
  window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
}

export function scrollToElement(target: Element | string, offset = -92): void {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.1 })
    return
  }
  const node = typeof target === 'string' ? document.querySelector(target) : target
  if (!node) return
  const top = node.getBoundingClientRect().top + window.scrollY + offset
  window.scrollTo({ top, behavior: 'smooth' })
}

/** 支持中文锚点：用 id 查找，避免 selector 转义问题 */
export function scrollToHash(hash: string): void {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  if (!id) return
  const node = document.getElementById(id)
  if (node) scrollToElement(node)
}

export function lockScroll(): void {
  lenis?.stop()
  document.body.style.overflow = 'hidden'
}

export function unlockScroll(): void {
  lenis?.start()
  document.body.style.overflow = ''
}
