<template>
  <div>
    <div class="nix-filter"></div>
    <video
      id="background-video"
      class="background-video"
      muted
      loop
      playsinline
      preload="auto"
    ></video>
    <canvas
      id="three-body-canvas"
      class="three-body-canvas"
      style="position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none;"
    ></canvas>

    <div class="nix-main">
      <div class="nix-left">
        <div class="logo" style="background-image: url(/static/img/avatar.png); background-position: center -10%;">
          <img
            style="position: absolute; top: -15%; left: -10%; width: 120%; aspect-ratio: 1/1;"
            src="/static/img/logokuang.png"
            alt="logo"
          />
        </div>
        <div class="left-div left-des">
          <div class="left-des-item">
            <svg
              t="1705773709627"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1478"
            >
              <path
                d="M512 249.976471c-99.388235 0-180.705882 81.317647-180.705882 180.705882s81.317647 180.705882 180.705882 180.705882 180.705882-81.317647 180.705882-180.705882-81.317647-180.705882-180.705882-180.705882z m0 301.17647c-66.258824 0-120.470588-54.211765-120.470588-120.470588s54.211765-120.470588 120.470588-120.470588 120.470588 54.211765 120.470588 120.470588-54.211765 120.470588-120.470588 120.470588z"
                p-id="1479"
              ></path>
              <path
                d="M512 39.152941c-216.847059 0-391.529412 174.682353-391.529412 391.529412 0 349.364706 391.529412 572.235294 391.529412 572.235294s391.529412-222.870588 391.529412-572.235294c0-216.847059-174.682353-391.529412-391.529412-391.529412z m0 891.482353C424.658824 873.411765 180.705882 686.682353 180.705882 430.682353c0-183.717647 147.576471-331.294118 331.294118-331.294118s331.294118 147.576471 331.294118 331.294118c0 256-243.952941 442.729412-331.294118 499.952941z"
                p-id="1480"
              ></path>
            </svg>
            Jiangxi Nanchang
          </div>
          <div class="left-des-item">待补充</div>
        </div>
        <div class="left-div left-tag">
          <div class="left-tag-item">骑行</div>
          <div class="left-tag-item">魔方</div>
          <div class="left-tag-item">徒步</div>
          <div class="left-tag-item">武术</div>
        </div>
        <div class="left-div left-time">
          <ul id="line">
            <li>
              <div class="focus"></div>
              <div>搭建网站初版</div>
              <div>2026.1.24</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="nix-right">
        <header>
          <div class="index-logo" style="background-image: url(/static/img/avatar.png); background-position: center -10%;">
            <img
              style="position: absolute; top: -15%; left: -10%; width: 120%; aspect-ratio: 1/1;"
              src="/static/img/logokuang.png"
              alt="logo"
            />
          </div>
          <div class="welcome">
            Hello I' m <span class="gradientText">Mingzhang HU</span>
          </div>
          <div class="description">👦 <span class="purpleText">Computer</span> Student</div>
          <div class="description">📝 待补充</div>

          <div class="iconContainer">
            <a class="iconItem" href="https://github.com/NixumbraSolivagant" target="_blank" rel="noreferrer">
              <svg
                t="1704870335945"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2487"
              >
                <path
                  d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9 23.5 23.2 38.1 55.4 38.1 91v112.5c0.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"
                  p-id="2488"
                ></path>
              </svg>
              <div class="iconTip">Github</div>
            </a>
            <a class="iconItem" href="mailto:Hmzemc333@outlook.com">
              <svg
                t="1704870588438"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3174"
              >
                <path
                  d="M926.47619 355.644952V780.190476a73.142857 73.142857 0 0 1-73.142857 73.142857H170.666667a73.142857 73.142857 0 0 1-73.142857-73.142857V355.644952l304.103619 257.828572a170.666667 170.666667 0 0 0 220.745142 0L926.47619 355.644952zM853.333333 170.666667a74.044952 74.044952 0 0 1 26.087619 4.778666 72.704 72.704 0 0 1 30.622477 22.186667 73.508571 73.508571 0 0 1 10.678857 17.67619c3.169524 7.509333 5.12 15.652571 5.607619 24.210286L926.47619 243.809524v24.380952L559.469714 581.241905a73.142857 73.142857 0 0 1-91.306666 2.901333l-3.632762-2.925714L97.52381 268.190476v-24.380952a72.899048 72.899048 0 0 1 40.155428-65.292191A72.97219 72.97219 0 0 1 170.666667 170.666667h682.666666z"
                  p-id="3175"
                ></path>
              </svg>
              <div class="iconTip">Mail</div>
            </a>
            <a class="iconItem" href="#" @click.prevent="handlePop('/static/img/wxzsm.jpg')">
              <svg
                t="1705247464964"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4987"
              >
                <path
                  d="M995.575172 725.451034c-12.358621-26.835862-38.488276-64.794483-92.689655-94.27862-62.146207-33.721379-136.297931-40.96-208.860689-20.303448l-99.928276 28.424827-279.304828-126.057931H22.775172v489.401379h509.704828l432.375172-195.266207c15.006897-6.708966 26.835862-19.42069 32.662069-34.957241 5.649655-15.36 4.943448-31.955862-1.942069-46.962759z m-482.162758 188.910345H111.051034V601.688276h184.673104l166.664828 75.387586-3.354483 0.882759h-170.372414v88.275862H471.393103l246.819311-70.267586c49.434483-14.124138 101.517241-9.357241 142.653793 12.888275 18.184828 9.886897 30.72 20.833103 39.371034 30.896552l-386.824827 174.609655z"
                  p-id="4988"
                ></path>
                <path
                  d="M695.437241 163.486897l58.615173-142.30069h-397.24138l66.736552 143.36c-121.82069 53.142069-207.095172 174.433103-207.095172 315.674483 0 28.601379 3.531034 57.202759 10.593103 84.744827l85.627586-21.715862c-5.12-20.48-7.768276-41.666207-7.768275-63.028965 0-141.241379 114.758621-256 256-256s256 114.758621 256 256c0 51.023448-14.830345 100.104828-43.078621 142.300689l73.268965 49.08138c37.958621-56.673103 58.085517-122.88 58.085518-191.382069-0.176552-141.947586-86.686897-264.121379-209.743449-316.733793zM467.508966 91.983448h180.965517l-21.009655 50.846897a348.16 348.16 0 0 0-66.913104-6.708966c-23.834483 0-46.962759 2.471724-69.384827 7.062069l-23.657931-51.2z"
                  p-id="4989"
                ></path>
                <path
                  d="M683.431724 427.431724v-70.62069h-38.311724l30.190345-30.190344-49.964138-49.964138-62.49931 62.49931h-6.002759L494.344828 276.656552l-49.787587 49.964138 30.013793 30.190344h-38.311724v70.62069h88.275862v35.310345h-88.275862v70.62069h88.275862v52.965517h70.62069v-52.965517h88.275862v-70.62069h-88.275862v-35.310345z"
                  p-id="4990"
                ></path>
              </svg>
              <div class="iconTip">赞助</div>
            </a>
            <a class="iconItem" href="#" @click.prevent="handlePop('/static/img/qq.jpg')">
              <svg
                t="1712319361023"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="1861"
              >
                <path
                  d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z"
                  p-id="1862"
                ></path>
              </svg>
              <div class="iconTip">QQ</div>
            </a>
            <a class="switch" href="javascript:void(0)">
              <div class="onoffswitch">
                <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch" checked />
                <label class="onoffswitch-label" for="myonoffswitch">
                  <span class="onoffswitch-inner"></span>
                  <span class="onoffswitch-switch"></span>
                </label>
              </div>
            </a>
          </div>

          <div class="tanChiShe">
            <img id="tanChiShe" src="/static/svg/snake-Light.svg" alt="" />
          </div>
        </header>

        <div class="nix-content">
          <div class="title">
            <svg
              t="1705257422086"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1891"
            >
              <path
                d="M629.333333 202.666667v213.333333h277.333334v448h-512v-213.333333h-277.333334v-448h512z m213.333334 277.333333h-213.333334v170.666667h-170.666666v149.333333h384v-320z m-277.333334-213.333333h-384v320h213.333334v-170.666667h170.666666v-149.333333z m0 213.333333h-106.666666v106.666667h106.666666v-106.666667z"
                p-id="1892"
              ></path>
            </svg>
            site
          </div>
          <div class="projectList">
            <router-link class="projectItem a" to="/blog">
              <div class="projectItemLeft">
                <h1>博客</h1>
                <p>查看我的文章与笔记</p>
              </div>
              <div class="projectItemRight">
                <img src="/static/img/i1.png" alt="" />
              </div>
            </router-link>
            <router-link class="projectItem a" to="/about">
              <div class="projectItemLeft">
                <h1>关于我</h1>
                <p>个人简介与更多信息</p>
              </div>
              <div class="projectItemRight">
                <img src="/static/img/i2.png" alt="" />
              </div>
            </router-link>
            <router-link class="projectItem a" to="/animation">
              <div class="projectItemLeft">
                <h1>动画</h1>
                <p>我的动画与演示页面</p>
              </div>
              <div class="projectItemRight">
                <img src="/static/img/i4.png" alt="" />
              </div>
            </router-link>
            <a class="projectItem a" target="_blank" rel="noreferrer" href="https://github.com/NixumbraSolivagant">
              <div class="projectItemLeft">
                <h1>GitHub</h1>
                <p>我的代码仓库</p>
              </div>
              <div class="projectItemRight">
                <img src="/static/img/i3.png" alt="" />
              </div>
            </a>
          </div>
          <div class="title">
            <svg
              t="1705257823317"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="7833"
            >
              <path
                d="M395.765333 586.570667h-171.733333c-22.421333 0-37.888-22.442667-29.909333-43.381334L364.768 95.274667A32 32 0 0 1 394.666667 74.666667h287.957333c22.72 0 38.208 23.018667 29.632 44.064l-99.36 243.882666h187.050667c27.509333 0 42.186667 32.426667 24.042666 53.098667l-458.602666 522.56c-22.293333 25.408-63.626667 3.392-54.976-29.28l85.354666-322.421333zM416.714667 138.666667L270.453333 522.581333h166.869334a32 32 0 0 1 30.933333 40.181334l-61.130667 230.954666 322.176-367.114666H565.312c-22.72 0-38.208-23.018667-29.632-44.064l99.36-243.882667H416.714667z"
                p-id="7834"
              ></path>
            </svg>
            skills
          </div>
          <div class="skill">
            <img id="skillPc" src="/static/svg/skillPc.svg" alt="" />
            <img id="skillWap" src="/static/svg/skillWap.svg" alt="" />
          </div>
          <div class="title">
            <svg
              t="1705257422086"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1891"
            >
              <path
                d="M629.333333 202.666667v213.333333h277.333334v448h-512v-213.333333h-277.333334v-448h512z m213.333334 277.333333h-213.333334v170.666667h-170.666666v149.333333h384v-320z m-277.333334-213.333333h-384v320h213.333334v-170.666667h170.666666v-149.333333z m0 213.333333h-106.666666v106.666667h106.666666v-106.666667z"
                p-id="1892"
              ></path>
            </svg>
            github
          </div>
          <div class="github-heatmap" style="display: flex; justify-content: center;">
            <img
              src="https://ghchart.rshah.org/NixumbraSolivagant"
              alt="GitHub contribution heatmap"
              style="width: 100%; max-width: 920px; border-radius: 12px;"
            />
          </div>
        </div>
      </div>
    </div>
    <footer></footer>
    <div class="tc">
      <div class="tc-main">
        <img class="tc-img" src="" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from 'vue'

