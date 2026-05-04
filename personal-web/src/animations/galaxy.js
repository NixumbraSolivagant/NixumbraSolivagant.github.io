/**
 * Particle Galaxy — Spinning galaxy of glowing particles via Three.js.
 */
export function makeGalaxy(canvas) {
  const THREE = window._THREE
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000)
  camera.position.z = 30

  const arms = 4
  const particles = 6000
  const pos = new Float32Array(particles * 3)
  const col = new Float32Array(particles * 3)

  for (let i = 0; i < particles; i++) {
    const arm = i % arms
    const t = Math.pow(Math.random(), 0.5)
    const spread = t * 22
    const angle = (arm / arms) * Math.PI * 2 + t * 4.5 + (Math.random() - 0.5) * 0.3
    pos[i * 3]     = Math.cos(angle) * spread + (Math.random() - 0.5) * 1.5
    pos[i * 3 + 1] = (Math.random() - 0.5) * 1.5
    pos[i * 3 + 2] = Math.sin(angle) * spread + (Math.random() - 0.5) * 1.5
    const hue = (arm / arms + t * 0.12) % 1
    const c = new THREE.Color().setHSL(hue, 0.9, 0.55 + Math.random() * 0.2)
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  const mat = new THREE.PointsMaterial({ size: 0.12, vertexColors: true, transparent: true, opacity: 0.9 })
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
    points.rotation.y += 0.003
    points.rotation.x += 0.0008
    renderer.render(scene, camera)
  }
  step()
  return () => { cancelAnimationFrame(id); ro.disconnect(); renderer.dispose() }
}
