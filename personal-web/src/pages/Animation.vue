<template>
  <section class="animation-page">
    <NavBar />
    <div class="anim-shell">
      <div class="anim-body">
        <div class="anim-hero">
          <div class="anim-hero-content">
            <div class="anim-title">{{ t('animation.heroTitle') }}</div>
            <p class="anim-subtitle">{{ t('animation.heroSubtitle') }}</p>
          </div>
          <div class="anim-hero-card">
            <div class="hero-label">{{ t('animation.heroLabel') }}</div>
            <div class="hero-desc">{{ t('animation.heroDesc') }}</div>
            <div class="hero-actions">
              <span class="hero-pill">{{ t('animation.heroTechThree') }}</span>
              <span class="hero-pill">{{ t('animation.heroTechCanvas') }}</span>
              <span class="hero-pill">{{ t('animation.heroTechWebgl') }}</span>
            </div>
          </div>
        </div>

        <div class="anim-grid-wrapper">
          <div class="animation-grid">
            <div
              v-for="anim in animations"
              :key="anim.id"
              class="animation-card"
              @click="openFullscreen(anim)"
            >
              <div class="card-preview">
                <canvas :ref="el => setCanvasRef(anim.id, el)" class="anim-canvas"></canvas>
                <div class="card-expand-hint">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M15 3h6m0 0v6m0-6l-7 7M9 21H3m0 0v-6m0 6l7-7"/>
                  </svg>
                  {{ t('animation.cardFullscreen') }}
                </div>
              </div>
              <div class="card-info">
                <h2 class="card-title">{{ anim.title }}</h2>
                <p class="card-desc">{{ anim.desc }}</p>
                <div class="card-tags">
                  <span v-for="tag in anim.tags" :key="tag">{{ tag }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fullscreen Modal -->
    <Teleport to="body">
      <Transition name="modal-anim">
        <div v-if="modal.visible" class="fs-overlay" @click.self="closeModal">
          <div class="fs-box">
            <div class="fs-header">
              <div class="fs-title-group">
                <span class="fs-title">{{ modal.title }}</span>
                <span class="fs-subtitle">{{ modal.desc }}</span>
              </div>
              <button class="fs-close" @click="closeModal" :aria-label="t('animation.modalClose')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="fs-body">
              <canvas ref="modalCanvasRef" class="fs-canvas"></canvas>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import NavBar from '@/components/NavBar.vue'
import { makeNebula } from '@/animations/nebula.js'
import { makeWave } from '@/animations/wave.js'
import { makeMatrix } from '@/animations/matrix.js'
import { makeBalls } from '@/animations/balls.js'
import { makeLife } from '@/animations/life.js'
import { makeTorus } from '@/animations/torus.js'
import { makeGalaxy } from '@/animations/galaxy.js'
import { makeFirework } from '@/animations/firework.js'
import { makePlasma } from '@/animations/plasma.js'
import { makeRubik } from '@/animations/rubik.js'
import { makeConstellation } from '@/animations/constellation.js'
import { makeTunnel } from '@/animations/tunnel.js'

const { t } = useI18n()

// ── Animation registry — IDs only, text is resolved via computed ─────────────
const ANIM_IDS = [
  'nebula', 'wave', 'matrix', 'balls', 'life',
  'torus', 'galaxy', 'firework', 'plasma', 'rubik',
  'constellation', 'tunnel',
]

// map: animId -> keys in locale files
const ANIM_KEYS = {
  nebula:        { title: 'animation.animNebulaTitle',     desc: 'animation.animNebulaDesc',     tags: 'animation.animNebulaTags'     },
  wave:          { title: 'animation.animWaveTitle',       desc: 'animation.animWaveDesc',       tags: 'animation.animWaveTags'       },
  matrix:        { title: 'animation.animMatrixTitle',      desc: 'animation.animMatrixDesc',     tags: 'animation.animMatrixTags'     },
  balls:         { title: 'animation.animBallsTitle',      desc: 'animation.animBallsDesc',      tags: 'animation.animBallsTags'      },
  life:          { title: 'animation.animLifeTitle',       desc: 'animation.animLifeDesc',       tags: 'animation.animLifeTags'       },
  torus:         { title: 'animation.animTorusTitle',     desc: 'animation.animTorusDesc',      tags: 'animation.animTorusTags'     },
  galaxy:        { title: 'animation.animGalaxyTitle',      desc: 'animation.animGalaxyDesc',     tags: 'animation.animGalaxyTags'     },
  firework:      { title: 'animation.animFireworkTitle',   desc: 'animation.animFireworkDesc',   tags: 'animation.animFireworkTags'   },
  plasma:        { title: 'animation.animPlasmaTitle',      desc: 'animation.animPlasmaDesc',     tags: 'animation.animPlasmaTags'     },
  rubik:         { title: 'animation.animRubikTitle',      desc: 'animation.animRubikDesc',      tags: 'animation.animRubikTags'      },
  constellation: { title: 'animation.animConstellationTitle', desc: 'animation.animConstellationDesc', tags: 'animation.animConstellationTags' },
  tunnel:        { title: 'animation.animTunnelTitle',     desc: 'animation.animTunnelDesc',     tags: 'animation.animTunnelTags'     },
}

// Reactive animations list — re-computes when locale changes
const animations = computed(() =>
  ANIM_IDS.map(id => {
    const k = ANIM_KEYS[id]
    return {
      id,
      title:  t(k.title),
      desc:   t(k.desc),
      tags:   t(k.tags).split(','),
    }
  })
)

// ── Canvas refs ─────────────────────────────────────────────────────────────
const canvasRefs = reactive({})
const setCanvasRef = (id, el) => { if (el) canvasRefs[id] = el }
const modalCanvasRef = ref(null)

// ── Cleanup registry ─────────────────────────────────────────────────────────
const registry = []
const register = (cleanup) => { registry.push(cleanup); return cleanup }
const cleanupAll = () => { registry.forEach(fn => fn()); registry.length = 0 }

// ── Animation map ───────────────────────────────────────────────────────────
const makers = {
  nebula:        makeNebula,
  wave:          makeWave,
  matrix:        makeMatrix,
  balls:         makeBalls,
  life:          makeLife,
  torus:         makeTorus,
  galaxy:        makeGalaxy,
  firework:      makeFirework,
  plasma:        makePlasma,
  rubik:         makeRubik,
  constellation: makeConstellation,
  tunnel:        makeTunnel,
}

// ── Mount & unmount ─────────────────────────────────────────────────────────
let THREEloaded = false
let THREE = null

const initAnimations = () => {
  if (!THREE) return
  animations.value.forEach(anim => {
    const canvas = canvasRefs[anim.id]
    if (!canvas) return

    const init = () => {
      if (canvas.offsetWidth === 0 || canvas.offsetHeight === 0) return
      try {
        register(makers[anim.id](canvas))
      } catch (e) {
        console.error(`[Animation] init failed for "${anim.id}":`, e)
      }
    }

    // Lazy-init: only when card scrolls into view
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        init()
        io.disconnect()
      }
    }, { rootMargin: '100px' })
    io.observe(canvas)
  })
}

