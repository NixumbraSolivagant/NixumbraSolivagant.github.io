/**
 * ThreeGlobe — 修复版
 * 重点修复：Marker 坐标精度、朝向算法、缩放动画逻辑
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const BASE_URL = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/';
const TEX_CONFIG = {
    day: BASE_URL + 'earth_atmos_2048.jpg',
    normal: BASE_URL + 'earth_normal_2048.jpg',
    specular: BASE_URL + 'earth_specular_2048.jpg',
    clouds: BASE_URL + 'earth_clouds_1024.png',
    night: 'https://unpkg.com/three-globe/example/img/earth-night.jpg'
};

const GLOBE_RADIUS = 1.0;

export class ThreeGlobe {
    constructor(canvas) {
        this._canvas = canvas;
        this._rafId = null;
        this._destroyed = false;
        this._markers = [];
        this._mode = 'day';

        this._textures = { day: null, night: null };

        this._initScene();
        this._initPostProcessing();
        this._initLights();
        this._initGlobe();
        this._initClouds();
        this._initAtmosphere();
        this._initStars();
        this._initMarkerSystem();
        this._initControls();

        this._onResize = this._onResize.bind(this);
        window.addEventListener('resize', this._onResize);
        this._onResize();

        this._animate = this._animate.bind(this);
        this._animate();
    }

    _initScene() {
        this._renderer = new THREE.WebGLRenderer({
            canvas: this._canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
        });
        this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this._renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this._renderer.toneMappingExposure = 1.2;

        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        this._camera.position.set(0, 0, 3.0);
    }

    _initPostProcessing() {
        this._composer = new EffectComposer(this._renderer);
        this._composer.addPass(new RenderPass(this._scene, this._camera));

        this._bloomPass = new UnrealBloomPass(
            new THREE.Vector2(this._canvas.clientWidth, this._canvas.clientHeight),
            0.15, 0.4, 0.85
        );
        this._composer.addPass(this._bloomPass);
    }

    _initLights() {
        this._ambient = new THREE.AmbientLight(0xffffff, 0.1);
        this._scene.add(this._ambient);

        this._sun = new THREE.DirectionalLight(0xffffff, 3.5);
        this._sun.position.set(5, 3, 5);
        this._scene.add(this._sun);
    }

    _initGlobe() {
        const geo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
        this._mat = new THREE.MeshPhongMaterial({
            shininess: 20,
            color: 0xffffff,
        });
        this._earthMesh = new THREE.Mesh(geo, this._mat);
        // 关键：为了让坐标对准贴图，地球通常不需要初始旋转
        this._scene.add(this._earthMesh);

        this._loadTextures();
    }

    async _loadTextures() {
        const loader = new THREE.TextureLoader();
        const load = (url) => new Promise((res) => loader.load(url, (t) => {
            t.colorSpace = THREE.SRGBColorSpace;
            res(t);
        }));

        try {
            const [day, night, normal, specular] = await Promise.all([
                load(TEX_CONFIG.day),
                load(TEX_CONFIG.night),
                load(TEX_CONFIG.normal),
                load(TEX_CONFIG.specular)
            ]);

            if (this._destroyed) return;

            this._textures.day = day;
            this._textures.night = night;

            this._mat.map = day;
            this._mat.normalMap = normal;
            this._mat.specularMap = specular;
            this._mat.needsUpdate = true;
        } catch (e) {
            console.error('Globe textures load failed', e);
        }
    }

    _initClouds() {
        const geo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.01, 64, 64);
        const mat = new THREE.MeshLambertMaterial({
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        this._cloudMesh = new THREE.Mesh(geo, mat);
        this._scene.add(this._cloudMesh);

        new THREE.TextureLoader().load(TEX_CONFIG.clouds, (t) => {
            if (this._destroyed) return;
            mat.map = t;
            mat.needsUpdate = true;
        });
    }

    _initAtmosphere() {
        const mat = new THREE.ShaderMaterial({
            uniforms: {
                glowColor: { value: new THREE.Color(0x4488ff) },
                viewVector: { value: this._camera.position }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                uniform vec3 glowColor;
                void main() {
                    float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
                    gl_FragColor = vec4(glowColor, 1.0) * intensity;
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        });
        this._atmosphere = new THREE.Mesh(new THREE.SphereGeometry(GLOBE_RADIUS * 1.05, 64, 64), mat);
        this._scene.add(this._atmosphere);
    }

    _initStars() {
        const verts = [];
        for (let i = 0; i < 6000; i++) {
            verts.push((Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
        this._scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xaaaaaa, size: 0.15, transparent: true, opacity: 0.6 })));
    }

    _initMarkerSystem() {
        this._markerGroup = new THREE.Group();
        // 核心：MarkerGroup 必须是 EarthMesh 的子对象，才能跟随自转
        this._earthMesh.add(this._markerGroup);
    }

    /**
     * 修复后的经纬度转 Vector3 公式
     * 标准映射：lat=0, lon=0 指向经纬度交点（通常是贴图中心）
     */
    _latLonToVec3(lat, lon, radius) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        return new THREE.Vector3(
            -radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta)
        );
    }

    addVisitorMarker(lat, lon, size = 1.0, color = 0x00aaff) {
        // 将 Marker 放置在略高于地表的位置 (1.02) 防止闪烁
        const pos = this._latLonToVec3(lat, lon, GLOBE_RADIUS * 1.01);
        
        const group = new THREE.Group();
        group.position.copy(pos);
        
        // 关键：让 Marker 正确垂直于球面
        const targetPos = pos.clone().multiplyScalar(2);
        group.lookAt(targetPos);

        // 核心点
        const core = new THREE.Mesh(
            new THREE.SphereGeometry(0.01 * size, 16, 16),
            new THREE.MeshBasicMaterial({ color })
        );
        
        // 脉冲环 (默认平铺在 XY 平面，因为 group 已经 lookAt 了，所以它会自动垂直于球心)
        const ringGeo = new THREE.RingGeometry(0.015 * size, 0.035 * size, 32);
        const ringMat = new THREE.MeshBasicMaterial({ 
            color, 
            transparent: true, 
            side: THREE.DoubleSide, 
            blending: THREE.AdditiveBlending 
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);

        // 垂直光柱
        const pillarHeight = 0.2 * size;
        const pillarGeo = new THREE.CylinderGeometry(0.001 * size, 0.003 * size, pillarHeight, 12);
        // 修正光柱中心点到基部，使其从地面升起
        pillarGeo.translate(0, pillarHeight / 2, 0);
        pillarGeo.rotateX(Math.PI / 2); // 旋转使其沿 Z 轴（指向球外）伸展
        const pillar = new THREE.Mesh(pillarGeo, new THREE.MeshBasicMaterial({ 
            color, 
            transparent: true, 
            opacity: 0.6, 
            blending: THREE.AdditiveBlending 
        }));

        group.add(core, ring, pillar);
        this._markerGroup.add(group);
        
        const markerObj = { group, ring, pillar, size };
        this._markers.push(markerObj);
        return markerObj;
    }

    updateMarkers(elapsed) {
        this._markers.forEach(m => {
            // 环形脉冲效果
            const speed = 1.2;
            const cycle = (elapsed * speed) % 1.0;
            
            const s = 1.0 + cycle * 2.5;
            m.ring.scale.set(s, s, 1);
            m.ring.material.opacity = (1.0 - cycle) * 0.8;

            // 光柱轻微呼吸
            m.pillar.material.opacity = 0.3 + Math.sin(elapsed * 5) * 0.2;
        });
    }

    setMode(mode) {
        if (!this._textures.night) return;
        this._mode = mode;

        if (mode === 'night') {
            this._mat.map = this._textures.night;
            this._mat.emissiveMap = this._textures.night;
            this._mat.emissive = new THREE.Color(0xffffff);
            this._mat.emissiveIntensity = 2.0;
            this._sun.intensity = 0.1;
            this._ambient.intensity = 0.02;
            this._bloomPass.strength = 1.6;
        } else {
            this._mat.map = this._textures.day;
            this._mat.emissiveMap = null;
            this._mat.emissiveIntensity = 0;
            this._sun.intensity = 3.5;
            this._ambient.intensity = 0.1;
            this._bloomPass.strength = 0.15;
        }
        this._mat.needsUpdate = true;
    }

    project(lat, lon) {
        const pos = this._latLonToVec3(lat, lon, GLOBE_RADIUS);
        // 必须应用父级（地球）的世界矩阵
        pos.applyMatrix4(this._earthMesh.matrixWorld);

        const vector = pos.clone().project(this._camera);
        
        return {
            x: (vector.x + 1) * 0.5 * this._canvas.clientWidth,
            y: (1 - vector.y) * 0.5 * this._canvas.clientHeight,
            visible: vector.z < 1.0
        };
    }

    _onResize() {
        const w = this._canvas.clientWidth;
        const h = this._canvas.clientHeight;
        this._renderer.setSize(w, h, false);
        this._composer.setSize(w, h);
        this._camera.aspect = w / h;
        this._camera.updateProjectionMatrix();
    }

    _animate() {
        if (this._destroyed) return;
        this._rafId = requestAnimationFrame(this._animate);

        const time = performance.now() * 0.001;
        this._controls.update();

        // 整体自转
        this._earthMesh.rotation.y += 0.001;
        this._cloudMesh.rotation.y += 0.0012;
        
        this.updateMarkers(time);
        this._composer.render();
    }

    _initControls() {
        this._controls = new OrbitControls(this._camera, this._canvas);
        this._controls.enableDamping = true;
        this._controls.dampingFactor = 0.05;
        this._controls.minDistance = 1.3;
        this._controls.maxDistance = 6;
        this._controls.enablePan = false;
    }

    destroy() {
        this._destroyed = true;
        cancelAnimationFrame(this._rafId);
        window.removeEventListener('resize', this._onResize);

        this._scene.traverse(node => {
            if (node.isMesh || node.isPoints) {
                node.geometry?.dispose();
                if (node.material) {
                    const materials = Array.isArray(node.material) ? node.material : [node.material];
                    materials.forEach(m => {
                        m.dispose();
                        for (const key in m) {
                            if (m[key] && m[key].isTexture) m[key].dispose();
                        }
                    });
                }
            }
        });

        this._composer.dispose();
        this._renderer.dispose();
        this._controls.dispose();
    }
}