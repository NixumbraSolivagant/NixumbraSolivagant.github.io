/**
 * Plasma Wave — Organic flowing plasma via Canvas 2D.
 */
export function makePlasma(canvas) {
  const ctx = canvas.getContext('2d')
  const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)

  let id
  const step = () => {
    id = requestAnimationFrame(step)
    const w = canvas.width, h = canvas.height
    const t = performance.now() * 0.001
    const imageData = ctx.createImageData(w, h)
    const data = imageData.data

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const nx = x / w - 0.5
        const ny = y / h - 0.5
        const v1 = Math.sin(nx * 10 + t * 1.2)
        const v2 = Math.sin((ny * 10 + t * 0.8))
        const v3 = Math.sin((nx * 10 + ny * 10 + t * 1.5) * 0.5)
        const v4 = Math.sin(Math.sqrt((nx * nx + ny * ny) * 80) - t * 2)
        const v = (v1 + v2 + v3 + v4) * 0.25
        const hue = ((v + 1) * 0.5 * 360 + t * 20) % 360
        const idx = (y * w + x) * 4
        const c = hslToRgb(hue / 360, 0.85, 0.5)
        data[idx] = c[0]; data[idx + 1] = c[1]; data[idx + 2] = c[2]; data[idx + 3] = 255
      }
    }
    ctx.putImageData(imageData, 0, 0)
  }
  step()
  return () => { cancelAnimationFrame(id); ro.disconnect() }

  function hslToRgb(h, s, l) {
    let r, g, b
    if (s === 0) { r = g = b = l } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
  }
  function hue2rgb(p, q, t) {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
}
