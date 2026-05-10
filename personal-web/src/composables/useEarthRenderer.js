/**
 * EarthRenderer — Three.js globe with visitor-marker overlay
 *
 * Replaces the raw-WebGL implementation with a Three.js pipeline:
 *   - MeshPhysicalMaterial (day / night maps + normal + specular)
 *   - Cloud layer (transparent additive sphere)
 *   - Atmospheric rim shader (BackSide)
 *   - UnrealBloomPass for city-light glow in night mode
 *   - Star field particle system
 *   - OrbitControls + damped auto-rotation
 *   - Visitor markers positioned via Vector3 projection each frame
 *   - Day / Night mode toggle
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'

// ── Textures (CDN) ─────────────────────────────────────────────────────────

const TEXTURES = {
  day:     'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_atmos_2048.jpg',
  night:   'https://unpkg.com/three-globe/example/img/earth-night.jpg',
  normal:  'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_normal_2048.jpg',
  specular:'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_specular_2048.jpg',
  clouds:  'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_clouds_1024.png',
}

// ── Atmosphere shaders ──────────────────────────────────────────────────────

const ATMO_VERT = /* glsl */`
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const ATMO_FRAG = /* glsl */`
  varying vec3 vNormal;
  void main() {
    float intensity = pow(1.0 - dot(vNormal, vec3(0, 0, 1.0)), 3.5);
    gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity * 0.6;
  }
