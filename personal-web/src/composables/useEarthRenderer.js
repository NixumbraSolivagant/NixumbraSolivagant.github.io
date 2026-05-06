/**
 * EarthRenderer — lightweight WebGL globe with SVG-derived textures
 *
 * Design:
 *   - Static local PNG textures (SVG sourced, no network on load)
 *   - Fixed camera at (0,0,2.5), globe vertices rotated each frame
 *   - Terminator computed in world space
 *   - HTML pins via exact globe projection math
 */

const PI = Math.PI
const TWO_PI = PI * 2
const GR = 0.8

// ── Shaders ───────────────────────────────────────────────────────────────────

const VERT = `
precision highp float;
attribute vec3 aPos;
attribute vec2 aUv;
varying vec2 vUv;
uniform mat4 uMVP;
void main() {
  vUv = aUv;
  gl_Position = uMVP * vec4(aPos, 1.0);
}`

const FRAG = `
precision highp float;
uniform sampler2D uDay;
uniform sampler2D uNight;
uniform float uSunTheta;
uniform float uSunPhi;
varying vec2 vUv;

void main() {
  float lon = (vUv.x - 0.5) * 6.2832;
  float lat = (vUv.y - 0.5) * -3.1416;

  vec3 n = vec3(cos(lon)*cos(lat), sin(lat), sin(lon)*cos(lat));

  vec3 sun = vec3(
    cos(uSunPhi) * cos(uSunTheta),
    sin(uSunPhi),
    sin(uSunPhi) * cos(uSunTheta)
  );

  float dayness = clamp(dot(n, sun) * 2.5 + 0.15, 0.0, 1.0);
  dayness = smoothstep(0.0, 1.0, dayness);

  vec4 day   = texture2D(uDay,   vUv);
  vec4 night = texture2D(uNight, vUv);
  vec4 col   = mix(night, day, dayness);

  vec2  c   = vUv * 2.0 - 1.0;
  float rim = pow(clamp(1.0 - length(c), 0.0, 1.0), 3.5);
  col.rgb  += vec3(0.05, 0.18, 0.50) * rim * 0.55;

  gl_FragColor = col;
}`

// ── Matrix helpers ──────────────────────────────────────────────────────────────

function perspective(fov, aspect, near, far) {
  const f = 1 / Math.tan(fov / 2)
  const nf = 1 / (near - far)
  return new Float32Array([
    f/aspect, 0, 0,              0,
    0,         f, 0,              0,
    0,         0, (far+near)*nf, -1,
    0,         0, 2*far*near*nf, 0,
  ])
}

function lookAt(eye, ctr, up) {
  let [ex,ey,ez] = eye, [cx,cy,cz] = ctr, [ux,uy,uz] = up
  let zx=ex-cx, zy=ey-cy, zz=ez-cz
  let l = Math.hypot(zx,zy,zz); zx/=l; zy/=l; zz/=l
  let xx=uy*zz-uz*zy, xy=uz*zx-ux*zz, xz=ux*zy-uy*zx
  l=Math.hypot(xx,xy,xz); xx/=l; xy/=l; xz/=l
  ux=zy*xz-zz*xy; uy=zz*xx-zx*xz; uz=zx*xy-zy*xx
  return new Float32Array([
    xx,ux,zx,0, xy,uy,zy,0, xz,uz,zz,0,
    -(xx*ex+xy*ey+xz*ez),-(ux*ex+uy*ey+uz*ez),-(zx*ex+zy*ey+zz*ez),1,
  ])
}

function mul(a, b) {
  const o = new Float32Array(16)
  for (let i=0;i<4;i++) for (let j=0;j<4;j++)
    { let s=0; for(let k=0;k<4;k++) s+=a[i+k*4]*b[k+j*4]; o[i+j*4]=s }
  return o
}

function rotX(t) { const c=Math.cos(t),s=Math.sin(t); return new Float32Array([1,0,0,0,0,c,-s,0,0,s,c,0,0,0,0,1]) }
function rotZ(t) { const c=Math.cos(t),s=Math.sin(t); return new Float32Array([c,s,0,0,-s,c,0,0,0,0,1,0,0,0,0,1]) }

