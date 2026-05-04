<template>
  <section class="animation-page">
    <div class="animation-header">
      <h1 class="page-title">动画展示</h1>
      <p class="page-subtitle">Three.js 与 D3.js 创意可视化实验</p>
    </div>

    <div class="animation-grid">
      <div class="animation-card">
        <div class="card-preview three-preview">
          <canvas id="three-canvas-1"></canvas>
        </div>
        <div class="card-info">
          <h2 class="card-title">粒子星空</h2>
          <p class="card-desc">基于 Three.js 的 3D 粒子系统，模拟星空流动效果</p>
          <div class="card-tags">
            <span>Three.js</span>
            <span>粒子系统</span>
            <span>WebGL</span>
          </div>
        </div>
      </div>

      <div class="animation-card">
        <div class="card-preview d3-preview">
          <div id="d3-chart-1" class="d3-container"></div>
        </div>
        <div class="card-info">
          <h2 class="card-title">数据可视化</h2>
          <p class="card-desc">使用 D3.js 绑定的交互式数据图表</p>
          <div class="card-tags">
            <span>D3.js</span>
            <span>SVG</span>
            <span>数据</span>
          </div>
        </div>
      </div>

      <div class="animation-card">
        <div class="card-preview three-preview">
          <canvas id="three-canvas-2"></canvas>
        </div>
        <div class="card-info">
          <h2 class="card-title">物理模拟</h2>
          <p class="card-desc">刚体物理引擎与碰撞检测演示</p>
          <div class="card-tags">
            <span>Three.js</span>
            <span>物理</span>
            <span>WebGL</span>
          </div>
        </div>
      </div>

      <div class="animation-card coming-soon">
        <div class="card-preview empty-preview">
          <div class="coming-soon-content">
            <span class="coming-icon">✦</span>
            <p>更多动画开发中...</p>
          </div>
        </div>
        <div class="card-info">
          <h2 class="card-title">敬请期待</h2>
          <p class="card-desc">Three.js 与 D3.js 的更多创意可视化实验</p>
          <div class="card-tags">
            <span>待更新</span>
          </div>
        </div>
      </div>
    </div>

    <div class="animation-note">
      <p>这些动画使用 Web 技术栈构建，展示了前端可视化的可能性。</p>
      <p>所有动画均运行在浏览器中，无需额外插件。</p>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

let animFrames = []
let animationIds = []

const initThreeCanvas1 = () => {
  const canvas = document.getElementById('three-canvas-1')
  if (!canvas) return

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000)
  camera.position.z = 5

  const geometry = new THREE.BufferGeometry()
  const count = 2000
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 12
    positions[i + 1] = (Math.random() - 0.5) * 12
    positions[i + 2] = (Math.random() - 0.5) * 12
    const r = Math.random()
    const g = Math.random()
    const b = Math.random()
    colors[i] = r
    colors[i + 1] = g
    colors[i + 2] = b
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({ size: 0.04, vertexColors: true, transparent: true, opacity: 0.85 })
  const points = new THREE.Points(geometry, material)
  scene.add(points)

  const handleResize = () => {
    if (!canvas) return
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  window.addEventListener('resize', handleResize)
  animFrames.push(() => window.removeEventListener('resize', handleResize))

  const animate = () => {
    const id = requestAnimationFrame(animate)
    animationIds.push(id)
    points.rotation.y += 0.0008
    points.rotation.x += 0.0003
    renderer.render(scene, camera)
  }

  animate()
}

