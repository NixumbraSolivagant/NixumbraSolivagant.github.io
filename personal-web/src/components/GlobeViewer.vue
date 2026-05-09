<template>
  <div class="gv-wrap">
    <div class="gv-viewport" ref="viewportEl">
      <Transition name="fade">
        <div v-if="!earthReady" class="gv-loading">
          <div class="gv-ring" />
        </div>
      </Transition>

      <canvas ref="canvasEl" class="gv-canvas" />

      <div
        v-for="pin in visiblePins"
        :key="pin.key"
        class="gv-pin"
        :style="{
          left: pin.x + 'px',
          top: pin.y + 'px',
          transform: `translate(-50%, -50%) scale(${0.5 + pin.normSize * 0.5})`,
        }"
      />

      <div class="gv-hud">
        <div class="hud-title">{{ hudTitle }}</div>
        <div class="hud-sub">{{ hudSub }}</div>
      </div>

      <div class="gv-controls" v-if="earthReady">
        <button
          class="ctrl-btn"
          :class="{ active: globeMode === 'day' }"
          @click="setGlobeMode('day')"
        >Daylight</button>
        <button
          class="ctrl-btn"
          :class="{ active: globeMode === 'night' }"
          @click="setGlobeMode('night')"
        >Night Lights</button>
      </div>

      <Transition name="fade">
        <div v-if="earthReady && !hasInteracted" class="gv-hint">
          Drag to rotate · Visit locations worldwide
        </div>
      </Transition>
    </div>

    <div v-if="earthReady && total > 0" class="gv-footer">
      <span class="footer-dot" />
      <span>{{ total }} visits · {{ countryCount }} countries</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { EarthRenderer } from '@/composables/useEarthRenderer.js'
import { fetchTopCountries } from '@/modules/umamiClient.js'
import { COUNTRY_COORDS, statsToMarkers } from '@/modules/geoUtils.js'

const props = defineProps({
  refreshInterval: { type: Number, default: 60_000 },
})

const canvasEl       = ref(null)
const viewportEl     = ref(null)
const earthReady     = ref(false)
const hasInteracted  = ref(false)
const total          = ref(0)
const countryCount   = ref(0)
const globeMode      = ref('day')
const pins           = ref([])
const visiblePins    = ref([])

const hudTitle = 'GEO-SYS // VISITOR MAP'
const hudSub   = computed(() => {
  const modes = { day: 'Daylight Mode · Online', night: 'Night Lights Mode · Online' }
  return modes[globeMode.value]
})

let renderer   = null
let pollTimer  = null
let pinKeySeq  = 0

function onInteract() {
  hasInteracted.value = true
}

function setGlobeMode(mode) {
  globeMode.value = mode
  renderer?.setMode(mode)
}

async function loadData() {
  try {
    const countries = await fetchTopCountries(20)
    if (!countries.length) return

    total.value        = countries.reduce((s, c) => s + c.y, 0)
    countryCount.value = countries.length

    const markers = statsToMarkers(countries)
    pins.value = markers.map(m => ({
      key:      ++pinKeySeq,
      lat:      m.location[0],
      lon:      m.location[1],
      count:    m.count ?? 0,
      normSize: m.size ?? 0,
      x:        0,
      y:        0,
      visible:  false,
    }))

    if (renderer) {
      renderer.setVisitorMarkers(pins.value)
    }
  } catch (e) {
    console.warn('[GlobeViewer] load failed:', e)
  }
}

onMounted(async () => {
  await nextTick()
  renderer = new EarthRenderer(canvasEl.value)

  renderer.onRender((W, H) => {
    renderer.updatePinPositions(pins.value, W, H)
    visiblePins.value = pins.value.filter(p => {
      p.x = p._x ?? p.x
      p.y = p._y ?? p.y
      p.visible = p._visible ?? false
      return p.visible
    })
  })

  viewportEl.value?.addEventListener('mousedown',  onInteract)
  viewportEl.value?.addEventListener('touchstart',  onInteract, { passive: true })

  earthReady.value = true
  await loadData()

  if (props.refreshInterval > 0) {
    pollTimer = setInterval(loadData, props.refreshInterval)
  }
})

onBeforeUnmount(() => {
  clearInterval(pollTimer)
  renderer?.destroy()
  renderer = null
})

defineExpose({ reload: loadData, setGlobeMode })
</script>

<style scoped>
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

/* ── Loading ring ── */
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

/* ── Visitor pins ── */
.gv-pin {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--accent, #38bdf8);
  box-shadow: 0 0 8px 2px rgba(56, 189, 248, 0.6);
  pointer-events: none;
  z-index: 10;
  transition: left 0.05s linear, top 0.05s linear;
}

/* ── HUD ── */
.gv-hud {
  position: absolute;
  top: 22px;
  left: 26px;
  color: #fff;
  pointer-events: none;
  z-index: 10;
}
.hud-title {
  font-size: 22px;
  font-weight: 100;
  letter-spacing: 3px;
  border-left: 2px solid #00aaff;
  padding-left: 12px;
  margin-bottom: 4px;
  color: rgba(255,255,255,0.9);
}
.hud-sub {
  font-size: 10px;
  color: #88ccff;
  letter-spacing: 1.5px;
  padding-left: 14px;
  text-transform: uppercase;
  opacity: 0.75;
}

/* ── Mode controls ── */
.gv-controls {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  pointer-events: auto;
  z-index: 10;
}
.ctrl-btn {
  background: rgba(0, 20, 40, 0.6);
  border: 1px solid rgba(0, 170, 255, 0.3);
  color: #fff;
  padding: 8px 22px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
}
.ctrl-btn:hover {
  background: rgba(0, 170, 255, 0.2);
  box-shadow: 0 0 16px rgba(0, 170, 255, 0.4);
}
.ctrl-btn.active {
  background: rgba(0, 170, 255, 0.25);
  border-color: #00aaff;
  box-shadow: 0 0 24px rgba(0, 170, 255, 0.6) inset;
}

/* ── Hint ── */
.gv-hint {
  position: absolute;
  bottom: 72px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10.5px;
  color: var(--item_left_text_color);
  opacity: 0.38;
  pointer-events: none;
  white-space: nowrap;
  z-index: 10;
}

/* ── Footer ── */
.gv-footer {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: var(--item_left_text_color);
  opacity: 0.5;
}
.footer-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--accent, #38bdf8);
  animation: dot-pulse 2.4s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes dot-pulse { 0%,100%{opacity:1} 50%{opacity:0.25} }

/* ── Transitions ── */
.fade-leave-active { transition: opacity 0.5s; }
.fade-leave-to     { opacity: 0; }
</style>