`

// ── Helpers ─────────────────────────────────────────────────────────────────

function latLonToVec3(lat, lon, r = 1.01) {
  const phi   = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -(r * Math.sin(phi) * Math.cos(theta)),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta)
  )
}

function loadTex(url) {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(url, t => {
      t.colorSpace = THREE.SRGBColorSpace
      resolve(t)
    }, undefined, reject)
  })
}

// ── EarthRenderer ────────────────────────────────────────────────────────────

export class EarthRenderer {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.canvas     = canvas
    this._markers   = []
    this._mode      = 'day'
    this._destroyed = false

    this._init()
  }

  _init() {
    const { canvas } = this

    // ── Scene ──────────────────────────────────────────────────────────────
    this.scene = new THREE.Scene()
    const aspect = canvas.clientWidth / canvas.clientHeight
    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 1000)
    this.camera.position.set(2.5, 1.5, 3.5)

    // ── Renderer ───────────────────────────────────────────────────────────
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias:       true,
      alpha:           true,
      powerPreference: 'high-performance',
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    this.renderer.toneMapping        = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.0

    // ── Post-processing ─────────────────────────────────────────────────────
    this.composer   = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.bloomPass  = new UnrealBloomPass(
      new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),
      0.15,   // strength
      0.6,    // radius
      0.6     // threshold
    )
    this.composer.addPass(this.bloomPass)

    // ── Lights ─────────────────────────────────────────────────────────────
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.05))
    this.sunLight = new THREE.DirectionalLight(0xffffff, 3.0)
    this.sunLight.position.set(5, 3, 5)
    this.scene.add(this.sunLight)

    // ── Earth group ─────────────────────────────────────────────────────────
    this.earthGroup = new THREE.Group()
    this.scene.add(this.earthGroup)

    // ── Async texture + mesh setup ─────────────────────────────────────────
    this._setupAsync()
  }

  async _setupAsync() {
    try {
      const [tDay, tNight, tNormal, tSpec, tClouds] = await Promise.all([
        loadTex(TEXTURES.day),
        loadTex(TEXTURES.night),
        loadTex(TEXTURES.normal),
        loadTex(TEXTURES.specular),
        loadTex(TEXTURES.clouds),
      ])

      // Earth sphere
      const earthMat = new THREE.MeshPhysicalMaterial({
        map:               tDay,
        normalMap:         tNormal,
        normalScale:       new THREE.Vector2(0.8, 0.8),
        roughnessMap:       tSpec,
        roughness:         0.7,
        metalness:         0.0,
        clearcoat:         0.1,
        clearcoatRoughness:0.3,
      })
      this.earthMat = earthMat

      const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), earthMat)
      this.earthGroup.add(earth)

      // Cloud layer
      const cloudMat = new THREE.MeshLambertMaterial({
        map:         tClouds,
        transparent: true,
        opacity:     0.5,
        blending:    THREE.AdditiveBlending,
        depthWrite:  false,
      })
      this.cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(1.012, 64, 64), cloudMat)
      this.earthGroup.add(this.cloudMesh)

      // Atmosphere rim
      const atmoMat = new THREE.ShaderMaterial({
        vertexShader:   ATMO_VERT,
        fragmentShader: ATMO_FRAG,
        blending:        THREE.AdditiveBlending,
        side:            THREE.BackSide,
        transparent:     true,
        depthWrite:      false,
      })
      this.scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.03, 64, 64), atmoMat))

      // Stars
      const starVerts = Array.from({ length: 6000 }, () => [
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
      ]).flat()
      const starGeo = new THREE.BufferGeometry()
      starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVerts, 3))
      this.scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({
        color:       0xffffff,
        size:        0.1,
        transparent: true,
        opacity:     0.6,
      })))

      // ── OrbitControls ────────────────────────────────────────────────────
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.enableDamping    = true
      this.controls.minDistance      = 1.3
      this.controls.maxDistance      = 6
      this.controls.enablePan        = false
      this.controls.rotateSpeed      = 0.6
      this.controls.zoomSpeed         = 0.5

      // ── Resize ───────────────────────────────────────────────────────────
      this._onResize = () => {
        const w = this.canvas.clientWidth
        const h = this.canvas.clientHeight
        this.camera.aspect = w / h
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(w, h)
        this.composer.setSize(w, h)
        this.bloomPass.resolution.set(w, h)
      }
      window.addEventListener('resize', this._onResize)

      // ── Animate ──────────────────────────────────────────────────────────
      this.clock = new THREE.Clock()
      this._animate()

    } catch (err) {
      console.error('[EarthRenderer] texture load failed:', err)
    }
  }

  _animate() {
    if (this._destroyed) return
    this._raf = requestAnimationFrame(() => this._animate())

    const t = this.clock.getElapsedTime()

    // Auto-rotate when user isn't dragging
    if (!this._isUserDragging) {
      this.earthGroup.rotation.y += 0.0008
    }

    // Clouds drift
    if (this.cloudMesh) {
      this.cloudMesh.rotation.y += 0.0002
    }

    // Visitor marker ring pulse
    this._markers.forEach(m => {
      if (m._ring) {
        const pulse      = 1 + (t % 2)
        m._ring.scale.set(pulse, pulse, pulse)
        m._ring.material.opacity = 1 - (t % 2) / 2
      }
      if (m._pillar) {
        m._pillar.material.opacity = 0.3 + Math.sin(t * 8) * 0.3
      }
    })

    this.controls?.update()
    this.composer.render()
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /**
   * @param {Array<{lat:number, lon:number, count:number, normSize:number}>} markers
   */
  setVisitorMarkers(markers) {
    // Remove old markers from scene
    this._markers.forEach(m => {
      this.earthGroup.remove(m._ring)
      this.earthGroup.remove(m._pillar)
    })
    this._markers = []

    const color = new THREE.Color(0x00aaff)

    markers.forEach(pin => {
      const pos = latLonToVec3(pin.lat, pin.lon)

      // Ring
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.01, 0.025, 32),
        new THREE.MeshBasicMaterial({
          color,
          side:        THREE.DoubleSide,
          transparent: true,
          blending:    THREE.AdditiveBlending,
        })
      )
      ring.position.copy(pos)
      ring.lookAt(new THREE.Vector3(0, 0, 0))
      this.earthGroup.add(ring)

      // Pillar
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.001, 0.006, 0.2, 16),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity:     0.6,
          blending:    THREE.AdditiveBlending,
        })
      )
      pillar.geometry.translate(0, 0.1, 0)
      pillar.geometry.rotateX(Math.PI / 2)
      pillar.position.copy(pos)
      pillar.lookAt(pos.clone().multiplyScalar(2))
      this.earthGroup.add(pillar)

      this._markers.push({ ...pin, _ring: ring, _pillar: pillar })
    })
  }

  /**
   * @param {'day'|'night'} mode
   */
  setMode(mode) {
    this._mode = mode
    if (!this.earthMat) return

    if (mode === 'night') {
      // Night map + emissive glow for city lights
      this.earthMat.map             = this.earthMat.userData?.tNight
      this.earthMat.emissiveMap     = this.earthMat.userData?.tNight
      this.earthMat.emissive        = new THREE.Color(0xffffee)
      this.earthMat.emissiveIntensity = 2.0

      this.sunLight.intensity       = 0
      this.bloomPass.strength       = 1.8
    } else {
      // Day map, no emissive
      this.earthMat.map             = this.earthMat.userData?.tDay
      this.earthMat.emissiveMap     = null
      this.earthMat.emissive        = new THREE.Color(0x000000)
      this.earthMat.emissiveIntensity = 0

      this.sunLight.intensity       = 3.0
      this.bloomPass.strength       = 0.15
    }
    this.earthMat.needsUpdate       = true
  }

  // Expose whether the user is currently dragging (used to pause auto-rotate)
  get isDragging() { return this._isUserDragging }

  destroy() {
    if (this._destroyed) return
    this._destroyed = true
    cancelAnimationFrame(this._raf)
    window.removeEventListener('resize', this._onResize)
    this.controls?.dispose()
    this.renderer.dispose()
  }
}