const initThreeCanvas2 = () => {
  const canvas = document.getElementById('three-canvas-2')
  if (!canvas) return

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000)
  camera.position.z = 8

  const group = new THREE.Group()
  scene.add(group)

  const sphereGeo = new THREE.SphereGeometry(0.4, 32, 32)
  const colors = [0x38bdf8, 0xbd34fe, 0xe0321b, 0x34d399, 0xf59e0b]
  const spheres = []

  for (let i = 0; i < 8; i++) {
    const color = colors[i % colors.length]
    const material = new THREE.MeshPhongMaterial({ color, transparent: true, opacity: 0.85 })
    const mesh = new THREE.Mesh(sphereGeo, material)
    mesh.position.set((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6)
    mesh.userData = {
      vx: (Math.random() - 0.5) * 0.02,
      vy: (Math.random() - 0.5) * 0.02,
      vz: (Math.random() - 0.5) * 0.02,
    }
    group.add(mesh)
    spheres.push(mesh)
  }

  const handleResize = () => {
    if (!canvas) return
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  window.addEventListener('resize', handleResize)
  animFrames.push(() => window.removeEventListener('resize', handleResize))

  const animate = () => {
    const id = requestAnimationFrame(animate)
    animationIds.push(id)

    spheres.forEach(s => {
      s.position.x += s.userData.vx
      s.position.y += s.userData.vy
      s.position.z += s.userData.vz

      const b = 3
      if (Math.abs(s.position.x) > b) s.userData.vx *= -1
      if (Math.abs(s.position.y) > b) s.userData.vy *= -1
      if (Math.abs(s.position.z) > b) s.userData.vz *= -1
    })

    group.rotation.y += 0.004
    renderer.render(scene, camera)
  }

  animate()
}

const initD3Chart = () => {
  const container = document.getElementById('d3-chart-1')
  if (!container) return

  const d3 = window._d3
  if (!d3) return

  const w = container.offsetWidth
  const h = container.offsetHeight || 200
  const svg = d3.select(container).append('svg').attr('width', w).attr('height', h)

  const data = [
    { label: 'Vue', value: 42 },
    { label: 'JS', value: 35 },
    { label: 'CSS', value: 28 },
    { label: 'Python', value: 22 },
    { label: 'C++', value: 18 },
    { label: 'Other', value: 15 },
  ]

  const maxVal = d3.max(data, d => d.value)
  const barH = 28
  const gap = 10
  const startY = 10

  svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', 0)
    .attr('y', (_, i) => startY + i * (barH + gap))
    .attr('height', barH)
    .attr('rx', 8)
    .attr('fill', 'rgba(56, 189, 248, 0.7)')
    .attr('width', 0)
    .transition()
    .duration(1000)
    .delay((_, i) => i * 120)
    .attr('width', d => (d.value / maxVal) * (w - 80))

  svg.selectAll('text.label')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'label')
    .attr('x', 4)
    .attr('y', (_, i) => startY + i * (barH + gap) + barH / 2 + 5)
    .attr('fill', '#0f172a')
    .attr('font-size', '13px')
    .attr('font-weight', '600')
    .text(d => d.label)

  svg.selectAll('text.value')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'value')
    .attr('x', w - 6)
    .attr('y', (_, i) => startY + i * (barH + gap) + barH / 2 + 5)
    .attr('text-anchor', 'end')
    .attr('fill', '#64748b')
    .attr('font-size', '12px')
    .text(d => d.value)
}

onMounted(async () => {
  initThreeCanvas1()
  initThreeCanvas2()

  try {
    const d3 = await import('d3')
    window._d3 = d3
    initD3Chart()
  } catch (e) {
    console.warn('D3 not loaded:', e)
  }
})

onBeforeUnmount(() => {
  animationIds.forEach(id => cancelAnimationFrame(id))
  animFrames.forEach(fn => fn())
})
</script>

<style scoped>
.animation-page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 16px 60px;
}

.animation-header {
  text-align: center;
  padding: 40px 0 36px;
}

.page-title {
  font-size: 2.4rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
  background: linear-gradient(120deg, #bd34fe, #e0321b 30%, #41d1ff 60%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  color: #64748b;
  font-size: 1rem;
}

.animation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.animation-card {
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.animation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.14);
}

.card-preview {
  width: 100%;
  height: 220px;
  position: relative;
  overflow: hidden;
}

.three-preview canvas,
.d3-preview canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}

.d3-container {
  width: 100%;
  height: 100%;
  padding: 12px 8px;
}

.empty-preview {
  background: linear-gradient(135deg, rgba(14, 116, 144, 0.08), rgba(56, 189, 248, 0.05));
  display: flex;
  align-items: center;
  justify-content: center;
}

.coming-soon-content {
  text-align: center;
  color: #94a3b8;
}

.coming-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 8px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.card-info {
  padding: 20px 22px;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
}

.card-desc {
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 12px;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.card-tags span {
  background: rgba(56, 189, 248, 0.12);
  color: #0369a1;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.animation-note {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 14px;
  padding: 20px 24px;
  text-align: center;
}

.animation-note p {
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.7;
}

.animation-note p + p {
  margin-top: 6px;
}

@media (max-width: 640px) {
  .animation-header {
    padding: 24px 0 20px;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .animation-grid {
    grid-template-columns: 1fr;
  }
}
</style>
