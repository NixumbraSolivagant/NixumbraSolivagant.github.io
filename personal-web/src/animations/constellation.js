/**
 * Constellation — Star field with connecting lines via Canvas 2D.
 */
export function makeConstellation(canvas) {
  if (canvas.offsetWidth === 0 || canvas.offsetHeight === 0) return () => {}
  const ctx = canvas.getContext('2d')
  const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)

  const count = 120
  const stars = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 0.5 + Math.random() * 2.5,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    twinkle: Math.random() * Math.PI * 2,
  }))

  let id
  const step = () => {
    id = requestAnimationFrame(step)
    const w = canvas.width, h = canvas.height
    ctx.fillStyle = 'rgba(2, 4, 16, 0.25)'
    ctx.fillRect(0, 0, w, h)

    stars.forEach(s => {
      s.x += s.vx; s.y += s.vy
      s.twinkle += 0.03
      if (s.x < 0) s.x = w; if (s.x > w) s.x = 0
      if (s.y < 0) s.y = h; if (s.y > h) s.y = 0
    })

    stars.forEach((a, i) => {
      stars.slice(i + 1).forEach(b => {
        const dx = a.x - b.x, dy = a.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 100) {
          const alpha = (1 - dist / 100) * 0.25
          ctx.strokeStyle = `rgba(130, 200, 255, ${alpha})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      })
    })

    stars.forEach(s => {
      const glow = 0.5 + Math.sin(s.twinkle) * 0.5
      ctx.save()
      ctx.shadowColor = '#82c8ff'
      ctx.shadowBlur = s.r * 3 * glow
      ctx.fillStyle = `rgba(200, 230, 255, ${0.4 + glow * 0.6})`
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })
  }
  step()
  return () => { cancelAnimationFrame(id); ro.disconnect() }
}
