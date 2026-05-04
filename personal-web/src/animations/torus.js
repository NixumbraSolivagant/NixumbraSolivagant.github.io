/**
 * Rotating Torus Knot — Parametric surface with lighting via Three.js.
 * @param {HTMLCanvasElement} canvas
 * @returns {() => void} cleanup
 */
export function makeTorus(canvas) {
  const THREE = window._THREE
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(55, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000)
  camera.position.z = 6

  const geo = new THREE.TorusKnotGeometry(1.8, 0.55, 128, 24, 2, 3)
  const mat = new THREE.MeshPhongMaterial({ color: 0x38bdf8, emissive: 0x112233, shininess: 120 })
  const mesh = new THREE.Mesh(geo, mat)
  scene.add(mesh)
  scene.add(new THREE.DirectionalLight(0xffffff, 1.2))
  scene.add(new THREE.DirectionalLight(0xbd34fe, 0.6))
  scene.add(new THREE.AmbientLight(0x222244, 0.8))

  const ro = new ResizeObserver(() => {
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight
    camera.updateProjectionMatrix()
  })
  ro.observe(canvas)

  let id
  const step = () => {
    id = requestAnimationFrame(step)
    mesh.rotation.x += 0.006; mesh.rotation.y += 0.008
    renderer.render(scene, camera)
  }
  step()
  return () => { cancelAnimationFrame(id); ro.disconnect(); renderer.dispose() }
}