onMounted(async () => {
  THREE = await import('three')
  THREEloaded = true
  window._THREE = THREE
  // Refs aren't populated until after first render, so defer
  await nextTick()
  initAnimations()
})

onBeforeUnmount(cleanupAll)

// ── Fullscreen modal ────────────────────────────────────────────────────────
const modal = reactive({ visible: false, title: '', desc: '', animId: '' })

const openFullscreen = async (anim) => {
  cleanupAll()
  modal.visible = true
  modal.title = anim.title
  modal.desc = anim.desc
  modal.animId = anim.id
  await nextTick()
  setTimeout(() => {
    const canvas = modalCanvasRef.value
    if (!canvas) return
    register(makers[anim.id](canvas))
  }, 50)
}

const closeModal = async () => {
  cleanupAll()
  modal.visible = false
  await nextTick()
  await nextTick()
  initAnimations()
}
</script>

<style scoped>
.animation-page {
  font-family: "Source Han Sans SC", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
  color: var(--main_text_color);
  background: transparent;
  min-height: 100vh;
}

.anim-shell {
  padding: 0 0 88px;
}

.anim-body {
  padding: 0 16px;
}

/* ── Hero section ── */
.anim-hero {
  max-width: 1400px;
  margin: 0 auto 28px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 26px;
}

.anim-hero-content {
  background: var(--item_bg_color);
  border-radius: 20px;
  padding: 36px;
  box-shadow: 0 26px 60px rgba(15, 23, 42, 0.2);
  color: var(--main_text_color);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--card_stroke_color);
}