const handlePop = imageUrl => {
  if (typeof window !== 'undefined' && typeof window.pop === 'function') {
    window.pop(imageUrl)
  }
}

const mediaModules = import.meta.glob('/public/static/media/*.{png,jpg,jpeg,webp,gif,mp4,webm}', {
  eager: true,
  as: 'url',
})

const backgroundMedia = Object.values(mediaModules)
  .map(url => {
    const normalized = typeof url === 'string' ? url.replace('/public', '') : ''
    const lower = normalized.toLowerCase()
    const isVideo = lower.endsWith('.mp4') || lower.endsWith('.webm')
    return {
      type: isVideo ? 'video' : 'image',
      src: normalized,
    }
  })
  .filter(item => item.src)
  .sort((a, b) => a.src.localeCompare(b.src))

let backgroundIndex = 0
let backgroundTimer = null
let threeBodyFrame = null
let threeBodyResize = null

const applyBackground = media => {
  const root = document.documentElement
  const video = document.getElementById('background-video')
  if (media.type === 'video') {
    root.style.setProperty('--main_bg_color', 'none')
    if (video) {
      video.style.display = 'block'
      if (video.getAttribute('src') !== media.src) {
        video.setAttribute('src', media.src)
        video.load()
      }
      video.play().catch(() => {})
    }
    root.style.setProperty('--main_text_color', '#f8fafc')
    root.style.setProperty('--item_left_title_color', '#f8fafc')
    root.style.setProperty('--item_left_text_color', '#e2e8f0')
    root.style.setProperty('--footer_text_color', '#e2e8f0')
    root.style.setProperty('--fill', '#ffffff')
    root.style.setProperty('--text_bg_color', 'rgba(0, 0, 0, 0.45)')
    root.style.setProperty('--item_bg_color', 'rgba(15, 23, 42, 0.52)')
    root.style.setProperty('--item_hover_color', 'rgba(15, 23, 42, 0.65)')
    root.style.setProperty('--left_tag_item', 'rgba(15, 23, 42, 0.55)')
    root.style.setProperty('--back_filter_color', 'rgba(0, 0, 0, 0.35)')
    return
  }
  if (video) {
    video.pause()
    video.style.display = 'none'
  }
  root.style.setProperty('--main_bg_color', `url(${media.src})`)
  updateTextColorFromBackground(`url(${media.src})`)
}

