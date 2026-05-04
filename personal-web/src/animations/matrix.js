/**
 * Matrix Digital Rain — Classic Matrix rain effect via Canvas 2D.
 * @param {HTMLCanvasElement} canvas
 * @returns {() => void} cleanup
 */
export function makeMatrix(canvas) {
  const ctx = canvas.getContext('2d')
  const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)

  const fontSize = 14
  let drops = []

  let id
  const step = () => {
    id = requestAnimationFrame(step)
    const w = canvas.width, h = canvas.height
    ctx.fillStyle = 'rgba(0,0,0,0.08)'
    ctx.fillRect(0, 0, w, h)

    const cols = Math.max(1, Math.floor(w / fontSize))
    while (drops.length < cols) drops.push(Math.random() * -80)
    drops.length = cols

    for (let i = 0; i < cols; i++) {
      const ch = String.fromCharCode(0x30A0 + Math.random() * 96)
      ctx.fillStyle = `hsl(${(i / cols) * 120 + 120}, 90%, 60%)`
      ctx.font = `${fontSize}px monospace`
      ctx.fillText(ch, i * fontSize, drops[i] * fontSize)
      if (drops[i] * fontSize > h && Math.random() > 0.975) drops[i] = 0
      drops[i]++
    }
  }
  step()
  return () => { cancelAnimationFrame(id); ro.disconnect() }
}
