const defaultConfig = {
  G: 2000000,
  trailLength: 100,  // 减少轨迹长度
  bodyRadius: 16,
  enableTrails: true,
  maxVelocity: 500,
}

// 三角旋转（拉格朗日 L4/L5 点）
function getLagrangeTriangle(cx, cy, r, G) {
  const v = Math.sqrt(G / r) * 0.8
  return [
    { x: cx, y: cy - r, vx: v, vy: 0 },
    { x: cx - r * 0.866, y: cy + r * 0.5, vx: -v * 0.5, vy: -v * 0.866 },
    { x: cx + r * 0.866, y: cy + r * 0.5, vx: -v * 0.5, vy: v * 0.866 },
  ]
}

// 椭圆轨道
function getElliptical(cx, cy, r) {
  return [
    { x: cx - r, y: cy, vx: 0, vy: 2.5 },
    { x: cx + r, y: cy, vx: 0, vy: -2.5 },
    { x: cx, y: cy - r * 0.6, vx: 1.8, vy: 0 },
  ]
}

// 垂直振动
function getVertical(cx, cy, r) {
  return [
    { x: cx, y: cy - r, vx: 1.5, vy: 0 },
    { x: cx, y: cy + r, vx: -1.5, vy: 0 },
    { x: cx, y: cy, vx: 0, vy: 0 },
  ]
}

// 8字形
function getFigure8(cx, cy, r) {
  return [
    { x: cx - r, y: cy, vx: 0, vy: 1.8 },
    { x: cx + r, y: cy, vx: 0, vy: -1.8 },
    { x: cx, y: cy, vx: 0, vy: 0 },
  ]
}

const solutions = [
  { name: '三角旋转', init: getLagrangeTriangle },
  { name: '椭圆轨道', init: getElliptical },
  { name: '垂直振动', init: getVertical },
  { name: '8字形', init: getFigure8 },
]