.anim-hero-content::after {
  content: "";
  position: absolute;
  inset: -45% -30% auto auto;
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, var(--accent), transparent 65%);
  pointer-events: none;
  opacity: 0.5;
}

.anim-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.anim-subtitle {
  color: var(--item_left_text_color);
  opacity: 0.8;
  margin-bottom: 20px;
}

.anim-hero-card {
  background: var(--item_bg_color);
  border-radius: 18px;
  padding: 26px;
  border: 1px solid var(--card_stroke_color);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.16);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hero-label {
  font-weight: 600;
  color: var(--main_text_color);
  margin-bottom: 6px;
}

.hero-desc {
  color: var(--item_left_text_color);
  font-size: 0.95rem;
  margin-bottom: 16px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hero-pill {
  background: var(--item_hover_color);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  color: var(--main_text_color);
  border: 1px solid var(--card_stroke_color);
}

/* ── Grid ── */
.anim-grid-wrapper {
  max-width: 1400px;
  margin: 0 auto;
}

.animation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}

.animation-card {
  background: var(--item_bg_color);
  border: 1px solid var(--card_stroke_color);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.07);
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.2s ease;
  cursor: pointer;
}

.animation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.14);
  border-color: var(--accent);
}

.card-preview {
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
  background: var(--item_hover_color);
}

.anim-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.card-expand-hint {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 5px 10px;
  font-size: 0.72rem;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.animation-card:hover .card-expand-hint {
  opacity: 1;
}

.card-info {
  padding: 16px 18px;
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--main_text_color);
  margin-bottom: 4px;
}

.card-desc {
  font-size: 0.8rem;
  color: var(--item_left_text_color);
  line-height: 1.5;
  margin-bottom: 9px;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.card-tags span {
  background: var(--item_hover_color);
  color: var(--accent_strong);
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  border: 1px solid var(--card_stroke_color);
}

/* ── Fullscreen modal ── */
.fs-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.fs-box {
  background: var(--item_bg_color);
  border: 1px solid var(--card_stroke_color);
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.5);
  width: min(90vw, 1100px);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.fs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid var(--card_stroke_color);
  flex-shrink: 0;
}

.fs-title-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.fs-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--main_text_color);
}

.fs-subtitle {
  font-size: 0.8rem;
  color: var(--item_left_text_color);
  opacity: 0.65;
}

.fs-close {
  background: var(--item_hover_color);
  border: 1px solid var(--card_stroke_color);
  border-radius: 10px;
  color: var(--item_left_text_color);
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.fs-close:hover {
  background: var(--accent);
  color: var(--main_text_color);
  border-color: transparent;
}

.fs-body {
  flex: 1;
  overflow: hidden;
  background: var(--item_hover_color);
}

.fs-canvas {
  width: 100%;
  height: 65vh;
  max-height: 600px;
  display: block;
}

/* Modal transitions */
.modal-anim-enter-active,
.modal-anim-leave-active {
  transition: opacity 0.28s ease;
}
.modal-anim-enter-from,
.modal-anim-leave-to {
  opacity: 0;
}
.modal-anim-enter-active .fs-box,
.modal-anim-leave-active .fs-box {
  transition: transform 0.28s ease, opacity 0.28s ease;
}
.modal-anim-enter-from .fs-box {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}
.modal-anim-leave-to .fs-box {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .anim-hero {
    grid-template-columns: 1fr;
  }
  .anim-hero-card {
    order: -1;
  }
  .nav-inner {
    flex-wrap: wrap;
    justify-content: center;
  }
  .nav-links {
    order: 3;
    flex-wrap: wrap;
  }
}

@media (max-width: 640px) {
  .anim-shell {
    padding: 0 0 40px;
  }

  .nav-inner {
    gap: 10px;
    padding: 12px 12px;
  }

  .anim-body {
    padding: 0 12px;
  }

  .nav-links {
    gap: 12px;
  }

  .anim-hero-content {
    padding: 22px;
  }

  .animation-grid {
    grid-template-columns: 1fr;
  }

  .fs-overlay {
    padding: 12px;
    align-items: flex-end;
  }

  .fs-box {
    border-radius: 18px 18px 0 0;
    width: 100%;
    max-height: 80vh;
  }

  .fs-canvas {
    height: 50vh;
  }
}
</style>
