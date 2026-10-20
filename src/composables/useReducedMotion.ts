import { onBeforeUnmount, ref } from 'vue'

/** 监听 prefers-reduced-motion，组件内响应式可用 */
export function useReducedMotion() {
  const reduced = ref(false)

  if (typeof window !== 'undefined') {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced.value = query.matches
    const onChange = (event: MediaQueryListEvent) => {
      reduced.value = event.matches
    }
    query.addEventListener('change', onChange)
    onBeforeUnmount(() => query.removeEventListener('change', onChange))
  }

  return reduced
}

/** 是否是精确指针（鼠标、触控板），用于只在桌面开启光标与倾斜效果 */
export function isFinePointer(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}
