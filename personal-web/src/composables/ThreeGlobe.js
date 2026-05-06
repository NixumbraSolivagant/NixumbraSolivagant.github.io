/**
 * ThreeGlobe — Three.js-based 3D Earth with high-quality textures,
 * post-processing bloom, day/night mode, atmosphere rim shader,
 * and holographic location markers.
 *
 * Key design:
 *   - MeshPhysicalMaterial for natural matte earth surface
 *   - UnrealBloomPass for night city light glow
 *   - Custom ShaderMaterial atmosphere rim (thin gauze, not overblown)
 *   - OrbitControls for natural globe rotation
 *   - ACES filmic tone mapping + directional sun light for realism
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'

const BASE = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/'
const TEX = {
  color:    BASE + 'earth_atmos_2048.jpg',
  normal:   BASE + 'earth_normal_2048.jpg',
  specular: BASE + 'earth_specular_2048.jpg',
  clouds:   BASE + 'earth_clouds_1024.png',
}
const NIGHT_TEX = 'https://unpkg.com/three-globe/example/img/earth-night.jpg'

const GLOBE_R = 1.0
const CAM_DIST = 2.6
const CAM_FOV  = 45

function loadTex(url) {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(url, tex => {
      tex.colorSpace = THREE.SRGBColorSpace
      resolve(tex)
    }, undefined, reject)
  })
}

export class ThreeGlobe {
  constructor(canvas) {
    this._canvas    = canvas
    this._rafId     = null
    this._destroyed = false
    this._markers   = []
    this._mode      = 'day'

    this._initScene()
    this._initPostProcessing()
    this._initLights()
    this._initGlobe()
    this._initClouds()
    this._initAtmosphere()
    this._initStars()
    this._initMarkerSystem()
    this._initControls()
    this._initResize()

    this._raf()
  }

  // ── Scene / renderer ──────────────────────────────────────────────────────────

  _initScene() {
    this._renderer = new THREE.WebGLRenderer({
      canvas: this._canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this._renderer.toneMapping        = THREE.ACESFilmicToneMapping
    this._renderer.toneMappingExposure = 1.0

    this._scene = new THREE.Scene()

    this._camera = new THREE.PerspectiveCamera(
      CAM_FOV,
      this._canvas.clientWidth / this._canvas.clientHeight,
      0.1,
      500,
    )
    this._camera.position.set(0, 0, CAM_DIST)
  }

  // ── Post-processing ──────────────────────────────────────────────────────────

  _initPostProcessing() {
    this._composer = new EffectComposer(this._renderer)
    this._composer.addPass(new RenderPass(this._scene, this._camera))

    // Initialised to day bloom: very subtle highlight sheen
    this._bloomPass = new UnrealBloomPass(
      new THREE.Vector2(this._canvas.clientWidth, this._canvas.clientHeight),
      0.15,   // strength
      0.6,    // radius
      0.6,    // threshold
    )
    this._composer.addPass(this._bloomPass)
  }

  // ── Lighting ─────────────────────────────────────────────────────────────────

  _initLights() {
    this._ambient = new THREE.AmbientLight(0xffffff, 0.05)
    this._scene.add(this._ambient)

    this._sun = new THREE.DirectionalLight(0xffffff, 3.0)
    this._sun.position.set(5, 3, 5)
    this._scene.add(this._sun)
  }

  // ── Earth ─────────────────────────────────────────────────────────────────────

  _initGlobe() {
    this._geo = new THREE.SphereGeometry(GLOBE_R, 64, 64)
    this._mat = new THREE.MeshPhysicalMaterial({
      color:     0xffffff,
      emissive:  new THREE.Color(0x000000),
      roughness: 0.7,
      metalness: 0.0,
      clearcoat: 0.1,
      clearcoatRoughness: 0.3,
    })
    this._mesh = new THREE.Mesh(this._geo, this._mat)
    this._scene.add(this._mesh)

    this._loadEarthTextures()
  }

  async _loadEarthTextures() {
    try {
      const [color, normal, specular, night] = await Promise.all([
        loadTex(TEX.color),
        loadTex(TEX.normal),
        loadTex(TEX.specular),
        loadTex(NIGHT_TEX),
      ])
      if (this._destroyed) return
      this._mat.map          = color
      this._mat.normalMap    = normal
      this._mat.specularMap  = specular
      this._mat.normalScale  = new THREE.Vector2(0.8, 0.8)
      this._mat.needsUpdate  = true

      // Store night texture for mode switching
      this._nightTex = night
    } catch (e) {
      console.warn('[ThreeGlobe] texture load failed:', e)
    }
  }

  // ── Clouds ────────────────────────────────────────────────────────────────────

  _initClouds() {
    const geo = new THREE.SphereGeometry(GLOBE_R * 1.012, 64, 64)
    const mat = new THREE.MeshLambertMaterial({
      color:       0xffffff,
      transparent: true,
      opacity:     0.5,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    })
    this._cloudMesh = new THREE.Mesh(geo, mat)
    this._scene.add(this._cloudMesh)

    this._loadCloudTexture()
  }

  async _loadCloudTexture() {
    try {
      const tex = await loadTex(TEX.clouds)
      if (this._destroyed) return
      this._cloudMesh.material.map    = tex
      this._cloudMesh.material.needsUpdate = true
    } catch (e) {
      console.warn('[ThreeGlobe] cloud texture failed:', e)
    }
  }

  // ── Atmosphere rim ─────────────────────────────────────────────────────────────

  _initAtmosphere() {
    const vertexShader = `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `
    const fragmentShader = `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(1.0 - dot(vNormal, vec3(0, 0, 1.0)), 3.5);
        gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity * 0.6;
      }
    `
    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      blending:    THREE.AdditiveBlending,
      side:        THREE.BackSide,
      transparent: true,
    })
    // Only slightly larger than earth — thin gauze, not overblown
    this._atmosphere = new THREE.Mesh(new THREE.SphereGeometry(GLOBE_R * 1.03, 64, 64), mat)
    this._scene.add(this._atmosphere)
  }

  // ── Stars ─────────────────────────────────────────────────────────────────────

  _initStars() {
    const verts = []
    for (let i = 0; i < 6000; i++) {
      verts.push(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
      )
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    this._scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0xffffff,
      size:  0.1,
      transparent: true,
      opacity: 0.6,
    })))
  }

  // ── Visitor Markers ────────────────────────────────────────────────────────────

  _initMarkerSystem() {
    this._markerGroup = new THREE.Group()
    this._scene.add(this._markerGroup)
  }

  _latLonToVec3(lat, lon, radius) {
    const phi   = (90 - lat) * (Math.PI / 180)
    const theta = (lon + 180) * (Math.PI / 180)
    return new THREE.Vector3(
      -(radius * Math.sin(phi) * Math.cos(theta)),
       radius * Math.cos(phi),
       radius * Math.sin(phi) * Math.sin(theta),
    )
  }

  _hexToRgb(hex) {
    const r = ((hex >> 16) & 0xff) / 255
    const g = ((hex >> 8)  & 0xff) / 255
    const b = ( hex        & 0xff) / 255
    return { r, g, b }
  }

  addMarker(lat, lon, size = 0.018, color = 0x00aaff) {
    const radius = GLOBE_R * 1.01
    const pos = this._latLonToVec3(lat, lon, radius)

    const rGeo = new THREE.RingGeometry(0.01, 0.025, 32)
    const rMat = new THREE.MeshBasicMaterial({
      color,
      side:        THREE.DoubleSide,
      transparent: true,
      opacity:     0.8,
      blending:    THREE.AdditiveBlending,
    })
    const ring = new THREE.Mesh(rGeo, rMat)
    ring.position.copy(pos)
    ring.lookAt(0, 0, 0)
    this._markerGroup.add(ring)

    const pGeo = new THREE.CylinderGeometry(0.001, 0.006, 0.2, 16)
    const pMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity:     0.6,
      blending:    THREE.AdditiveBlending,
    })
    const pillar = new THREE.Mesh(pGeo, pMat)
    pGeo.translate(0, 0.1, 0)
    pGeo.rotateX(Math.PI / 2)
    pillar.position.copy(pos)
    pillar.lookAt(pos.clone().multiplyScalar(2))
    this._markerGroup.add(pillar)

    const markerObj = { ring, pillar, color }
    this._markers.push(markerObj)
    return markerObj
  }

  clearMarkers() {
    for (const { ring, pillar } of this._markers) {
      ring.geometry.dispose();   ring.material.dispose()
      pillar.geometry.dispose(); pillar.material.dispose()
      this._markerGroup.remove(ring)
      this._markerGroup.remove(pillar)
    }
    this._markers.length = 0
  }

  _updateMarkers(elapsed) {
    for (const { ring, pillar } of this._markers) {
      const s = (elapsed % 2)
      ring.scale.set(s, s, s)
      ring.material.opacity = 1 - s / 2
      pillar.material.opacity = 0.3 + Math.sin(elapsed * 8) * 0.3
    }
  }

  /**
   * VisitorMarker — holographic location marker with pulsing ring + pillar.
   * Used to show real visitor origin locations on the globe surface.
   */
  addVisitorMarker(lat, lon, size = 1.0, color = 0x00aaff) {
    const rgb = this._hexToRgb(color)
    const radius = GLOBE_R * 1.01
    const pos = this._latLonToVec3(lat, lon, radius)

    // Core dot — bright emissive sphere that blooms in night mode
    const coreGeo = new THREE.SphereGeometry(0.018 * size, 16, 16)
    const coreMat = new THREE.MeshBasicMaterial({
      color,
      transparent: false,
    })
    const core = new THREE.Mesh(coreGeo, coreMat)
    core.position.copy(pos)
    this._markerGroup.add(core)

    // Outer ring halo — breathes in/out
    const ringGeo = new THREE.RingGeometry(0.028 * size, 0.055 * size, 40)
    const ringMat = new THREE.MeshBasicMaterial({
      color,
      side:        THREE.DoubleSide,
      transparent: true,
      opacity:     0.85,
      blending:    THREE.AdditiveBlending,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.position.copy(pos)
    ring.lookAt(0, 0, 0)
    this._markerGroup.add(ring)

    // Vertical pillar — fades in/out independently
    const pGeo = new THREE.CylinderGeometry(0.001 * size, 0.005 * size, 0.22 * size, 12)
    const pMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity:     0.55,
      blending:    THREE.AdditiveBlending,
    })
    const pillar = new THREE.Mesh(pGeo, pMat)
    pGeo.translate(0, 0.11 * size, 0)
    pGeo.rotateX(Math.PI / 2)
    pillar.position.copy(pos)
    pillar.lookAt(pos.clone().multiplyScalar(2))
    this._markerGroup.add(pillar)

    const marker = { core, ring, pillar, rgb, size, color, _elapsed: 0 }
    this._markers.push(marker)
    return marker
  }

  /**
   * Set visitor markers from Umami country stats.
   * Replaces all existing markers with appropriately sized dots.
   *
   * @param {Array<{lat: number, lon: number, count: number, normSize: number}>} pins
   */
  setVisitorMarkers(pins) {
    this.clearMarkers()
    for (const pin of pins) {
      this.addVisitorMarker(
        pin.lat,
        pin.lon,
        Math.max(0.6, pin.normSize * 2 + 0.6),
        0x00aaff,
      )
    }
  }

  /**
   * Update marker animation state. Called every frame.
   * @param {number} elapsed - seconds since creation
   */
  updateMarkers(elapsed) {
    for (const m of this._markers) {
      const cycle = elapsed % 2.2
      const s = cycle
      m.ring.scale.set(s, s, s)
      m.ring.material.opacity = Math.max(0, 1 - cycle / 2.2) * 0.85
      m.pillar.material.opacity = 0.25 + Math.sin(elapsed * 7.5 + m.rgb.r * 3) * 0.3
    }
  }

  // ── Controls ──────────────────────────────────────────────────────────────────

  _initControls() {
    this._controls = new OrbitControls(this._camera, this._canvas)
    this._controls.enableDamping    = true
    this._controls.dampingFactor    = 0.065
    this._controls.enablePan         = false
    this._controls.minDistance       = 1.3
    this._controls.maxDistance      = 6
    this._controls.rotateSpeed      = 0.6
    this._controls.zoomSpeed        = 0.7
  }

  // ── Resize ────────────────────────────────────────────────────────────────────

  _initResize() {
    this._onResize = () => {
      const w = this._canvas.clientWidth
      const h = this._canvas.clientHeight
      this._camera.aspect = w / h
      this._camera.updateProjectionMatrix()
      this._renderer.setSize(w, h, false)
      this._composer.setSize(w, h)
    }
    window.addEventListener('resize', this._onResize)
    this._onResize()
  }

  // ── Animation loop ───────────────────────────────────────────────────────────

  _raf() {
    if (this._destroyed) return
    this._rafId = requestAnimationFrame(() => this._raf())

    this._controls.update()

    const elapsed = performance.now() * 0.001

    this._mesh.rotation.y        += 0.0008
    this._cloudMesh.rotation.y   += 0.0002
    this._markerGroup.rotation.y += 0.0008

    this.updateMarkers(elapsed)

    this._composer.render()
  }

  // ── Day / Night mode ──────────────────────────────────────────────────────────

  setMode(mode) {
    if (!this._nightTex) return
    this._mode = mode

    if (mode === 'night') {
      this._mat.map             = this._nightTex
      this._mat.emissiveMap     = this._nightTex
      this._mat.emissive        = new THREE.Color(0xffffee)
      this._mat.emissiveIntensity = 2.0

      this._sun.intensity        = 0
      this._ambient.intensity    = 0.02

      this._bloomPass.strength    = 1.8
    } else {
      this._mat.map              = null
      this._mat.emissiveMap      = null
      this._mat.emissive         = new THREE.Color(0x000000)
      this._mat.emissiveIntensity = 0

      this._sun.intensity        = 3.0

      this._bloomPass.strength   = 0.15
    }
    this._mat.needsUpdate = true
  }

  // ── Public API ───────────────────────────────────────────────────────────────

  project(lat, lon) {
    const lr = lat * (Math.PI / 180)
    const pr = lon * (Math.PI / 180)
    const v  = new THREE.Vector3(
      Math.cos(lr) * Math.cos(pr),
      Math.sin(lr),
      Math.cos(lr) * Math.sin(pr),
    )

    v.applyEuler(this._mesh.rotation)

    const cam = this._camera.clone()
    const ndc = v.clone().project(cam)

    return {
      x:       (ndc.x + 1) * 0.5 * this._canvas.clientWidth,
      y:       (1 - ndc.y) * 0.5 * this._canvas.clientHeight,
      depth:   ndc.z,
      visible: ndc.z < 1,
    }
  }

  get loaded()         { return this._mat.map !== null }
  get isDragging()     { return this._controls.enabled && this._controls.isUserInteracting }
  get mode()           { return this._mode }
  get supportsMode()   { return this._nightTex != null }

  destroy() {
    this._destroyed = true
    cancelAnimationFrame(this._rafId)
    window.removeEventListener('resize', this._onResize)
    this._controls.dispose()
    this.clearMarkers()
    this._markerGroup.parent?.remove(this._markerGroup)
    this._geo.dispose()
    this._mat.dispose()
    this._cloudMesh.geometry.dispose()
    this._cloudMesh.material.dispose()
    this._atmosphere.geometry.dispose()
    this._atmosphere.material.dispose()
    this._composer.dispose()
    this._renderer.dispose()
  }
}
