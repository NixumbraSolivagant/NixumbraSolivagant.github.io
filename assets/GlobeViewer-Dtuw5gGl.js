import{r as g,o as W,I as Z,a as Y,c as A,d as b,e as o,f as I,w as N,B as P,C as J,G as D,T as B}from"./vendor-vue-O6NerEKm.js";import{u as X}from"./index-DIUNL9Fv.js";import{S as Q,P as q,W as $,A as ee,E as te,R as se,U as ae,V as re,a as ie,D as ne,G as oe,b as j,M as y,c as k,d as le,e as G,B as ce,f as he,F as ue,g as de,h as me,O as pe,C as fe,i as ve,j as ge,k as z,l as _e,m as F,n as ye,T as we,o as Me}from"./vendor-three-D03lKPrS.js";import{_ as xe}from"./_plugin-vue_export-helper-D-BgB3Xh.js";const w={day:["https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_atmos_2048.jpg","https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"],night:["https://unpkg.com/three-globe/example/img/earth-night.jpg","https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg"],normal:["https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_normal_2048.jpg","https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg"],specular:["https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_specular_2048.jpg","https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg"],clouds:["https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_clouds_1024.png","https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png"]},Se=`
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv    = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Ee=`
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
`,Ae=`
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,be=`
  varying vec3 vNormal;
  void main() {
    float intensity = pow(1.0 - dot(vNormal, vec3(0, 0, 1.0)), 3.5);
    gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity * 0.6;
  }
`;function Ge(l,e,s=1.01){const a=(90-l)*(Math.PI/180),r=(e+180)*(Math.PI/180);return new F(-(s*Math.sin(a)*Math.cos(r)),s*Math.cos(a),s*Math.sin(a)*Math.sin(r))}function M(l){return new Promise((e,s)=>{const a=Array.isArray(l)?[...l]:[l];let r=0;function n(){if(r>=a.length){s(new Error("[EarthRenderer] All texture sources failed"));return}const t=a[r++];new we().load(t,i=>{i.colorSpace=Me,e(i)},void 0,()=>{console.warn(`[EarthRenderer] texture load failed from ${t}, trying fallback`),n()})}n()})}class Le{constructor(e){this.canvas=e,this._markers=[],this._destroyed=!1,this._active=!0,this._raf=null,this._sunLon=0,this._sunDriftSpeed=.3,this._init()}_init(){const{canvas:e}=this;this.scene=new Q;const s=e.clientWidth/e.clientHeight||1;this.camera=new q(35,s,.1,1e3),this.camera.position.set(2.5,1.5,3.5),this.renderer=new $({canvas:e,antialias:!0,alpha:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(e.clientWidth,e.clientHeight),this.renderer.toneMapping=ee,this.renderer.toneMappingExposure=1,this.composer=new te(this.renderer),this.composer.addPass(new se(this.scene,this.camera)),this.bloomPass=new ae(new re(e.clientWidth,e.clientHeight),1.8,.6,.6),this.composer.addPass(this.bloomPass),this.scene.add(new ie(16777215,.05)),this.sunLight=new ne(16777215,3),this.sunLight.position.set(5,3,5),this.scene.add(this.sunLight),this.earthGroup=new oe,this.scene.add(this.earthGroup),this._setupAsync()}async _setupAsync(){try{const[e,s,a,r,n]=await Promise.all([M(w.day),M(w.night),M(w.normal),M(w.specular),M(w.clouds)]);this.earthMat=new j({vertexShader:Se,fragmentShader:Ee,uniforms:{uDay:{value:e},uNight:{value:s},uNormal:{value:a},uSpecular:{value:r},uSunLon:{value:this._sunLon},uSunLat:{value:0}}});const t=new y(new k(1,64,64),this.earthMat);this.earthGroup.add(t);const i=new le({map:n,transparent:!0,opacity:.5,blending:G,depthWrite:!1});this.cloudMesh=new y(new k(1.012,64,64),i),this.earthGroup.add(this.cloudMesh);const h=new j({vertexShader:Ae,fragmentShader:be,blending:G,side:ce,transparent:!0,depthWrite:!1});this.scene.add(new y(new k(1.03,64,64),h));const d=Array.from({length:6e3},()=>[(Math.random()-.5)*200,(Math.random()-.5)*200,(Math.random()-.5)*200]).flat(),p=new he;p.setAttribute("position",new ue(d,3)),this.scene.add(new de(p,new me({color:16777215,size:.1,transparent:!0,opacity:.6}))),this.controls=new pe(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.enablePan=!1,this.controls.enableZoom=!1,this.controls.rotateSpeed=.6,this._onResize=()=>{const c=this.canvas.clientWidth,f=this.canvas.clientHeight;this.camera.aspect=c/f,this.camera.updateProjectionMatrix(),this.renderer.setSize(c,f),this.composer.setSize(c,f),this.bloomPass.resolution.set(c,f)},window.addEventListener("resize",this._onResize),this.clock=new fe,this._animate()}catch(e){console.error("[EarthRenderer] texture load failed:",e)}}_animate(){var s;if(this._destroyed||!this._active){this._raf=null;return}this._raf=requestAnimationFrame(()=>this._animate());const e=this.clock.getElapsedTime();this._sunLon=(this._sunLon+this._sunDriftSpeed*.016)%360,this.earthMat&&(this.earthMat.uniforms.uSunLon.value=this._sunLon),this.earthGroup.rotation.y+=8e-4,this.cloudMesh&&(this.cloudMesh.rotation.y+=2e-4),this._markers.forEach(a=>{const r=e%2/2;if(a._ring){const n=1+r*.6;a._ring.scale.set(n,n,n),a._ring.material.opacity=1-r*.6}a._pillar&&(a._pillar.material.opacity=.35+Math.sin(r*Math.PI)*.45)}),(s=this.controls)==null||s.update(),this.composer.render()}setActive(e){if(!(this._destroyed||this._active===e)){if(this._active=e,!e){cancelAnimationFrame(this._raf),this._raf=null;return}this.clock&&this._raf===null&&this._animate()}}setVisitorMarkers(e){this._markers.forEach(a=>{this.earthGroup.remove(a._ring),this.earthGroup.remove(a._pillar)}),this._markers=[];const s=new ve(43775);e.forEach(a=>{const r=Ge(a.lat,a.lon),n=new y(new ge(.01,.025,32),new z({color:s,side:_e,transparent:!0,blending:G}));n.position.copy(r),n.lookAt(new F(0,0,0)),this.earthGroup.add(n);const t=new y(new ye(.001,.006,.2,16),new z({color:s,transparent:!0,opacity:.6,blending:G}));t.geometry.translate(0,.1,0),t.geometry.rotateX(Math.PI/2),t.position.copy(r),t.lookAt(r.clone().multiplyScalar(2)),this.earthGroup.add(t),this._markers.push({...a,_ring:n,_pillar:t})})}destroy(){var e,s,a,r,n;this._destroyed||(this._destroyed=!0,this._active=!1,cancelAnimationFrame(this._raf),this._markers&&(this._markers.forEach(t=>{var i,h,d,p;(i=t._ring)==null||i.geometry.dispose(),(h=t._ring)==null||h.material.dispose(),(d=t._pillar)==null||d.geometry.dispose(),(p=t._pillar)==null||p.material.dispose()}),this._markers=[]),(e=this.scene)==null||e.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(i=>{i.map&&i.map.dispose(),i.uniforms&&Object.values(i.uniforms).forEach(h=>{var d;(d=h.value)!=null&&d.dispose&&h.value.dispose()}),i.dispose()}):(t.material.map&&t.material.map.dispose(),t.material.uniforms&&Object.values(t.material.uniforms).forEach(i=>{var h;(h=i.value)!=null&&h.dispose&&i.value.dispose()}),t.material.dispose()))}),(s=this.earthMat)!=null&&s.uniforms&&Object.values(this.earthMat.uniforms).forEach(t=>{var i;(i=t.value)!=null&&i.dispose&&t.value.dispose()}),(a=this.controls)==null||a.dispose(),(r=this.composer)==null||r.dispose(),(n=this.renderer)==null||n.dispose(),this._onResize&&window.removeEventListener("resize",this._onResize))}}async function Te(l=10){return console.warn("[Umami] VITE_UMAMI_API_KEY or VITE_UMAMI_WEBSITE_ID not set — using mock data"),Ce()}async function Re(l=10){return(await Te(l)).sort((s,a)=>a.y-s.y)}function Ce(){return[{x:"CN",y:412},{x:"US",y:287},{x:"JP",y:156},{x:"DE",y:98},{x:"BR",y:73},{x:"IN",y:54},{x:"AU",y:41},{x:"FR",y:38},{x:"RU",y:29},{x:"GB",y:24}]}const H={AD:[42.5,1.5],AE:[24,54],AF:[33,65],AG:[17.1,-61.8],AL:[41,20],AM:[40,45],AO:[-12.5,18.5],AR:[-34,-64],AT:[47.3,13.3],AU:[-25,134],AZ:[40.5,47.5],BA:[44,18],BB:[13.2,-59.5],BD:[24,90],BE:[50.8,4],BF:[13,-1],BG:[43,25],BH:[26,50.5],BI:[-3.4,30],BJ:[9.5,2.2],BN:[4.5,114.7],BO:[-17,-65],BR:[-10,-55],BS:[25,-76],BT:[27.5,90.5],BW:[-22,24],BY:[53,28],BZ:[17.2,-88.5],CA:[60,-96],CD:[-4,21],CF:[7,21],CG:[-1,15],CH:[47,8],CI:[8,-5],CL:[-30,-71],CM:[6,12],CN:[35,105],CO:[4,-72],CR:[10,-84],CU:[22,-79],CY:[35,33],CZ:[49.8,15.5],DE:[51,10],DJ:[11.6,43],DK:[56,10],DM:[15.4,-61.4],DO:[19,-70.7],DZ:[28,3],EC:[-2,-77.5],EE:[59,26],EG:[27,30],ER:[15.2,39.5],ES:[40,-4],ET:[9,40],FI:[64,26],FJ:[-18,175],FR:[46,2],GA:[-1,11.8],GB:[55,-3],GD:[12.1,-61.7],GE:[42,43.5],GH:[8,-1],GL:[72,-40],GM:[13.4,-15.3],GN:[11,-10],GQ:[2,10],GR:[39,22],GT:[15.5,-90.2],GW:[12,-15],GY:[6,-59],HN:[15.2,-86.2],HR:[45.2,15.5],HT:[19,-72.4],HU:[47,20],ID:[-5,120],IE:[53,-8],IL:[31.5,34.9],IN:[20,78],IQ:[33,44],IR:[32,53],IS:[65,-18],IT:[42.8,12.6],JM:[18.2,-77.5],JO:[31,36],JP:[36,138],KE:[1,38],KG:[41.2,75],KH:[13,105],KI:[1.9,-157.4],KM:[-12.2,44.4],KN:[17.3,-62.7],KP:[40,127],KR:[37.5,127.9],KW:[29.5,47.7],KZ:[48,67],LA:[18,103],LB:[33.9,35.9],LC:[13.9,-60.9],LI:[47.2,9.5],LK:[7,81],LR:[6.5,-9.4],LS:[-29.5,28.2],LT:[55.2,23.9],LU:[49.8,6.1],LV:[56.9,24.6],LY:[27,17],MA:[32,-6],MC:[43.7,7.4],MD:[47,29],ME:[42.5,19.3],MG:[-19.3,46.7],MK:[41.5,22],ML:[17,-4],MM:[22,98],MN:[46,105],MO:[22.3,113.5],MR:[20,-11],MT:[35.9,14.4],MU:[-20.2,57.5],MV:[3.2,73],MW:[-13.5,34],MX:[23,-102],MY:[3,109],MZ:[-18.7,35.5],NA:[-22,17],NE:[16,8],NG:[10,8],NI:[13,-85],NL:[52.5,5.7],NO:[62,10],NP:[28,84],NZ:[-41,174],OM:[21,57],PA:[9,-80],PE:[-10,-76],PG:[-6,147],PH:[13,122],PK:[30.4,69.3],PL:[51.9,19.1],PR:[18.2,-66.5],PT:[39.4,-8.2],PY:[-23,-58],QA:[25.3,51.2],RO:[46,25],RS:[44,21],RU:[60,100],RW:[-2,30],SA:[25,45],SB:[-9.5,160],SC:[-4.6,55.5],SD:[15.5,32.5],SE:[62,17],SG:[1.4,103.8],SI:[46.1,15.2],SK:[48.7,19.7],SL:[8.5,-11.5],SN:[14,-14],SO:[10,49],SR:[4,-56],SS:[7,30],SV:[13.8,-88.9],SY:[35,38],SZ:[-26.5,31.5],TD:[15,19],TG:[8.6,.8],TH:[15.9,100.9],TJ:[39,71],TL:[-8.6,125.7],TM:[40,60],TN:[34,9],TO:[-21.2,-175.2],TR:[39,35.2],TT:[11,-61],TZ:[-6.4,35],UA:[49,32],UG:[1.4,32.3],US:[38,-97],UY:[-33,-56],UZ:[41,64],VC:[13.3,-61.2],VE:[8,-66],VN:[16,108],VU:[-16,167],WS:[-13.8,-172.1],XK:[42.6,20.9],YE:[15.5,48.5],ZA:[-29,25],ZM:[-14.3,28.3],ZW:[-19,29.7]};function Ie(l){if(!l||l.length===0)return[];const e=Math.max(...l.map(s=>s.y));return e===0?[]:l.filter(s=>s.x&&H[s.x]).map(s=>({location:H[s.x],size:s.y/e,count:s.y}))}const Ne={class:"gv-wrap"},Pe={key:0,class:"gv-error"},De={class:"gv-hud"},Be={class:"hud-meta"},ke={class:"hud-text"},Ve={class:"hud-text-sub"},Ue={key:0,class:"gv-loading"},Oe={key:0,class:"gv-hint"},je={__name:"GlobeViewer",props:{refreshInterval:{type:Number,default:6e4}},setup(l,{expose:e}){const s=l,{t:a}=X(),r=g(null),n=g(null),t=g(!1),i=g(!1),h=g(!1),d=g(0),p=g(0);let c=null,f=null,_=null,x=null,L=!0;function V(){h.value=!0}async function T(){try{const u=await Re(20);if(!u.length)return;d.value=u.reduce((v,E)=>v+E.y,0),p.value=u.length;const S=Ie(u).map(v=>({lat:v.location[0],lon:v.location[1],count:v.count??0,normSize:v.size??0}));c&&c.setVisitorMarkers(S)}catch(u){console.warn("[GlobeViewer] load failed:",u)}}function U(){clearInterval(f),f=null}function K(){f||s.refreshInterval<=0||document.hidden||!L||(f=setInterval(T,s.refreshInterval))}function R(){const u=L&&!document.hidden;c==null||c.setActive(u),u?K():U()}return W(async()=>{var S,v,E,O;await Z();const u=((S=r.value)==null?void 0:S.clientWidth)??0,m=((v=r.value)==null?void 0:v.clientHeight)??0;if(u===0||m===0){i.value=!0;return}try{c=new Le(r.value),(E=r.value)==null||E.addEventListener("mousedown",V),(O=r.value)==null||O.addEventListener("touchstart",V,{passive:!0}),t.value=!0,await T(),"IntersectionObserver"in window&&n.value&&(_=new IntersectionObserver(([C])=>{L=C.isIntersecting,R()},{threshold:.01}),_.observe(n.value)),x=R,document.addEventListener("visibilitychange",x),R()}catch(C){console.error("[GlobeViewer] init failed:",C),i.value=!0}}),Y(()=>{U(),_==null||_.disconnect(),x&&document.removeEventListener("visibilitychange",x),c==null||c.destroy(),c=null}),e({reload:T}),(u,m)=>(A(),b("div",Ne,[o("div",{class:"gv-viewport",ref_key:"viewportEl",ref:n},[I(B,{name:"fade"},{default:N(()=>[i.value?(A(),b("div",Pe,[m[0]||(m[0]=o("span",{class:"gv-error-icon"},[o("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[o("circle",{cx:"12",cy:"12",r:"10"}),o("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),o("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})])],-1)),o("span",null,P(J(a)("common.globeError")),1)])):D("",!0)]),_:1}),o("div",De,[m[2]||(m[2]=o("div",{class:"hud-inner"},[o("span",{class:"hud-label"},"GEO-SYS"),o("span",{class:"hud-sep"},"//"),o("span",{class:"hud-label-sub"},"VISITOR MAP")],-1)),o("div",Be,[m[1]||(m[1]=o("span",{class:"hud-live-dot"},null,-1)),o("span",ke,P(d.value>0?d.value.toLocaleString():"—"),1),o("span",Ve,"visits · "+P(p.value>0?p.value:"—")+" countries",1)])]),I(B,{name:"fade"},{default:N(()=>[!t.value&&!i.value?(A(),b("div",Ue,m[3]||(m[3]=[o("div",{class:"gv-ring"},null,-1)]))):D("",!0)]),_:1}),o("canvas",{ref_key:"canvasEl",ref:r,class:"gv-canvas"},null,512),I(B,{name:"fade"},{default:N(()=>[t.value&&!h.value?(A(),b("div",Oe," Drag to rotate · Visit locations worldwide ")):D("",!0)]),_:1})],512)]))}},We=xe(je,[["__scopeId","data-v-fcf0a4e5"]]);export{We as default};
