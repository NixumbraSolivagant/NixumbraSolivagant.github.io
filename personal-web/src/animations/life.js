/**
 * Game of Life — Conway's Game of Life cellular automaton via Canvas 2D.
 * @param {HTMLCanvasElement} canvas
 * @returns {() => void} cleanup
 */
export function makeLife(canvas) {
  if (canvas.offsetWidth === 0 || canvas.offsetHeight === 0) return () => {}
  const ctx = canvas.getContext('2d')
  const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)

  const cellSize = 8
  const cols = () => Math.floor(canvas.width / cellSize)
  const rows = () => Math.floor(canvas.height / cellSize)
  let grid = Array.from({ length: rows() }, () => Array.from({ length: cols() }, () => Math.random() > 0.5 ? 1 : 0))
  let next = Array.from({ length: rows() }, () => Array(cols()).fill(0))
  let tick = 0

  let id
  const step = () => {
    id = requestAnimationFrame(step)
    const w = canvas.width, h = canvas.height
    ctx.fillStyle = 'rgba(0,0,0,0.15)'
    ctx.fillRect(0, 0, w, h)

    if (tick++ % 5 === 0) {
      const r = rows(), c = cols()
      for (let y = 0; y < r; y++) {
        for (let x = 0; x < c; x++) {
          let live = 0
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (!dx && !dy) continue
              live += grid[(y + dy + r) % r][(x + dx + c) % c]
            }
          }
          next[y][x] = (grid[y][x] && (live === 2 || live === 3)) || (!grid[y][x] && live === 3) ? 1 : 0
        }
      }
      ;[grid, next] = [next, grid]
    }

    const r = rows(), c = cols()
    for (let y = 0; y < r; y++) {
      for (let x = 0; x < c; x++) {
        if (!grid[y][x]) continue
        ctx.fillStyle = `hsl(${(x + y) * 2 % 360}, 80%, 60%)`
        ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2)
      }
    }
  }
  step()
  return () => { cancelAnimationFrame(id); ro.disconnect() }
}
