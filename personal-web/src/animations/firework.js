/**
 * Firework Burst — Explosive particle fireworks via Canvas 2D.
 */
export function makeFirework(canvas) {
  if (canvas.offsetWidth === 0 || canvas.offsetHeight === 0) return () => {}
  const ctx = canvas.getContext('2d')
  const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)

  const fireworks = []
  const particles = []

  const createFirework = () => {
    const x = Math.random() * canvas.width
    const y = canvas.height * (0.2 + Math.random() * 0.4)
    fireworks.push({ x, y, vy: -(5 + Math.random() * 5), hue: Math.random() * 360, alive: true })
  }

  const explode = (fw) => {
    const count = 80 + Math.floor(Math.random() * 60)
    const hue = fw.hue + (Math.random() - 0.5) * 40
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const speed = 1.5 + Math.random() * 4.5
      particles.push({
        x: fw.x, y: fw.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: 0.012 + Math.random() * 0.012,
        hue: hue + (Math.random() - 0.5) * 30,
        size: 1.5 + Math.random() * 2,
      })
    }
  }

  let id
  let lastShot = 0
  const step = (ts) => {
    id = requestAnimationFrame(step)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (ts - lastShot > 600 + Math.random() * 400) {
      createFirework()
      lastShot = ts
    }

    for (let i = fireworks.length - 1; i >= 0; i--) {
      const fw = fireworks[i]
      fw.y += fw.vy
      fw.vy += 0.12
      if (fw.vy >= 0) { explode(fw); fireworks.splice(i, 1) }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.x += p.vx; p.y += p.vy
      p.vy += 0.05; p.vx *= 0.98
      p.alpha -= p.decay
      if (p.alpha <= 0) { particles.splice(i, 1); continue }
      ctx.save()
      ctx.globalAlpha = p.alpha
      ctx.fillStyle = `hsl(${p.hue}, 90%, 65%)`
      ctx.shadowColor = `hsl(${p.hue}, 90%, 65%)`
      ctx.shadowBlur = 8
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }
  step(0)
  return () => { cancelAnimationFrame(id); ro.disconnect() }
}
