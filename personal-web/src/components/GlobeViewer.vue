<template>
  <div class="gv-wrap">
    <div class="gv-viewport" ref="viewportEl">

      <!-- ── Error state ── -->
      <Transition name="fade">
        <div v-if="hasError" class="gv-error">
          <span class="gv-error-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </span>
          <span>{{ t('common.globeError') }}</span>
        </div>
      </Transition>

      <!-- ── HUD: above the globe ── -->
      <div class="gv-hud">
        <div class="hud-inner">
          <span class="hud-label">GEO-SYS</span>
          <span class="hud-sep">//</span>
          <span class="hud-label-sub">VISITOR MAP</span>
        </div>
        <div class="hud-meta">
          <span class="hud-live-dot" />
          <span class="hud-text">{{ total > 0 ? total.toLocaleString() : '—' }}</span>
          <span class="hud-text-sub">visits · {{ countryCount > 0 ? countryCount : '—' }} countries</span>
        </div>
      </div>

      <!-- ── Loading ── -->
      <Transition name="fade">
        <div v-if="!earthReady && !hasError" class="gv-loading">
          <div class="gv-ring" />
        </div>
      </Transition>

      <!-- ── Globe canvas ── -->
      <canvas ref="canvasEl" class="gv-canvas" />

      <!-- ── Hint ── -->
      <Transition name="fade">
        <div v-if="earthReady && !hasInteracted" class="gv-hint">
          Drag to rotate · Visit locations worldwide
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { EarthRenderer } from '@/composables/useEarthRenderer.js'
import { fetchTopCountries } from '@/modules/umamiClient.js'
import { statsToMarkers } from '@/modules/geoUtils.js'

const props = defineProps({
  refreshInterval: { type: Number, default: 60_000 },
})

const { t } = useI18n()

const canvasEl      = ref(null)
const viewportEl    = ref(null)
const earthReady    = ref(false)
const hasError      = ref(false)
const hasInteracted = ref(false)
const total         = ref(0)
const countryCount  = ref(0)

let renderer  = null
let pollTimer = null

function onInteract() {
  hasInteracted.value = true
}

async function loadData() {
  try {
    const countries = await fetchTopCountries(20)
    if (!countries.length) return

    total.value        = countries.reduce((s, c) => s + c.y, 0)
    countryCount.value = countries.length

    const markers = statsToMarkers(countries)
    const pins = markers.map(m => ({
      lat:      m.location[0],
      lon:      m.location[1],
      count:    m.count ?? 0,
      normSize: m.size ?? 0,
    }))

    if (renderer) {
      renderer.setVisitorMarkers(pins)
    }
  } catch (e) {
    console.warn('[GlobeViewer] load failed:', e)
  }
}

onMounted(async () => {
  await nextTick()

  // Guard against zero-size container (e.g. element hidden via CSS)
  const w = canvasEl.value?.clientWidth ?? 0
  const h = canvasEl.value?.clientHeight ?? 0
  if (w === 0 || h === 0) {
    hasError.value = true
    return
  }

  try {
    renderer = new EarthRenderer(canvasEl.value)

    canvasEl.value?.addEventListener('mousedown',  onInteract)
    canvasEl.value?.addEventListener('touchstart', onInteract, { passive: true })

    earthReady.value = true
    await loadData()

    if (props.refreshInterval > 0) {
      pollTimer = setInterval(loadData, props.refreshInterval)
    }
  } catch (e) {
    console.error('[GlobeViewer] init failed:', e)
    hasError.value = true
  }
})

onBeforeUnmount(() => {
  clearInterval(pollTimer)
  renderer?.destroy()
  renderer = null
})

defineExpose({ reload: loadData })
</script>

<style scoped>
/* ── Layout ── */
.gv-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.gv-viewport {
  position: relative;
  width: 100%;
  max-width: 560px;
  aspect-ratio: 1 / 1;
  overflow: hidden;
}

/* ── Canvas ── */
.gv-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: block;
  cursor: grab;
  box-shadow:
    0 0 0 1.5px var(--card_stroke_color),
    0 0 36px -4px rgba(56, 189, 248, 0.20),
    0 0 72px -10px rgba(56, 189, 248, 0.10);
}
.gv-canvas:active { cursor: grabbing; }

/* ── Loading ── */
.gv-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 5;
}
.gv-ring {
  width: 55%;
  height: 55%;
  border-radius: 50%;
  border: 2px solid var(--card_stroke_color);
  border-top-color: var(--accent, #38bdf8);
  animation: spin 1.1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── HUD (above globe) ── */
.gv-hud {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  pointer-events: none;

  background: var(--item_bg_color);
  border: 1px solid var(--card_stroke_color);
  border-radius: 12px;
  padding: 8px 20px 7px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.18);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;

  min-width: 160px;
  white-space: nowrap;
}

.hud-inner {
  display: flex;
  align-items: center;
  gap: 6px;
}

.hud-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--accent_strong, #7dd3fc);
  line-height: 1;
}
.hud-sep {
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 1px;
  color: var(--card_stroke_color);
  line-height: 1;
}
.hud-label-sub {
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--item_left_text_color);
  opacity: 0.55;
  line-height: 1;
}

.hud-meta {
  display: flex;
  align-items: center;
  gap: 5px;
}

.hud-live-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent, #38bdf8);
  animation: dot-pulse 2.4s ease-in-out infinite;
  flex-shrink: 0;
}
.hud-text {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--main_text_color);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.hud-text-sub {
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.5px;
  color: var(--item_left_text_color);
  opacity: 0.55;
  line-height: 1;
}

@keyframes dot-pulse { 0%,100%{opacity:1} 50%{opacity:0.25} }

/* ── Hint ── */
.gv-hint {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: var(--item_left_text_color);
  opacity: 0.3;
  pointer-events: none;
  white-space: nowrap;
  z-index: 10;
  letter-spacing: 0.5px;
}

/* ── Transitions ── */
.fade-leave-active { transition: opacity 0.5s; }
.fade-leave-to     { opacity: 0; }
</style>
