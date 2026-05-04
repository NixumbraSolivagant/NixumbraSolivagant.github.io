<template>
  <section class="animation-page">
    <NavBar />
    <div class="anim-shell">
      <div class="anim-body">
        <div class="anim-hero">
          <div class="anim-hero-content">
            <div class="anim-title">动画展示</div>
            <p class="anim-subtitle">Three.js 与 Canvas 创意可视化实验 · 点击卡片可全屏观看</p>
          </div>
          <div class="anim-hero-card">
            <div class="hero-label">模块化动画</div>
            <div class="hero-desc">每个动画独立文件，Three.js / Canvas 渲染</div>
            <div class="hero-actions">
              <span class="hero-pill">Three.js</span>
              <span class="hero-pill">Canvas</span>
              <span class="hero-pill">WebGL</span>
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
                  全屏
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
              <button class="fs-close" @click="closeModal" aria-label="关闭">
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
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue'
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

// ── Animation registry ──────────────────────────────────────────────────────
const animations = [
  { id: 'nebula',       title: '星云粒子',   desc: '三维粒子系统，模拟宇宙星云的流动与色彩变幻',   tags: ['Three.js', '粒子系统', 'WebGL'] },
  { id: 'wave',         title: '波形动画',   desc: '正弦波叠加与贝塞尔曲线，演绎数学之美',         tags: ['Canvas', '数学', '动画'] },
  { id: 'matrix',       title: '矩阵数字雨', desc: '经典矩阵数字雨效果，重现赛博朋克美学',        tags: ['Canvas', '粒子', '经典'] },
  { id: 'balls',        title: '引力弹珠',   desc: '多球体弹性碰撞与反弹物理模拟',                tags: ['Three.js', '物理', '碰撞'] },
  { id: 'life',         title: '生命游戏',   desc: '康威生命游戏，元胞自动机的离散宇宙',            tags: ['Canvas', '元胞自动机', '模拟'] },
  { id: 'torus',        title: '3D 旋转环面', desc: '参数化曲面与光照着色，展现拓扑之美',         tags: ['Three.js', '3D', '数学曲面'] },
  { id: 'galaxy',       title: '粒子星系',   desc: '旋转星系结构，臂膀色彩随距离渐变',              tags: ['Three.js', '粒子', '星系'] },
  { id: 'firework',     title: '烟花绽放',   desc: '粒子烟花爆炸效果，随机色彩与物理衰减',         tags: ['Canvas', '粒子', '特效'] },
  { id: 'plasma',       title: '等离子波',   desc: '有机等离子流体，色彩随时间连续变化',           tags: ['Canvas', '色彩', '动态'] },
  { id: 'rubik',        title: '量子魔方',   desc: '悬浮的魔方体矩阵，随机量子运动',               tags: ['Three.js', '3D', '几何'] },
  { id: 'constellation', title: '星图连线',  desc: '星空连线与闪烁，随机漂移的星座图',             tags: ['Canvas', '星空', '连线'] },
  { id: 'tunnel',       title: '波形隧道',   desc: '无限延伸的波形隧道，穿越视觉错觉',             tags: ['Three.js', '3D', '透视'] },
]

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
  nebula, wave, matrix, balls, life, torus,
  galaxy: makeGalaxy, firework: makeFirework, plasma: makePlasma,
  rubik: makeRubik, constellation: makeConstellation, tunnel: makeTunnel,
}

// ── Mount & unmount ─────────────────────────────────────────────────────────
let THREE = null

onMounted(async () => {
  const three = await import('three')
  THREE = three
  window._THREE = three

  animations.forEach(anim => {
    const canvas = canvasRefs[anim.id]
    if (!canvas) return
    const init = () => {
      if (canvas.offsetWidth === 0 || canvas.offsetHeight === 0) return
      register(makers[anim.id](canvas))
    }
    if (canvas.offsetWidth > 0 && canvas.offsetHeight > 0) {
      init()
    } else {
      const mo = new MutationObserver(() => { init(); mo.disconnect() })
      mo.observe(canvas, { attributes: true, attributeFilter: ['style', 'class'] })
    }
  })
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

const closeModal = () => {
  cleanupAll()
  modal.visible = false
  animations.forEach(anim => {
    const canvas = canvasRefs[anim.id]
    if (canvas) register(makers[anim.id](canvas))
  })
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