function buildMVP(phi, theta) {
  return mul(
    perspective(PI/3.5, 1, 0.1, 100),
    mul(
      lookAt([0,0,2.5],[0,0,0],[0,1,0]),
      mul(rotX(theta), rotZ(phi))
    )
  )
}

// ── WebGL helpers ─────────────────────────────────────────────────────────────

function compileShader(gl, type, src) {
  const s = gl.createShader(type)
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    throw new Error('Shader: ' + gl.getShaderInfoLog(s))
  return s
}

function mkProg(gl, vert, frag) {
  const p = gl.createProgram()
  gl.attachShader(p, compileShader(gl, gl.VERTEX_SHADER, vert))
  gl.attachShader(p, compileShader(gl, gl.FRAGMENT_SHADER, frag))
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS))
    throw new Error('Link: ' + gl.getProgramInfoLog(p))
  return p
}

// ── Texture loading (local PNG) ───────────────────────────────────────────────

function uploadTexFromImg(gl, tex, img) {
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.generateMipmap(gl.TEXTURE_2D)
}

function loadLocalTex(gl, tex, path) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      uploadTexFromImg(gl, tex, img)
      resolve()
    }
    img.onerror = () => reject(new Error('Failed to load: ' + path))
    img.src = path
  })
}

// ── Sphere geometry ─────────────────────────────────────────────────────────────

function buildSphere() {
  const verts = [], idx = []
  const LB = 60, Ln = 120  // lower resolution = lighter
  for (let la = 0; la <= LB; la++) {
    const th = la * PI / LB
    const st = Math.sin(th), ct = Math.cos(th)
    for (let lo = 0; lo <= Ln; lo++) {
      const ph = lo * TWO_PI / Ln
      verts.push(GR * Math.cos(ph)*st, GR * ct, GR * Math.sin(ph)*st)
      verts.push(lo / Ln, la / LB)
    }
  }
  for (let la = 0; la < LB; la++) for (let lo = 0; lo < Ln; lo++) {
    const a = la*(Ln+1)+lo, b = a+Ln+1
    idx.push(a,b,a+1, b,b+1,a+1)
  }
  return { verts: new Float32Array(verts), idx: new Uint16Array(idx) }
}

// ── EarthRenderer ──────────────────────────────────────────────────────────────

export class EarthRenderer {
  constructor(canvas) {
    this.canvas = canvas
    this.gl = canvas.getContext('webgl', { alpha:true, antialias:true, premultipliedAlpha:false })
    if (!this.gl) throw new Error('WebGL not supported')

    this.phi = 0
    this.theta = 0
    this.sunTheta = 0.5
    this.sunPhi   = 0.1
    this.sunDrift = 0.0002

    this.rotSpeed   = 0.0022
    this.autoRotate = true
    this._drag = false
    this._dragFrom = { x:0, y:0 }
    this._phi0 = 0; this._theta0 = 0

    this._texReady = false
    this._raf = null
    this._init()
  }

