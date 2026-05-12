/**
 * Waveform Tunnel — Infinite wave tunnel via Three.js.
 */
export function makeTunnel(canvas) {
  const THREE = window._THREE
  if (!THREE) return () => {}
  if (canvas.offsetWidth === 0 || canvas.offsetHeight === 0) return () => {}
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(70, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000)
  camera.position.z = 3

  const rings = []
  const ringObjects = [] // { geo, mat } for disposal
  const count = 40
  for (let i = 0; i < count; i++) {
    const r = 0.3 + i * 0.12
    const segs = 64
    const pts = []
    for (let j = 0; j <= segs; j++) {
      const a = (j / segs) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, -i * 1.5))
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts)
    const hue = (i / count) * 0.7 + 0.55
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color().setHSL(hue, 1.0, 0.55),
      transparent: true,
      opacity: 0.6 - i * 0.012,
    })
    rings.push(new THREE.Line(geo, mat))
    ringObjects.push({ geo, mat })
    scene.add(rings[rings.length - 1])
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.5))
  const point = new THREE.PointLight(0x4488ff, 2, 15)
  scene.add(point)

  const ro = new ResizeObserver(() => {
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight
    camera.updateProjectionMatrix()
  })
  ro.observe(canvas)

  let id
  const step = () => {
    id = requestAnimationFrame(step)
    const t = performance.now() * 0.001
    rings.forEach((ring, i) => {
      const offset = ((t * 2 + i * 0.5) % count) / count
      ring.position.z = offset * count * 1.5
      if (ring.position.z > camera.position.z) ring.position.z -= count * 1.5
      const fade = Math.max(0, 1 - ring.position.z / (count * 1.5))
      ring.material.opacity = (0.6 - i * 0.012) * fade
    })
    point.position.set(Math.sin(t) * 0.5, Math.cos(t * 0.7) * 0.5, 0)
    renderer.render(scene, camera)
  }
  step()
  return () => {
    cancelAnimationFrame(id)
    ro.disconnect()
    ringObjects.forEach(({ geo, mat }) => { geo.dispose(); mat.dispose() })
    renderer.dispose()
  }
}
