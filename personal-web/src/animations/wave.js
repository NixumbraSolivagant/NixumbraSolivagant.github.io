/**
 * Wave Animation — Sine wave superposition via Canvas 2D.
 * @param {HTMLCanvasElement} canvas
 * @returns {() => void} cleanup
 */
export function makeWave(canvas) {
  const ctx = canvas.getContext('2d')
  const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)

  let id
  const step = () => {
    id = requestAnimationFrame(step)
    const w = canvas.width, h = canvas.height
    ctx.clearRect(0, 0, w, h)
    const t = performance.now() * 0.001

    for (let layer = 0; layer < 6; layer++) {
      ctx.beginPath()
      ctx.strokeStyle = `hsla(${(t * 25 + layer * 45) % 360}, 85%, 65%, ${0.12 + layer * 0.1})`
      ctx.lineWidth = 2.5 - layer * 0.25
      for (let x = 0; x <= w; x += 2) {
        const nx = x / w
        const y = h / 2 +
          Math.sin(nx * Math.PI * 3 + t * 1.2 + layer * 0.5) * h * 0.14 +
          Math.sin(nx * Math.PI * 5 + t * 0.8 - layer * 0.4) * h * 0.07 +
          Math.sin(nx * Math.PI * 7 + t * 1.6 + layer * 0.7) * h * 0.03
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    for (let i = 0; i < 5; i++) {
      const px = ((t * 35 + i * (w / 4)) % (w + 30)) - 15
      const py = h / 2 + Math.sin(px / w * Math.PI * 3 + t * 1.2) * h * 0.14
      ctx.beginPath()
      ctx.arc(px, py, 3.5, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${(t * 50 + i * 72) % 360}, 90%, 70%, 0.8)`
      ctx.fill()
    }
  }
  step()
  return () => { cancelAnimationFrame(id); ro.disconnect() }
}