  _init() {
    const gl = this.gl

    this.prog = mkProg(gl, VERT, FRAG)
    this.uDay   = gl.getUniformLocation(this.prog, 'uDay')
    this.uNight = gl.getUniformLocation(this.prog, 'uNight')
    this.uSunTh = gl.getUniformLocation(this.prog, 'uSunTheta')
    this.uSunPh = gl.getUniformLocation(this.prog, 'uSunPhi')
    this.uMVP   = gl.getUniformLocation(this.prog, 'uMVP')

    const { verts, idx } = buildSphere()
    this._vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo)
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW)
    this._ibo = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._ibo)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW)
    this._idxCnt = idx.length

    this._dayTex   = gl.createTexture()
    this._nightTex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, this._dayTex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([15,35,75,255]))
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.bindTexture(gl.TEXTURE_2D, this._nightTex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([4,6,18,255]))
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    // Load local PNG textures (SVG-derived world maps)
    loadLocalTex(gl, this._dayTex,   '/world-day.png')
      .catch(e => console.warn('[Earth] day texture failed:', e))
    loadLocalTex(gl, this._nightTex, '/world-night.png')
      .catch(e => console.warn('[Earth] night texture failed:', e))
    this._texReady = true

    this._onDown  = e => {
      this._drag = true
      const p = e.touches ? e.touches[0] : e
      this._dragFrom = { x: p.clientX, y: p.clientY }
      this._phi0 = this.phi; this._theta0 = this.theta
      this.canvas.style.cursor = 'grabbing'
    }
    this._onMove = e => {
      const p = e.touches ? e.touches[0] : e
      if (!this._drag) return
      const dx = p.clientX - this._dragFrom.x
      const dy = p.clientY - this._dragFrom.y
      this.phi   = this._phi0 + dx * 0.005
      this.theta = Math.max(-PI/2, Math.min(PI/2, this._theta0 + dy * 0.005))
    }
    this._onUp    = () => { this._drag = false; this.canvas.style.cursor = 'grab' }
    this._onLeave = () => { this._drag = false; this.canvas.style.cursor = 'grab' }
    this._onSize  = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      this.canvas.width  = this.canvas.clientWidth  * dpr
      this.canvas.height = this.canvas.clientHeight * dpr
    }

    this.canvas.addEventListener('mousedown',  this._onDown)
    this.canvas.addEventListener('touchstart', this._onDown, { passive: true })
    this.canvas.addEventListener('mousemove',  this._onMove)
    this.canvas.addEventListener('touchmove',  this._onMove, { passive: true })
    this.canvas.addEventListener('mouseup',    this._onUp)
    this.canvas.addEventListener('touchend',   this._onUp)
    this.canvas.addEventListener('mouseleave', this._onLeave)
    window.addEventListener('resize', this._onSize)
    this._onSize()
    this.canvas.style.cursor = 'grab'

    const loop = () => { this._render(); this._raf = requestAnimationFrame(loop) }
    requestAnimationFrame(loop)
  }

  /**
   * Register a callback called every frame to update pin positions.
   * @param {(w: number, h: number) => void} cb
   */
  onRender(cb) { this._renderCB = cb }

  /**
   * Update pin screen positions every frame.
   * Mirrors the globe vertex shader's MVP pipeline exactly:
   *   clip = Perspective * View * [rotZ(phi) * rotX(theta)] * spherePoint
   * so pins always sit precisely on the rendered surface.
   */
  updatePinPositions(pins, canvasW, canvasH) {
    const halfFov = PI / 3.5        // must match perspective(PI/3.5, 1, ...)
    const f  = 1 / Math.tan(halfFov / 2)
    const nf = 1 / (0.1 - 100)      // near=0.1, far=100

    const cx = Math.cos(this.theta), sx = Math.sin(this.theta)
    const cz = Math.cos(this.phi),   sz = Math.sin(this.phi)

    for (const pin of pins) {
      // lat/lon → unit sphere (same as globe fragment shader)
      const lr = pin.lat * PI / 180
      const pr = pin.lon * PI / 180
      const nx =  Math.cos(lr) * Math.cos(pr)
      const ny =  Math.sin(lr)
      const nz =  Math.cos(lr) * Math.sin(pr)

      // Step 1 — globe rotation (same as buildMVP: rotX(theta) * rotZ(phi) applied to col vector)
      const gx =  cx * nx       + sx * ny
      const gy = -sx * nz
      const gz =  cz * nz

      // Step 2 — view transform (lookAt [0,0,2.5] → [0,0,0])
      // Right=(0,1,0)×(0,0,-1)=(1,0,0), Up=(0,0,-1), dir=(0,0,-1)
      const vx = gx
      const vy = gz
      const vz = -gy + 2.5

      // Step 3 — perspective divide (clip space)
      const clipW = f * vz
      const ndcX =  vx / clipW
      const ndcY =  vy / clipW
      const ndcZ = (2.0 * 100 * 0.1 * nf) / clipW + (100 + 0.1) * nf

      // Visibility: behind camera OR clipped by sphere (same as COBE rim logic)
      const behind = vz < 0 && ndcX * ndcX + ndcY * ndcY < 1.0

      // NDC [-1,+1] → CSS pixels (canvas uses clientWidth × clientHeight)
      pin._x =       (ndcX + 1) * 0.5 * canvasW
      pin._y = (1 - (ndcY + 1) * 0.5) * canvasH  // y-flip to match WebGL
      pin._z = ndcZ
      pin._visible = !behind
    }
  }

  _render() {
    const gl = this.gl
    if (!this._drag) this.phi += this.rotSpeed
    this.sunTheta += this.sunDrift

    const W = gl.canvas.width, H = gl.canvas.height

    gl.viewport(0, 0, W, H)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    gl.useProgram(this.prog)
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._ibo)

    const aPos = gl.getAttribLocation(this.prog, 'aPos')
    const aUv  = gl.getAttribLocation(this.prog, 'aUv')
    gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 20, 0)
    gl.enableVertexAttribArray(aUv);  gl.vertexAttribPointer(aUv,  2, gl.FLOAT, false, 20, 12)

    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this._dayTex)
    gl.uniform1i(this.uDay, 0)
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this._nightTex)
    gl.uniform1i(this.uNight, 1)
    gl.uniform1f(this.uSunTh, this.sunTheta)
    gl.uniform1f(this.uSunPh, this.sunPhi)

    gl.uniformMatrix4fv(this.uMVP, false, buildMVP(this.phi, this.theta))

    gl.drawElements(gl.TRIANGLES, this._idxCnt, gl.UNSIGNED_SHORT, 0)

    // Sync pin positions — mutates pinList in-place so Vue's reactivity fires
    if (this._renderCB) {
      this._renderCB(W / window.devicePixelRatio, H / window.devicePixelRatio)
    }
  }

  /**
   * Project lat/lon to canvas pixel coordinates.
   * @param {number} lat  Latitude in degrees
   * @param {number} lon  Longitude in degrees
   * @returns {{ x: number, y: number, visible: boolean } | null}
   */
  project(lat, lon) {
    const lr = lat * PI / 180
    const pr = lon * PI / 180

    const nx =  Math.cos(lr) * Math.cos(pr)
    const ny =  Math.sin(lr)
    const nz =  Math.cos(lr) * Math.sin(pr)

    const cx = Math.cos(this.theta), sx = Math.sin(this.theta)
    const cz = Math.cos(this.phi),   sz = Math.sin(this.phi)

    const rx =  cz * nx       + sz * nz
    const ry =  sx * sz * nx  + cx * ny - sx * cz * nz
    const rz = -cx * sz * nx  + sx * ny + cx * cz * nz

    // Hide points on the back hemisphere (behind the camera)
    const behind = rz < 0

    const W = this.canvas.clientWidth
    const H = this.canvas.clientHeight
    const halfFov = PI / 7
    const zEye = -rz * 2.5
    const viewW = Math.abs(zEye) * 2 * Math.tan(halfFov)

    const screenX = (rx / viewW + 0.5) * W
    const screenY = (-ry / viewW + 0.5) * H

    return { x: screenX, y: screenY, visible: !behind }
  }

  get loaded()     { return this._texReady }
  get isDragging() { return this._drag }

  destroy() {
    cancelAnimationFrame(this._raf)
    const gl = this.gl
    if (this._vbo) gl.deleteBuffer(this._vbo)
    if (this._ibo) gl.deleteBuffer(this._ibo)
    if (this._dayTex)   gl.deleteTexture(this._dayTex)
    if (this._nightTex) gl.deleteTexture(this._nightTex)
    this.canvas.removeEventListener('mousedown',  this._onDown)
    this.canvas.removeEventListener('touchstart', this._onDown)
    this.canvas.removeEventListener('mousemove',  this._onMove)
    this.canvas.removeEventListener('touchmove',  this._onMove)
    this.canvas.removeEventListener('mouseup',    this._onUp)
    this.canvas.removeEventListener('touchend',   this._onUp)
    this.canvas.removeEventListener('mouseleave', this._onLeave)
    window.removeEventListener('resize', this._onSize)
  }
}