export function useThreeBody(config = {}) {
  const cfg = { ...defaultConfig, ...config }

  let canvas, ctx
  let frameId = null
  let resizeHandler = null
  let isVisible = true
  let canvasObserver = null

  let bodies = []
  let trails = [[], [], []]
  let particles = []
  let explosions = []
  let currentSolution = 0

  const colors = [
    { r: 216, g: 160, b: 255 },
    { r: 255, g: 182, b: 193 },
    { r: 135, g: 206, b: 250 },
  ]

  let lastTime = 0
  let accumDt = 0

  function createBodies() {
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const r = Math.min(canvas.width, canvas.height) * 0.2

    const solution = solutions[currentSolution % solutions.length]
    const initialStates = solution.init(cx, cy, r, cfg.G)

    bodies = initialStates.map((state, i) => ({
      x: state.x,
      y: state.y,
      vx: state.vx,
      vy: state.vy,
      ax: 0,
      ay: 0,
      mass: 1,
      radius: cfg.bodyRadius,
      color: colors[i],
    }))

    trails = [[], [], []]
    currentSolution++
  }

  function createParticles() {
    particles = []
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.25 + 0.08,
      })
    }
  }

  // 创建爆炸效果
  function createExplosion(x, y) {
    const explosionParticles = []
    for (let i = 0; i < 30; i++) {  // 减少粒子数量
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 6 + 2
      const color = colors[Math.floor(Math.random() * colors.length)]
      explosionParticles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        alpha: 1,
        color: color,
        life: 1,
      })
    }

    explosions.push({
      particles: explosionParticles,
      age: 0,
      maxAge: 1.0,  // 减少持续时间
    })
  }

  function computeAcceleration(body, allBodies) {
    let ax = 0, ay = 0
    const softening = 15

    for (const other of allBodies) {
      if (other === body) continue

      const dx = other.x - body.x
      const dy = other.y - body.y
      const distSq = dx * dx + dy * dy + softening * softening
      const dist = Math.sqrt(distSq)

      const force = cfg.G / distSq
      ax += (dx / dist) * force
      ay += (dy / dist) * force
    }

    return { ax, ay }
  }

  function updatePhysics(dt) {
    dt = Math.min(dt, 0.025)

    // 计算当前加速度
    for (const body of bodies) {
      const acc = computeAcceleration(body, bodies)
      body.ax = acc.ax
      body.ay = acc.ay
    }

    // 更新位置
    for (const body of bodies) {
      body.x += body.vx * dt + 0.5 * body.ax * dt * dt
      body.y += body.vy * dt + 0.5 * body.ay * dt * dt
    }

    // 计算新加速度
    const newAcc = bodies.map(body => computeAcceleration(body, bodies))

    // 更新速度
    for (let i = 0; i < bodies.length; i++) {
      bodies[i].vx += 0.5 * (bodies[i].ax + newAcc[i].ax) * dt
      bodies[i].vy += 0.5 * (bodies[i].ay + newAcc[i].ay) * dt

      const speed = Math.sqrt(bodies[i].vx ** 2 + bodies[i].vy ** 2)
      if (speed > cfg.maxVelocity) {
        bodies[i].vx = (bodies[i].vx / speed) * cfg.maxVelocity
        bodies[i].vy = (bodies[i].vy / speed) * cfg.maxVelocity
      }
    }

    // 碰撞检测
    let collision = false
    let collisionX = 0, collisionY = 0

    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const dx = bodies[j].x - bodies[i].x
        const dy = bodies[j].y - bodies[i].y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < bodies[i].radius + bodies[j].radius) {
          collision = true
          collisionX = (bodies[i].x + bodies[j].x) / 2
          collisionY = (bodies[i].y + bodies[j].y) / 2
          break
        }
      }
      if (collision) break
    }

    if (collision) {
      createExplosion(collisionX, collisionY)
      createBodies()
      return
    }

    // 边界检测
    const margin = 50
    for (const body of bodies) {
      if (body.x < -margin || body.x > canvas.width + margin ||
          body.y < -margin || body.y > canvas.height + margin) {
        createExplosion(body.x, body.y)
        createBodies()
        return
      }
    }
  }

  function updateTrails() {
    if (!cfg.enableTrails) return
    for (let i = 0; i < bodies.length; i++) {
      trails[i].push({ x: bodies[i].x, y: bodies[i].y })
      if (trails[i].length > cfg.trailLength) {
        trails[i].shift()
      }
    }
  }

  function updateExplosions(dt) {
    for (let i = explosions.length - 1; i >= 0; i--) {
      const exp = explosions[i]
      exp.age += dt

      if (exp.age >= exp.maxAge) {
        explosions.splice(i, 1)
        continue
      }

      for (const p of exp.particles) {
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.96
        p.vy *= 0.96
        p.life -= dt / exp.maxAge
        p.alpha = p.life
        p.size *= 0.98
      }
    }
  }

  function drawParticles() {
    for (const p of particles) {
      ctx.fillStyle = `rgba(200, 220, 255, ${p.alpha})`
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  function drawTrails() {
    if (!cfg.enableTrails) return
    for (let i = 0; i < trails.length; i++) {
      const trail = trails[i]
      const color = bodies[i].color
      if (trail.length < 2) continue

      // 优化：减少绘制点数，每隔一点画一次
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.beginPath()

      for (let j = 0; j < trail.length; j++) {
        const alpha = (j / trail.length) * 0.4
        ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`
        if (j > 0) {
          ctx.lineWidth = 1 + (j / trail.length) * 2
          ctx.beginPath()
          ctx.moveTo(trail[j - 1].x, trail[j - 1].y)
          ctx.lineTo(trail[j].x, trail[j].y)
          ctx.stroke()
        }
      }
    }
  }

  function drawExplosions() {
    for (const exp of explosions) {
      for (const p of exp.particles) {
        if (p.alpha <= 0) continue

        const glowGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
        glowGradient.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha})`)
        glowGradient.addColorStop(0.5, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha * 0.5})`)
        glowGradient.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`)

        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  function drawBodies() {
    const sorted = [...bodies].sort((a, b) => a.y - b.y)
    for (const body of sorted) {
      const { x, y, radius, color } = body

      // 简化发光效果：使用单一渐变而不是多层
      const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 3)
      glowGradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.6)`)
      glowGradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`)

      ctx.fillStyle = glowGradient
      ctx.beginPath()
      ctx.arc(x, y, radius * 3, 0, Math.PI * 2)
      ctx.fill()

      // 简化球体
      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()

      // 高光
      const highlightGradient = ctx.createRadialGradient(
        x - radius * 0.3, y - radius * 0.3, 0, x, y, radius
      )
      highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
      highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)')
      highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

      ctx.fillStyle = highlightGradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawParticles()
    drawTrails()
    drawExplosions()
    drawBodies()
  }

  const start = (c) => {
    canvas = c
    ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    resizeHandler = resize
    window.addEventListener('resize', resize)

    createBodies()
    createParticles()

    lastTime = performance.now()

    const animate = () => {
      frameId = requestAnimationFrame(animate)

      if (!isVisible) {
        lastTime = performance.now()
        return
      }

      const now = performance.now()
      const dt = (now - lastTime) / 1000
      lastTime = now

      accumDt += dt
      const step = 1 / 60
      while (accumDt >= step) {
        updatePhysics(step)
        updateTrails()
        accumDt -= step
      }
      updateExplosions(dt)
      render()
    }

    // Pause when canvas leaves viewport (tab switch / scroll away)
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting
    }, { threshold: 0.05 })
    canvasObserver = observer
    observer.observe(canvas)

    animate()
  }

  const stop = () => {
    if (frameId !== null) {
      cancelAnimationFrame(frameId)
      frameId = null
    }
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler)
      resizeHandler = null
    }
    if (canvasObserver) {
      canvasObserver.disconnect()
      canvasObserver = null
    }
    bodies = []
    trails = [[], [], []]
    particles = []
    explosions = []
    accumDt = 0
  }

  return { start, stop }
}
