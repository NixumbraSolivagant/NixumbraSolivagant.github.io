/**
 * Particle Life — Emergent universe simulation with asymmetric interaction matrix,
 * spatial hashing, quantum fluctuation, and topological wrapping.
 *
 * Physics model:
 *   - 4 particle types (Psi1–Psi4)
 *   - Asymmetric 4×4 interaction matrix M[i][j]
 *   - Spatial hash grid → O(N) per frame (handles 50k+ particles on CPU)
 *   - Quantum fluctuation: particles spontaneously nucleate from vacuum
 *   - Topological toroidal wrapping (Pac-Man edges)
 *   - Friction/dissipation: energy drains → structures emerge
 *
 * @param {HTMLCanvasElement} canvas
 * @returns {() => void} cleanup
 */
export function makeParticleLife(canvas) {
  if (canvas.offsetWidth === 0 || canvas.offsetHeight === 0) return () => {}

  const ctx = canvas.getContext('2d')

  // ── Config ──────────────────────────────────────────────────────────────────
  const CFG = {
    R_MAX:         65,      // max interaction radius (pixels)
    R_MIN:          8,      // hard-core repulsion radius
    R_MID:          0,      // computed below
    FRICTION:     0.045,    // velocity damping per frame (4.5 %)
    MAX_SPEED:      5,      // clamp to prevent blow-up
    SPAWN_RATE:   0.025,    // probability per pixel per frame to nucleate a pair
    SPAWN_PAIRS:     3,     // particle pairs spawned per nucleation event
    TARGET_PX:    12000,    // target particle count for "dense" universe
    COLORS: [
      '#ff4d6d',  // Psi1 — warm rose (attraction)
      '#4cc9f0',  // Psi2 — electric cyan (repulsion)
      '#43e97b',  // Psi3 — emerald (asymmetric)
      '#ffd60a',  // Psi4 — golden (catalytic)
    ],
    GLOW: [
      'rgba(255,77,109,0.55)',
      'rgba(76,201,240,0.55)',
      'rgba(67,233,123,0.55)',
      'rgba(255,214,10,0.55)',
    ],
  }
  CFG.R_MID = (CFG.R_MAX + CFG.R_MIN) / 2
  const R_MAX2 = CFG.R_MAX * CFG.R_MAX

  // ── Interaction Matrix (the "Laws of Physics") ────────────────────────────────
  // M[i][j] = force that type-i exerts on type-j
  //  value range: -1 (strong repulsion) … +1 (strong attraction)
  let M = new Array(4)
  function randomizeMatrix() {
    M = Array.from({ length: 4 }, (_, i) =>
      Float32Array.from({ length: 4 }, (_, j) => {
        if (i === j) return -(0.5 + Math.random() * 0.4) // self-repulsion
        const v = (Math.random() - 0.5) * 2.0
        return Math.max(-1, Math.min(1, v))
      })
    )
  }
  randomizeMatrix()

  // ── Particle pool ─────────────────────────────────────────────────────────────
  let px   = new Float32Array(60000)
  let py   = new Float32Array(60000)
  let pvx  = new Float32Array(60000)
  let pvy  = new Float32Array(60000)
  let pfx  = new Float32Array(60000)
  let pfy  = new Float32Array(60000)
  let ptype= new Uint8Array(60000)
  let pcount = 0

  function addParticle(x, y, vx, vy, t) {
    if (pcount >= px.length) {
      const n  = px.length
      const n2 = n * 2
      const grow = (arr) => { const a = new Float32Array(n2); a.set(arr); return a }
      const growU = (arr) => { const a = new Uint8Array(n2); a.set(arr); return a }
      px.length = 0;   px   = grow(px)
      py.length = 0;   py   = grow(py)
      pvx.length = 0;  pvx  = grow(pvx)
      pvy.length = 0;  pvy  = grow(pvy)
      pfx.length = 0;  pfx  = grow(pfx)
      pfy.length = 0;  pfy  = grow(pfy)
      ptype.length = 0; ptype = growU(ptype)
    }
    const i = pcount++
    px[i] = x; py[i] = y; pvx[i] = vx; pvy[i] = vy; ptype[i] = t
  }

  // Seed with random initial distribution
  function seedRandom(W, H, n) {
    for (let k = 0; k < n; k++) {
      addParticle(Math.random() * W, Math.random() * H,
                  (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2,
                  Math.floor(Math.random() * 4))
    }
  }

  // ── Spatial Hash Grid ────────────────────────────────────────────────────────
  // Cell size = R_MAX → each particle only checks its 3×3 neighbourhood
  let CELL = CFG.R_MAX
  let GRID_W = 0, GRID_H = 0
  let grid = [] // flat array of arrays

  function buildGrid(W, H) {
    GRID_W = Math.ceil(W / CELL) + 1
    GRID_H = Math.ceil(H / CELL) + 1
    grid = new Array(GRID_W * GRID_H)
    for (let i = 0; i < grid.length; i++) grid[i] = []

    for (let i = 0; i < pcount; i++) {
      const cx = Math.min(GRID_W - 1, Math.floor(px[i] / CELL))
      const cy = Math.min(GRID_H - 1, Math.floor(py[i] / CELL))
      if (grid[cy * GRID_W + cx]) grid[cy * GRID_W + cx].push(i)
    }
  }

  // ── Physics step ─────────────────────────────────────────────────────────────
  let W = 0, H = 0
  let vacuumTemp = 0.30  // 0 = no spawns, 1 = explosive

  function step() {
    if (W === 0 || H === 0) return

    // Reset forces
    pfx.fill(0)
    pfy.fill(0)

    // Rebuild spatial grid
    buildGrid(W, H)

    // Compute pairwise forces within 3×3 neighbourhood
    const R_MIN = CFG.R_MIN
    const R_MID = CFG.R_MID
    const R_MAX2_local = CFG.R_MAX * CFG.R_MAX

    for (let i = 0; i < pcount; i++) {
      const cxi = Math.floor(px[i] / CELL)
      const cyi = Math.floor(py[i] / CELL)

      // Check 3×3 neighbourhood
      for (let dyx = -1; dyx <= 1; dyx++) {
        const cy2 = cyi + dyx
        if (cy2 < 0 || cy2 >= GRID_H) continue
        for (let dxx = -1; dxx <= 1; dxx++) {
          const cx2 = cxi + dxx
          if (cx2 < 0 || cx2 >= GRID_W) continue
          const cell = grid[cy2 * GRID_W + cx2]
          if (!cell) continue

          for (let k = 0; k < cell.length; k++) {
            const j = cell[k]
            if (j === i) continue

            let dx = px[j] - px[i]
            let dy = py[j] - py[i]

            // Topological wrapping — shortest distance on torus
            if (dx >  W * 0.5) dx -= W
            else if (dx < -W * 0.5) dx += W
            if (dy >  H * 0.5) dy -= H
            else if (dy < -H * 0.5) dy += H

            const r2 = dx * dx + dy * dy
            if (r2 >= R_MAX2_local || r2 === 0) continue

            const r = Math.sqrt(r2)
            const dxn = dx / r, dyn = dy / r
            let F = 0

            if (r < R_MIN) {
              // Hard-core repulsion
              F = (r / R_MIN) - 1.0
            } else {
              // Smooth bell-shaped force from interaction matrix
              const coeff = M[ptype[i]][ptype[j]]
              const denom = R_MID - R_MIN
              F = coeff * (1.0 - Math.abs(r - R_MID) / denom)
            }

            pfx[i] += F * dxn
            pfy[i] += dyn * F
          }
        }
      }
    }

    // Update velocities + positions, apply friction
    const fric = 1.0 - CFG.FRICTION
    for (let i = 0; i < pcount; i++) {
      pvx[i] = (pvx[i] + pfx[i]) * fric
      pvy[i] = (pvy[i] + pfy[i]) * fric

      // Speed clamp
      const spd = Math.sqrt(pvx[i] * pvx[i] + pvy[i] * pvy[i])
      if (spd > CFG.MAX_SPEED) {
        const inv = CFG.MAX_SPEED / spd
        pvx[i] *= inv; pvy[i] *= inv
      }

      px[i] = (px[i] + pvx[i] + W) % W
      py[i] = (py[i] + pvy[i] + H) % H
    }

    // ── Quantum fluctuation: spontaneous nucleation from vacuum ─────────────────
    if (vacuumTemp > 0.001) {
      // Nucleation probability per candidate spawn point
      const spawnProb = vacuumTemp * CFG.SPAWN_RATE
      const candidates = CFG.SPAWN_PAIRS
      // Try several random nucleation sites per frame
      const attempts = Math.min(12, Math.ceil(vacuumTemp * 6))
      for (let a = 0; a < attempts; a++) {
        if (Math.random() >= spawnProb * 20) continue
        const nx = Math.random() * W
        const ny = Math.random() * H
        for (let s = 0; s < candidates; s++) {
          const t = Math.floor(Math.random() * 4)
          const angle = Math.random() * Math.PI * 2
          const speed = Math.random() * 1.5
          addParticle(
            nx + (Math.random() - 0.5) * 20,
            ny + (Math.random() - 0.5) * 20,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            t
          )
        }
      }
    }

    // ── Cap particle count to prevent runaway explosion ────────────────────────
    const target = CFG.TARGET_PX
    if (pcount > target) {
      // Remove random excess particles (keep first half, then randomly cull excess)
      const excess = pcount - target
      for (let i = 0; i < excess; i++) {
        const ridx = target + Math.floor(Math.random() * (pcount - target))
        // Swap-remove with last valid
        const last = pcount - 1
        if (ridx !== last) {
          px[ridx] = px[last]; py[ridx] = py[last]
          pvx[ridx] = pvx[last]; pvy[ridx] = pvy[last]
          pfx[ridx] = pfx[last]; pfy[ridx] = pfy[last]
          ptype[ridx] = ptype[last]
        }
        pcount--
      }
    }
  }

  // ── Rendering ────────────────────────────────────────────────────────────────
  function draw() {
    ctx.fillStyle = '#03040e'
    ctx.fillRect(0, 0, W, H)

    const COLORS = CFG.COLORS
    const GLOW   = CFG.GLOW

    for (let i = 0; i < pcount; i++) {
      const t = ptype[i]
      const x = px[i], y = py[i]
      const r = 2.5

      // Glow halo
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r * 4.5)
      grad.addColorStop(0, GLOW[t])
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(x, y, r * 4.5, 0, Math.PI * 2)
      ctx.fill()

      // Core dot
      ctx.fillStyle = COLORS[t]
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    // HUD: particle count + matrix indicator
    ctx.fillStyle = 'rgba(255,255,255,0.25)'
    ctx.font = '11px monospace'
    ctx.fillText(`particles: ${pcount}  |  types: 4  |  matrix: M[i][j]  |  vacuum: ${(vacuumTemp * 100).toFixed(0)}%`, 10, H - 10)
  }

  // ── Resize ───────────────────────────────────────────────────────────────────
  function resize() {
    W = canvas.offsetWidth
    H = canvas.offsetHeight
    canvas.width  = W
    canvas.height = H
    if (pcount === 0) seedRandom(W, H, 4000)
  }
  resize()

  const ro = new ResizeObserver(() => {
    resize()
    buildGrid(W, H)
  })
  ro.observe(canvas)

  // ── Controls UI (injected outside canvas) ───────────────────────────────────
  const wrap = document.createElement('div')
  wrap.style.cssText = `
    position: absolute; inset: 0; pointer-events: none;
    font-family: 'SF Mono', 'Fira Code', monospace;
  `
  canvas.parentElement.style.position = 'relative'
  canvas.parentElement.appendChild(wrap)

  const panel = document.createElement('div')
  panel.style.cssText = `
    position: absolute; top: 12px; right: 12px;
    background: rgba(3,4,14,0.75);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px; padding: 12px 14px;
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    display: flex; flex-direction: column; gap: 10px;
    pointer-events: auto; min-width: 190px;
  `
  wrap.appendChild(panel)

  // Reset button
  const btnReset = document.createElement('button')
  btnReset.textContent = '⟳ 重置物理法则'
  btnReset.style.cssText = `
    background: rgba(76,201,240,0.15); border: 1px solid rgba(76,201,240,0.4);
    color: #4cc9f0; padding: 7px 12px; border-radius: 7px;
    cursor: pointer; font-size: 11px; font-weight: 600;
    letter-spacing: 0.04em; transition: all 0.2s;
  `
  btnReset.onmouseover = () => {
    btnReset.style.background = 'rgba(76,201,240,0.3)'
    btnReset.style.boxShadow = '0 0 14px rgba(76,201,240,0.4)'
  }
  btnReset.onmouseout = () => {
    btnReset.style.background = 'rgba(76,201,240,0.15)'
    btnReset.style.boxShadow = 'none'
  }
  btnReset.onclick = () => {
    randomizeMatrix()
    // Scatter existing particles to break old patterns
    for (let i = 0; i < pcount; i++) {
      pvx[i] += (Math.random() - 0.5) * 3
      pvy[i] += (Math.random() - 0.5) * 3
    }
  }
  panel.appendChild(btnReset)

  // Vacuum temperature slider
  const vacRow = document.createElement('div')
  vacRow.style.cssText = `display:flex;flex-direction:column;gap:4px;`

  const vacLabel = document.createElement('label')
  vacLabel.textContent = `虚空涨落  ${(vacuumTemp * 100).toFixed(0)}%`
  vacLabel.style.cssText = `color:rgba(255,255,255,0.55);font-size:10px;letter-spacing:0.06em;`
  vacRow.appendChild(vacLabel)

  const vacSlider = document.createElement('input')
  vacSlider.type = 'range'
  vacSlider.min = '0'
  vacSlider.max = '100'
  vacSlider.value = Math.round(vacuumTemp * 100)
  vacSlider.style.cssText = `
    width: 100%; accent-color: #43e97b;
    cursor: pointer; height: 4px;
  `
  vacSlider.oninput = () => {
    vacuumTemp = vacSlider.value / 100
    vacLabel.textContent = `虚空涨落  ${vacSlider.value}%`
  }
  vacRow.appendChild(vacSlider)
  panel.appendChild(vacRow)

  // Type legend
  const legend = document.createElement('div')
  legend.style.cssText = `display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-top:2px;`
  const labels = ['凝聚', '活跃', '不对称', '催化']
  CFG.COLORS.forEach((c, i) => {
    const item = document.createElement('div')
    item.style.cssText = `display:flex;align-items:center;gap:5px;`
    const dot = document.createElement('span')
    dot.style.cssText = `width:7px;height:7px;border-radius:50%;background:${c};flex-shrink:0;box-shadow:0 0 5px ${c};`
    const txt = document.createElement('span')
    txt.textContent = labels[i]
    txt.style.cssText = `color:rgba(255,255,255,0.45);font-size:10px;`
    item.appendChild(dot)
    item.appendChild(txt)
    legend.appendChild(item)
  })
  panel.appendChild(legend)

  // ── Animation loop ────────────────────────────────────────────────────────────
  let id
  const loop = () => {
    id = requestAnimationFrame(loop)
    step()
    draw()
  }
  loop()

  return () => {
    cancelAnimationFrame(id)
    ro.disconnect()
    wrap.remove()
  }
}
