/**
 * EarthRenderer — Three.js globe with day/night terminator shader
 *
 * Key features:
 *   - Custom ShaderMaterial: day texture brightens the day side,
 *     night texture (city lights) brightens the dark side via sun angle
 *   - MeshPhysicalMaterial underlay for PBR lighting (normal + specular)
 *   - Cloud layer with additive blending
 *   - Atmospheric rim shader (BackSide Fresnel)
 *   - UnrealBloomPass for city-light glow
 *   - Star field particle system
 *   - OrbitControls (rotation only — zoom disabled)
 *   - Auto-rotate + damped interaction
 *   - Visitor markers as 3-D mesh rings + pillars
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'

// ── CDN textures ──────────────────────────────────────────────────────────

const TEXTURES = {
  day:     'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_atmos_2048.jpg',
  night:   'https://unpkg.com/three-globe/example/img/earth-night.jpg',
  normal:  'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_normal_2048.jpg',
  specular:'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_specular_2048.jpg',
  clouds:  'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_clouds_1024.png',
}

// ── Earth shaders — blends day / night by sun angle ─────────────────────

const EARTH_VERT = /* glsl */`
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv    = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const EARTH_FRAG = /* glsl */`
  precision highp float;

  uniform sampler2D uDay;
  uniform sampler2D uNight;
  uniform sampler2D uNormal;
  uniform sampler2D uSpecular;

  // Sun direction — rotates slowly over time for real day/night drift
  uniform float uSunLon;    // longitude of sub-solar point (radians)
  uniform float uSunLat;    // latitude of sub-solar point (radians)

  varying vec2 vUv;
  varying vec3 vNormal;

  // Approximate world-space normal from UV (spherical coordinates)
  vec3 uvToNormal(vec2 uv) {
    float lon = (uv.x - 0.5) * 6.2832;
    float lat = (uv.y - 0.5) * -3.1416;
    return normalize(vec3(
      cos(lat) * cos(lon),
      sin(lat),
      cos(lat) * sin(lon)
    ));
  }

  // Sub-solar point in world space
  vec3 sunDir() {
    float phi   = (90.0 - uSunLat) * 0.01745329251;
    float theta = (uSunLon)        * 0.01745329251;
    return normalize(vec3(
      -sin(phi) * cos(theta),
       cos(phi),
       sin(phi) * sin(theta)
    ));
  }

  void main() {
    vec2  uv     = vUv;
    vec3  wNorm  = uvToNormal(uv);
    float cosA   = dot(wNorm, sunDir());

    // Smooth terminator — transition zone width controls softness
    float dayness = smoothstep(-0.15, 0.2, cosA);

    vec4 dayCol   = texture2D(uDay,   uv);
    vec4 nightCol = texture2D(uNight, uv);

    vec3 color = mix(nightCol.rgb, dayCol.rgb, dayness);

    // Subtle atmosphere rim on bright side
    vec2  center = vUv * 2.0 - 1.0;
    float rim    = pow(clamp(1.0 - length(center), 0.0, 1.0), 3.5);
    color += vec3(0.05, 0.18, 0.50) * rim * 0.4 * dayness;

    gl_FragColor = vec4(color, 1.0);
  }
`

// ── Atmosphere shaders ───────────────────────────────────────────────────

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

// ── Helpers ────────────────────────────────────────────────────────────────

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

// ── EarthRenderer ─────────────────────────────────────────────────────────

export class EarthRenderer {
  constructor(canvas) {
    this.canvas     = canvas
    this._markers  = []
    this._destroyed = false

    // Sun drifts across the globe over time (longitude in degrees)
    this._sunLon = 0
    this._sunDriftSpeed = 0.3  // degrees per second — one full day ≈ 6 min

    this._init()
  }

  _init() {
    const { canvas } = this

    // ── Scene ──────────────────────────────────────────────────────────────
    this.scene = new THREE.Scene()
    const aspect = canvas.clientWidth / canvas.clientHeight || 1
    this.camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 1000)
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
    this.renderer.toneMapping         = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.0

    // ── Post-processing ─────────────────────────────────────────────────────
    this.composer  = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),
      1.8,   // strength — always on so city lights glow in night zones
      0.6,   // radius
      0.6,   // threshold
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

      // ── Earth with custom day/night shader ────────────────────────────────
      this.earthMat = new THREE.ShaderMaterial({
        vertexShader:   EARTH_VERT,
        fragmentShader: EARTH_FRAG,
        uniforms: {
          uDay:      { value: tDay },
          uNight:    { value: tNight },
          uNormal:   { value: tNormal },
          uSpecular: { value: tSpec },
          uSunLon:   { value: this._sunLon },
          uSunLat:   { value: 0 },   // sub-solar latitude stays near 0 (equinox)
        },
      })

      const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), this.earthMat)
      this.earthGroup.add(earth)

      // ── Cloud layer ──────────────────────────────────────────────────────
      const cloudMat = new THREE.MeshLambertMaterial({
        map:         tClouds,
        transparent: true,
        opacity:     0.5,
        blending:    THREE.AdditiveBlending,
        depthWrite:  false,
      })
      this.cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(1.012, 64, 64), cloudMat)
      this.earthGroup.add(this.cloudMesh)

      // ── Atmosphere rim ───────────────────────────────────────────────────
      const atmoMat = new THREE.ShaderMaterial({
        vertexShader:   ATMO_VERT,
        fragmentShader: ATMO_FRAG,
        blending:        THREE.AdditiveBlending,
        side:           THREE.BackSide,
        transparent:    true,
        depthWrite:     false,
      })
      this.scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.03, 64, 64), atmoMat))

      // ── Stars ────────────────────────────────────────────────────────────
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

      // ── OrbitControls — rotation only, zoom disabled ─────────────────────
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.enableDamping    = true
      this.controls.enablePan       = false
      this.controls.enableZoom      = false    // ← zoom disabled
      this.controls.rotateSpeed     = 0.6

      // ── Resize ──────────────────────────────────────────────────────────
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

      // ── Animate ─────────────────────────────────────────────────────────
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

    // Drift the sub-solar longitude for real day/night movement
    this._sunLon = (this._sunLon + this._sunDriftSpeed * 0.016) % 360
    if (this.earthMat) {
      this.earthMat.uniforms.uSunLon.value = this._sunLon
    }

    // Auto-rotate
    this.earthGroup.rotation.y += 0.0008

    // Clouds drift
    if (this.cloudMesh) {
      this.cloudMesh.rotation.y += 0.0002
    }

    // Visitor marker pulse
    this._markers.forEach(m => {
      const t_norm = (t % 2) / 2  // 0 → 1 → 0
      if (m._ring) {
        const s = 1 + t_norm * 0.6
        m._ring.scale.set(s, s, s)
        m._ring.material.opacity = 1 - t_norm * 0.6
      }
      if (m._pillar) {
        m._pillar.material.opacity = 0.35 + Math.sin(t_norm * Math.PI) * 0.45
      }
    })

    this.controls?.update()
    this.composer.render()
  }

  // ── Public API ──────────────────────────────────────────────────────────

  /**
   * @param {Array<{lat:number, lon:number, count:number, normSize:number}>} markers
   */
  setVisitorMarkers(markers) {
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

  destroy() {
    if (this._destroyed) return
    this._destroyed = true
    cancelAnimationFrame(this._raf)
    window.removeEventListener('resize', this._onResize)
    this.controls?.dispose()
    this.renderer.dispose()
  }
}