const startBackgroundRotation = () => {
  if (!backgroundMedia.length) return
  applyBackground(backgroundMedia[backgroundIndex])
  backgroundTimer = window.setInterval(() => {
    backgroundIndex = (backgroundIndex + 1) % backgroundMedia.length
    applyBackground(backgroundMedia[backgroundIndex])
  }, 12000)
}

const startThreeBodySimulation = () => {
  const canvas = document.getElementById('three-body-canvas')
  if (!(canvas instanceof HTMLCanvasElement)) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const resize = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  resize()
  threeBodyResize = resize
  window.addEventListener('resize', resize)

  const createPoint = (center = null) => {
    const width = canvas.width / dpr
    const height = canvas.height / dpr
    const depth = 600
    const spread = 140
    const origin = center ?? {
      x: width * (0.45 + Math.random() * 0.1),
      y: height * (0.45 + Math.random() * 0.1),
      z: (Math.random() - 0.5) * (depth * 0.3),
    }
    return {
      x: origin.x + (Math.random() - 0.5) * spread,
      y: origin.y + (Math.random() - 0.5) * spread,
      z: origin.z + (Math.random() - 0.5) * spread,
      dx: (Math.random() - 0.5) * 1.4,
      dy: (Math.random() - 0.5) * 1.4,
      dz: (Math.random() - 0.5) * 1.2,
      m: 80 + Math.random() * 80,
    }
  }

  const clusterCenter = {
    x: (canvas.width / dpr) * 0.5,
    y: (canvas.height / dpr) * 0.5,
    z: 0,
  }
  const points = [createPoint(clusterCenter), createPoint(clusterCenter), createPoint(clusterCenter)]
  const g = 0.08
  const minDistance = 80
  const depth = 600
  const fov = 500
  const margin = 120

  const step = () => {
    const width = canvas.width / dpr
    const height = canvas.height / dpr
    const cx = width / 2
    const cy = height / 2
    const time = performance.now() * 0.001
    ctx.clearRect(0, 0, width, height)

    points.forEach(p => {
      points.forEach(other => {
        if (p === other) return
        const dx = other.x - p.x
        const dy = other.y - p.y
        const dz = other.z - p.z
        const r2 = dx * dx + dy * dy + dz * dz
        const dist = Math.max(Math.sqrt(r2), minDistance)
        const k = g * other.m / (dist * dist * dist)
        p.dx += k * dx
        p.dy += k * dy
        p.dz += k * dz
      })
    })

    points.forEach((p, index) => {
      p.x += p.dx
      p.y += p.dy
      p.z += p.dz

      if (
        p.x < -margin ||
        p.x > width + margin ||
        p.y < -margin ||
        p.y > height + margin ||
        p.z < -depth ||
        p.z > depth
      ) {
        points[index] = createPoint()
        return
      }

      const scale = fov / (fov + p.z)
      const px = (p.x - cx) * scale + cx
      const py = (p.y - cy) * scale + cy
      const r = Math.max(16, (Math.sqrt(p.m) / 0.9) * scale)
      const alpha = Math.min(1, Math.max(0.4, 0.6 * scale))
      const hue = (time * 40 + index * 120) % 360
      ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${alpha})`
      ctx.shadowColor = `hsla(${hue}, 100%, 60%, 0.85)`
      ctx.shadowBlur = 44 * scale
      ctx.beginPath()
      ctx.arc(px, py, r, 0, Math.PI * 2)
      ctx.fill()
    })

    threeBodyFrame = requestAnimationFrame(step)
  }

  step()
}

const updateTextColorFromBackground = (imageUrl = '') => {
  const root = document.documentElement
  const source = imageUrl || getComputedStyle(root).getPropertyValue('--main_bg_color').trim()
  const urlMatch = source.match(/url\((['"]?)(.*?)\1\)/)
  if (!urlMatch) return

  const image = new Image()
  image.crossOrigin = 'anonymous'
  image.src = urlMatch[2]
  image.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const size = 40
    canvas.width = size
    canvas.height = size
    ctx.drawImage(image, 0, 0, size, size)
    const { data } = ctx.getImageData(0, 0, size, size)
    let total = 0
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      total += 0.2126 * r + 0.7152 * g + 0.0722 * b
    }
    const brightness = total / (data.length / 4)
    const isDark = brightness < 140
    root.style.setProperty('--main_text_color', isDark ? '#f8fafc' : '#111827')
    root.style.setProperty('--item_left_title_color', isDark ? '#f8fafc' : '#111827')
    root.style.setProperty('--item_left_text_color', isDark ? '#e2e8f0' : '#4b5563')
    root.style.setProperty('--footer_text_color', isDark ? '#e2e8f0' : '#374151')
    root.style.setProperty('--fill', isDark ? '#ffffff' : '#111827')
    root.style.setProperty('--text_bg_color', isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(255, 255, 255, 0.7)')
    root.style.setProperty('--item_bg_color', isDark ? 'rgba(15, 23, 42, 0.52)' : 'rgba(255, 255, 255, 0.72)')
    root.style.setProperty('--item_hover_color', isDark ? 'rgba(15, 23, 42, 0.65)' : 'rgba(255, 255, 255, 0.85)')
    root.style.setProperty('--left_tag_item', isDark ? 'rgba(15, 23, 42, 0.55)' : 'rgba(255, 255, 255, 0.7)')
    root.style.setProperty('--back_filter_color', isDark ? 'rgba(0, 0, 0, 0.35)' : 'rgba(255, 255, 255, 0.2)')
  }
}

onMounted(() => {
  if (!document.querySelector('script[data-nix-script]')) {
    const script = document.createElement('script')
    script.src = '/static/js/script.js'
    script.dataset.nixScript = 'true'
    document.body.appendChild(script)
  }
  startBackgroundRotation()
  startThreeBodySimulation()
})

onBeforeUnmount(() => {
  if (backgroundTimer) {
    clearInterval(backgroundTimer)
  }
  if (threeBodyFrame) {
    cancelAnimationFrame(threeBodyFrame)
  }
  if (threeBodyResize) {
    window.removeEventListener('resize', threeBodyResize)
  }
})
</script>
