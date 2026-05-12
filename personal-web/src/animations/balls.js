/**
 * Gravity Balls — Multi-sphere elastic collision physics via Three.js.
 * @param {HTMLCanvasElement} canvas
 * @returns {() => void} cleanup
 */
export function makeBalls(canvas) {
  const THREE = window._THREE
  if (!THREE) return () => {}
  if (canvas.offsetWidth === 0 || canvas.offsetHeight === 0) return () => {}
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000)
  camera.position.z = 8

  const group = new THREE.Group()
  scene.add(group)

  const palette = [0x38bdf8, 0xbd34fe, 0xe0321b, 0x34d399, 0xf59e0b, 0xfb7185, 0xa78bfa, 0x4ade80]
  const spheres = []
  for (let i = 0; i < 8; i++) {
    const geo = new THREE.SphereGeometry(0.35, 24, 24)
    const mat = new THREE.MeshPhongMaterial({ color: palette[i], transparent: true, opacity: 0.88 })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6)
    mesh.userData = { vx: (Math.random() - 0.5) * 0.025, vy: (Math.random() - 0.5) * 0.025, vz: (Math.random() - 0.5) * 0.02 }
    group.add(mesh)
    spheres.push(mesh)
  }

  const ro = new ResizeObserver(() => {
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight
    camera.updateProjectionMatrix()
  })
  ro.observe(canvas)

  let id
  const step = () => {
    id = requestAnimationFrame(step)
    const b = 3.2
    for (const s of spheres) {
      s.position.x += s.userData.vx; s.position.y += s.userData.vy; s.position.z += s.userData.vz
      if (Math.abs(s.position.x) > b) s.userData.vx *= -1
      if (Math.abs(s.position.y) > b) s.userData.vy *= -1
      if (Math.abs(s.position.z) > b) s.userData.vz *= -1
    }
    group.rotation.y += 0.003
    renderer.render(scene, camera)
  }
  step()
  return () => {
    cancelAnimationFrame(id)
    ro.disconnect()
    spheres.forEach(s => { s.geometry.dispose(); s.material.dispose() })
    renderer.dispose()
  }
}
