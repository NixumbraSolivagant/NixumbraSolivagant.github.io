import{r as g,o as O,I as j,a as z,d as S,e as E,f as i,g as T,w as L,C as R,D as K,K as b,T as C}from"./vendor-vue-sPE1gyLd.js";import{u as H}from"./index-BqaxsE9p.js";import{S as W,P as F,W as Z,A as Y,E as J,R as X,U as Q,V as q,a as $,D as ee,G as te,b as P,M as _,c as N,d as se,e as A,B as ae,f as re,F as oe,g as ne,h as ie,O as le,C as ce,i as he,j as ue,k as B,l as de,m as V,n as me,T as pe,o as fe}from"./vendor-three-D03lKPrS.js";import{_ as ve}from"./_plugin-vue_export-helper-BHfI105I.js";import"./vendor-md-CbOEWtDE.js";const y={day:["https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_atmos_2048.jpg","https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"],night:["https://unpkg.com/three-globe/example/img/earth-night.jpg","https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg"],normal:["https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_normal_2048.jpg","https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg"],specular:["https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_specular_2048.jpg","https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg"],clouds:["https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_clouds_1024.png","https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png"]},ge=`
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv    = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,_e=`
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
`,ye=`
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,we=`
  varying vec3 vNormal;
  void main() {
    float intensity = pow(1.0 - dot(vNormal, vec3(0, 0, 1.0)), 3.5);
    gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity * 0.6;
  }
`;function Me(l,s,t=1.01){const a=(90-l)*(Math.PI/180),r=(s+180)*(Math.PI/180);return new V(-(t*Math.sin(a)*Math.cos(r)),t*Math.cos(a),t*Math.sin(a)*Math.sin(r))}function w(l){return new Promise((s,t)=>{const a=Array.isArray(l)?[...l]:[l];let r=0;function n(){if(r>=a.length){t(new Error("[EarthRenderer] All texture sources failed"));return}const e=a[r++];new pe().load(e,o=>{o.colorSpace=fe,s(o)},void 0,()=>{console.warn(`[EarthRenderer] texture load failed from ${e}, trying fallback`),n()})}n()})}class xe{constructor(s){this.canvas=s,this._markers=[],this._destroyed=!1,this._sunLon=0,this._sunDriftSpeed=.3,this._init()}_init(){const{canvas:s}=this;this.scene=new W;const t=s.clientWidth/s.clientHeight||1;this.camera=new F(35,t,.1,1e3),this.camera.position.set(2.5,1.5,3.5),this.renderer=new Z({canvas:s,antialias:!0,alpha:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(s.clientWidth,s.clientHeight),this.renderer.toneMapping=Y,this.renderer.toneMappingExposure=1,this.composer=new J(this.renderer),this.composer.addPass(new X(this.scene,this.camera)),this.bloomPass=new Q(new q(s.clientWidth,s.clientHeight),1.8,.6,.6),this.composer.addPass(this.bloomPass),this.scene.add(new $(16777215,.05)),this.sunLight=new ee(16777215,3),this.sunLight.position.set(5,3,5),this.scene.add(this.sunLight),this.earthGroup=new te,this.scene.add(this.earthGroup),this._setupAsync()}async _setupAsync(){try{const[s,t,a,r,n]=await Promise.all([w(y.day),w(y.night),w(y.normal),w(y.specular),w(y.clouds)]);this.earthMat=new P({vertexShader:ge,fragmentShader:_e,uniforms:{uDay:{value:s},uNight:{value:t},uNormal:{value:a},uSpecular:{value:r},uSunLon:{value:this._sunLon},uSunLat:{value:0}}});const e=new _(new N(1,64,64),this.earthMat);this.earthGroup.add(e);const o=new se({map:n,transparent:!0,opacity:.5,blending:A,depthWrite:!1});this.cloudMesh=new _(new N(1.012,64,64),o),this.earthGroup.add(this.cloudMesh);const c=new P({vertexShader:ye,fragmentShader:we,blending:A,side:ae,transparent:!0,depthWrite:!1});this.scene.add(new _(new N(1.03,64,64),c));const u=Array.from({length:6e3},()=>[(Math.random()-.5)*200,(Math.random()-.5)*200,(Math.random()-.5)*200]).flat(),m=new re;m.setAttribute("position",new oe(u,3)),this.scene.add(new ne(m,new ie({color:16777215,size:.1,transparent:!0,opacity:.6}))),this.controls=new le(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.enablePan=!1,this.controls.enableZoom=!1,this.controls.rotateSpeed=.6,this._onResize=()=>{const h=this.canvas.clientWidth,v=this.canvas.clientHeight;this.camera.aspect=h/v,this.camera.updateProjectionMatrix(),this.renderer.setSize(h,v),this.composer.setSize(h,v),this.bloomPass.resolution.set(h,v)},window.addEventListener("resize",this._onResize),this.clock=new ce,this._animate()}catch(s){console.error("[EarthRenderer] texture load failed:",s)}}_animate(){var t;if(this._destroyed)return;this._raf=requestAnimationFrame(()=>this._animate());const s=this.clock.getElapsedTime();this._sunLon=(this._sunLon+this._sunDriftSpeed*.016)%360,this.earthMat&&(this.earthMat.uniforms.uSunLon.value=this._sunLon),this.earthGroup.rotation.y+=8e-4,this.cloudMesh&&(this.cloudMesh.rotation.y+=2e-4),this._markers.forEach(a=>{const r=s%2/2;if(a._ring){const n=1+r*.6;a._ring.scale.set(n,n,n),a._ring.material.opacity=1-r*.6}a._pillar&&(a._pillar.material.opacity=.35+Math.sin(r*Math.PI)*.45)}),(t=this.controls)==null||t.update(),this.composer.render()}setVisitorMarkers(s){this._markers.forEach(a=>{this.earthGroup.remove(a._ring),this.earthGroup.remove(a._pillar)}),this._markers=[];const t=new he(43775);s.forEach(a=>{const r=Me(a.lat,a.lon),n=new _(new ue(.01,.025,32),new B({color:t,side:de,transparent:!0,blending:A}));n.position.copy(r),n.lookAt(new V(0,0,0)),this.earthGroup.add(n);const e=new _(new me(.001,.006,.2,16),new B({color:t,transparent:!0,opacity:.6,blending:A}));e.geometry.translate(0,.1,0),e.geometry.rotateX(Math.PI/2),e.position.copy(r),e.lookAt(r.clone().multiplyScalar(2)),this.earthGroup.add(e),this._markers.push({...a,_ring:n,_pillar:e})})}destroy(){var s,t,a,r,n;this._destroyed||(this._destroyed=!0,cancelAnimationFrame(this._raf),this._markers&&(this._markers.forEach(e=>{var o,c,u,m;(o=e._ring)==null||o.geometry.dispose(),(c=e._ring)==null||c.material.dispose(),(u=e._pillar)==null||u.geometry.dispose(),(m=e._pillar)==null||m.material.dispose()}),this._markers=[]),(s=this.scene)==null||s.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(o=>{o.map&&o.map.dispose(),o.uniforms&&Object.values(o.uniforms).forEach(c=>{var u;(u=c.value)!=null&&u.dispose&&c.value.dispose()}),o.dispose()}):(e.material.map&&e.material.map.dispose(),e.material.uniforms&&Object.values(e.material.uniforms).forEach(o=>{var c;(c=o.value)!=null&&c.dispose&&o.value.dispose()}),e.material.dispose()))}),(t=this.earthMat)!=null&&t.uniforms&&Object.values(this.earthMat.uniforms).forEach(e=>{var o;(o=e.value)!=null&&o.dispose&&e.value.dispose()}),(a=this.controls)==null||a.dispose(),(r=this.composer)==null||r.dispose(),(n=this.renderer)==null||n.dispose(),this._onResize&&window.removeEventListener("resize",this._onResize))}}async function Se(l=10){return console.warn("[Umami] VITE_UMAMI_API_KEY or VITE_UMAMI_WEBSITE_ID not set — using mock data"),Ae()}async function Ee(l=10){return(await Se(l)).sort((t,a)=>a.y-t.y)}function Ae(){return[{x:"CN",y:412},{x:"US",y:287},{x:"JP",y:156},{x:"DE",y:98},{x:"BR",y:73},{x:"IN",y:54},{x:"AU",y:41},{x:"FR",y:38},{x:"RU",y:29},{x:"GB",y:24}]}const k={AD:[42.5,1.5],AE:[24,54],AF:[33,65],AG:[17.1,-61.8],AL:[41,20],AM:[40,45],AO:[-12.5,18.5],AR:[-34,-64],AT:[47.3,13.3],AU:[-25,134],AZ:[40.5,47.5],BA:[44,18],BB:[13.2,-59.5],BD:[24,90],BE:[50.8,4],BF:[13,-1],BG:[43,25],BH:[26,50.5],BI:[-3.4,30],BJ:[9.5,2.2],BN:[4.5,114.7],BO:[-17,-65],BR:[-10,-55],BS:[25,-76],BT:[27.5,90.5],BW:[-22,24],BY:[53,28],BZ:[17.2,-88.5],CA:[60,-96],CD:[-4,21],CF:[7,21],CG:[-1,15],CH:[47,8],CI:[8,-5],CL:[-30,-71],CM:[6,12],CN:[35,105],CO:[4,-72],CR:[10,-84],CU:[22,-79],CY:[35,33],CZ:[49.8,15.5],DE:[51,10],DJ:[11.6,43],DK:[56,10],DM:[15.4,-61.4],DO:[19,-70.7],DZ:[28,3],EC:[-2,-77.5],EE:[59,26],EG:[27,30],ER:[15.2,39.5],ES:[40,-4],ET:[9,40],FI:[64,26],FJ:[-18,175],FR:[46,2],GA:[-1,11.8],GB:[55,-3],GD:[12.1,-61.7],GE:[42,43.5],GH:[8,-1],GL:[72,-40],GM:[13.4,-15.3],GN:[11,-10],GQ:[2,10],GR:[39,22],GT:[15.5,-90.2],GW:[12,-15],GY:[6,-59],HN:[15.2,-86.2],HR:[45.2,15.5],HT:[19,-72.4],HU:[47,20],ID:[-5,120],IE:[53,-8],IL:[31.5,34.9],IN:[20,78],IQ:[33,44],IR:[32,53],IS:[65,-18],IT:[42.8,12.6],JM:[18.2,-77.5],JO:[31,36],JP:[36,138],KE:[1,38],KG:[41.2,75],KH:[13,105],KI:[1.9,-157.4],KM:[-12.2,44.4],KN:[17.3,-62.7],KP:[40,127],KR:[37.5,127.9],KW:[29.5,47.7],KZ:[48,67],LA:[18,103],LB:[33.9,35.9],LC:[13.9,-60.9],LI:[47.2,9.5],LK:[7,81],LR:[6.5,-9.4],LS:[-29.5,28.2],LT:[55.2,23.9],LU:[49.8,6.1],LV:[56.9,24.6],LY:[27,17],MA:[32,-6],MC:[43.7,7.4],MD:[47,29],ME:[42.5,19.3],MG:[-19.3,46.7],MK:[41.5,22],ML:[17,-4],MM:[22,98],MN:[46,105],MO:[22.3,113.5],MR:[20,-11],MT:[35.9,14.4],MU:[-20.2,57.5],MV:[3.2,73],MW:[-13.5,34],MX:[23,-102],MY:[3,109],MZ:[-18.7,35.5],NA:[-22,17],NE:[16,8],NG:[10,8],NI:[13,-85],NL:[52.5,5.7],NO:[62,10],NP:[28,84],NZ:[-41,174],OM:[21,57],PA:[9,-80],PE:[-10,-76],PG:[-6,147],PH:[13,122],PK:[30.4,69.3],PL:[51.9,19.1],PR:[18.2,-66.5],PT:[39.4,-8.2],PY:[-23,-58],QA:[25.3,51.2],RO:[46,25],RS:[44,21],RU:[60,100],RW:[-2,30],SA:[25,45],SB:[-9.5,160],SC:[-4.6,55.5],SD:[15.5,32.5],SE:[62,17],SG:[1.4,103.8],SI:[46.1,15.2],SK:[48.7,19.7],SL:[8.5,-11.5],SN:[14,-14],SO:[10,49],SR:[4,-56],SS:[7,30],SV:[13.8,-88.9],SY:[35,38],SZ:[-26.5,31.5],TD:[15,19],TG:[8.6,.8],TH:[15.9,100.9],TJ:[39,71],TL:[-8.6,125.7],TM:[40,60],TN:[34,9],TO:[-21.2,-175.2],TR:[39,35.2],TT:[11,-61],TZ:[-6.4,35],UA:[49,32],UG:[1.4,32.3],US:[38,-97],UY:[-33,-56],UZ:[41,64],VC:[13.3,-61.2],VE:[8,-66],VN:[16,108],VU:[-16,167],WS:[-13.8,-172.1],XK:[42.6,20.9],YE:[15.5,48.5],ZA:[-29,25],ZM:[-14.3,28.3],ZW:[-19,29.7]};function Ge(l){if(!l||l.length===0)return[];const s=Math.max(...l.map(t=>t.y));return s===0?[]:l.filter(t=>t.x&&k[t.x]).map(t=>({location:k[t.x],size:t.y/s,count:t.y}))}const Te={class:"gv-wrap"},Le={key:0,class:"gv-error"},Re={class:"gv-hud"},be={class:"hud-meta"},Ce={class:"hud-text"},Ne={class:"hud-text-sub"},De={key:0,class:"gv-loading"},Ie={key:0,class:"gv-hint"},Pe={__name:"GlobeViewer",props:{refreshInterval:{type:Number,default:6e4}},setup(l,{expose:s}){const t=l,{t:a}=H(),r=g(null),n=g(null),e=g(!1),o=g(!1),c=g(!1),u=g(0),m=g(0);let h=null,v=null;function D(){c.value=!0}async function G(){try{const p=await Ee(20);if(!p.length)return;u.value=p.reduce((f,x)=>f+x.y,0),m.value=p.length;const M=Ge(p).map(f=>({lat:f.location[0],lon:f.location[1],count:f.count??0,normSize:f.size??0}));h&&h.setVisitorMarkers(M)}catch(p){console.warn("[GlobeViewer] load failed:",p)}}return O(async()=>{var M,f,x,I;await j();const p=((M=r.value)==null?void 0:M.clientWidth)??0,d=((f=r.value)==null?void 0:f.clientHeight)??0;if(p===0||d===0){o.value=!0;return}try{h=new xe(r.value),(x=r.value)==null||x.addEventListener("mousedown",D),(I=r.value)==null||I.addEventListener("touchstart",D,{passive:!0}),e.value=!0,await G(),t.refreshInterval>0&&(v=setInterval(G,t.refreshInterval))}catch(U){console.error("[GlobeViewer] init failed:",U),o.value=!0}}),z(()=>{clearInterval(v),h==null||h.destroy(),h=null}),s({reload:G}),(p,d)=>(S(),E("div",Te,[i("div",{class:"gv-viewport",ref_key:"viewportEl",ref:n},[T(C,{name:"fade"},{default:L(()=>[o.value?(S(),E("div",Le,[d[0]||(d[0]=i("span",{class:"gv-error-icon"},[i("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[i("circle",{cx:"12",cy:"12",r:"10"}),i("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),i("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})])],-1)),i("span",null,R(K(a)("common.globeError")),1)])):b("",!0)]),_:1}),i("div",Re,[d[2]||(d[2]=i("div",{class:"hud-inner"},[i("span",{class:"hud-label"},"GEO-SYS"),i("span",{class:"hud-sep"},"//"),i("span",{class:"hud-label-sub"},"VISITOR MAP")],-1)),i("div",be,[d[1]||(d[1]=i("span",{class:"hud-live-dot"},null,-1)),i("span",Ce,R(u.value>0?u.value.toLocaleString():"—"),1),i("span",Ne,"visits · "+R(m.value>0?m.value:"—")+" countries",1)])]),T(C,{name:"fade"},{default:L(()=>[!e.value&&!o.value?(S(),E("div",De,d[3]||(d[3]=[i("div",{class:"gv-ring"},null,-1)]))):b("",!0)]),_:1}),i("canvas",{ref_key:"canvasEl",ref:r,class:"gv-canvas"},null,512),T(C,{name:"fade"},{default:L(()=>[e.value&&!c.value?(S(),E("div",Ie," Drag to rotate · Visit locations worldwide ")):b("",!0)]),_:1})],512)]))}},je=ve(Pe,[["__scopeId","data-v-f11c352a"]]);export{je as default};
