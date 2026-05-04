/**
 * Rubik Field — Quantum cube field floating in space via Three.js.
 */
export function makeRubik(canvas) {
  const THREE = window._THREE
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(55, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000)
  camera.position.z = 14

  const palette = [0xffffff, 0xffd500, 0x009b48, 0x0046ad, 0xc41e3a, 0xff5800]
  const cubelets = []
  const grid = 2

  for (let x = -grid; x <= grid; x++) {
    for (let y = -grid; y <= grid; y++) {
      for (let z = -grid; z <= grid; z++) {
        const geo = new THREE.BoxGeometry(0.9, 0.9, 0.9)
        const faces = [
          x === grid  ? palette[0] : 0x111111,
          x === -grid ? palette[1] : 0x111111,
          y === grid  ? palette[2] : 0x111111,
          y === -grid ? palette[3] : 0x111111,
          z === grid  ? palette[4] : 0x111111,
          z === -grid ? palette[5] : 0x111111,
        ]
        const mats = faces.map(c => new THREE.MeshStandardMaterial({
          color: c, roughness: 0.3, metalness: 0.2,
          emissive: c === 0x111111 ? 0x000000 : (c | 0x220000) & 0x00330000,
        }))
        const mesh = new THREE.Mesh(geo, mats)
        mesh.position.set(x * 1.02, y * 1.02, z * 1.02)
        scene.add(mesh)
        cubelets.push({ mesh, ox: x * 1.02, oy: y * 1.02, oz: z * 1.02 })
      }
    }
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.5))
  const d1 = new THREE.DirectionalLight(0xffffff, 1.0); d1.position.set(5, 8, 5); scene.add(d1)
  const d2 = new THREE.DirectionalLight(0x4488ff, 0.4); d2.position.set(-5, -3, -5); scene.add(d2)

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
    cubelets.forEach((c, i) => {
      const phase = t * 0.4 + i * 0.08
      c.mesh.position.x = c.ox + Math.sin(phase + c.oy) * 0.4
      c.mesh.position.y = c.oy + Math.cos(phase * 1.3 + c.oz) * 0.3
      c.mesh.position.z = c.oz + Math.sin(phase * 0.7 + c.ox) * 0.4
      c.mesh.rotation.x += 0.008 + i * 0.00005
      c.mesh.rotation.y += 0.01 + i * 0.00007
    })
    renderer.render(scene, camera)
  }
  step()
  return () => { cancelAnimationFrame(id); ro.disconnect(); renderer.dispose() }
}
