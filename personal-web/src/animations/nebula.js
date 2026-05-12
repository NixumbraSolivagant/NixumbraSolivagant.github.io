/**
 * Nebula Particles — Three.js 3D particle system simulating cosmic nebula flow.
 * @param {HTMLCanvasElement} canvas
 * @returns {() => void} cleanup
 */
export function makeNebula(canvas) {
  const THREE = window._THREE
  if (!THREE) return () => {}
  if (canvas.offsetWidth === 0 || canvas.offsetHeight === 0) return () => {}
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000)
  camera.position.z = 5

  const count = 2500
  const pos = new Float32Array(count * 3)
  const col = new Float32Array(count * 3)
  for (let i = 0; i < count * 3; i += 3) {
    pos[i] = (Math.random() - 0.5) * 14
    pos[i + 1] = (Math.random() - 0.5) * 14
    pos[i + 2] = (Math.random() - 0.5) * 14
    const c = new THREE.Color().setHSL(Math.random(), 0.8, 0.6)
    col[i] = c.r; col[i + 1] = c.g; col[i + 2] = c.b
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  const mat = new THREE.PointsMaterial({ size: 0.035, vertexColors: true, transparent: true, opacity: 0.9 })
  const points = new THREE.Points(geo, mat)
  scene.add(points)

  const ro = new ResizeObserver(() => {
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight
    camera.updateProjectionMatrix()
  })
  ro.observe(canvas)

  let id
  const step = () => {
    id = requestAnimationFrame(step)
    mat.rotation.y += 0.0006
    mat.rotation.x += 0.0002
    renderer.render(scene, camera)
  }
  step()

  return () => {
    cancelAnimationFrame(id)
    ro.disconnect()
    geo.dispose()
    mat.dispose()
    renderer.dispose()
  }
}
