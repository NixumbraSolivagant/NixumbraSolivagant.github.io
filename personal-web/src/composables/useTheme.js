/**
 * Centralized theme management — single source of truth.
 * Manages the dark/light theme by setting CSS custom properties on
 * document.documentElement. No other code should directly set those vars.
 */
import { ref } from 'vue'

// Persisted dark/light preference
export const isDarkTheme = ref(localStorage.getItem('theme') === 'Dark')

const DARK_VARS = {
  '--main_bg_color': 'url(/static/img/backgrounds/bg-1.png)',
  '--main_text_color': '#f8fafc',
  '--item_left_title_color': '#f8fafc',
  '--item_left_text_color': '#e2e8f0',
  '--footer_text_color': '#e2e8f0',
  '--fill': '#ffffff',
  '--text_bg_color': 'rgba(0, 0, 0, 0.45)',
  '--item_bg_color': 'rgba(15, 23, 42, 0.52)',
  '--item_hover_color': 'rgba(15, 23, 42, 0.65)',
  '--left_tag_item': 'rgba(15, 23, 42, 0.55)',
  '--back_filter_color': 'rgba(0, 0, 0, 0.35)',
  '--card_stroke_color': 'rgba(255, 255, 255, 0.2)',
  '--accent': '#38bdf8',
  '--accent_strong': '#7dd3fc',
}

const LIGHT_VARS = {
  '--main_bg_color': 'url(/static/img/backgrounds/bg-1.png)',
  '--main_text_color': '#111827',
  '--item_left_title_color': '#111827',
  '--item_left_text_color': '#4b5563',
  '--footer_text_color': '#374151',
  '--fill': '#111827',
  '--text_bg_color': 'rgba(255, 255, 255, 0.7)',
  '--item_bg_color': 'rgba(255, 255, 255, 0.72)',
  '--item_hover_color': 'rgba(255, 255, 255, 0.85)',
  '--left_tag_item': 'rgba(255, 255, 255, 0.7)',
  '--back_filter_color': 'rgba(255, 255, 255, 0.2)',
  '--card_stroke_color': 'rgba(148, 163, 184, 0.18)',
  '--accent': '#38bdf8',
  '--accent_strong': '#0284c7',
}

export function applyTheme(dark) {
  const root = document.documentElement
  const vars = dark ? DARK_VARS : LIGHT_VARS
  for (const [prop, value] of Object.entries(vars)) {
    root.style.setProperty(prop, value)
  }
  root.dataset.theme = dark ? 'Dark' : 'Light'
  localStorage.setItem('theme', dark ? 'Dark' : 'Light')
}

/** Must be called once when the app mounts (after DOM is ready). */
export function initTheme() {
  applyTheme(isDarkTheme.value)
}

/** Toggle between dark and light. Call this from a UI control. */
export function toggleTheme() {
  isDarkTheme.value = !isDarkTheme.value
  applyTheme(isDarkTheme.value)
}
