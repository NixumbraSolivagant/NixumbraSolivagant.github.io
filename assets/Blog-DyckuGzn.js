import{_ as K,N as L}from"./NavBar-2biq7noY.js";import{r as M,c as x,q as j,d as r,e as l,g as $,f as t,n as P,F as H,s as T,v as V,t as u,x as D,y as J,u as O,b as q,w as F,z as G}from"./vendor-vue-DHyjoLDp.js";import{M as U,a as Q,H as C,k as I}from"./vendor-md-DR-tz3s2.js";const W=`# JavaScript 异步编程：从回调到 async/await

## 概述

JavaScript 的异步编程经历了多个阶段的演进：回调函数 → Promise → async/await。理解这一演进过程，有助于写出更健壮的异步代码。

## 回调函数（Callback）

最早的异步解决方案，直接将函数作为参数传入：

\`\`\`javascript
function fetchData(callback) {
  setTimeout(() => {
    callback(null, 'data')
  }, 1000)
}

fetchData((err, data) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(data)
})
\`\`\`

**问题**：回调地狱（Callback Hell）——深层嵌套的回调使代码难以阅读和维护。

## Promise

Promise 将回调嵌套拍平为链式调用：

\`\`\`javascript
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('data')
    }, 1000)
  })
}

fetchData()
  .then(data => {
    console.log(data)
    return process(data)
  })
  .then(result => {
    console.log(result)
  })
  .catch(err => {
    console.error(err)
  })
\`\`\`

**改进**：链式调用更清晰，\`.catch()\` 集中处理错误。

## async/await

async/await 是 Promise 的语法糖，写起来像同步代码：

\`\`\`javascript
async function getData() {
  try {
    const data = await fetchData()
    console.log(data)
    const result = await process(data)
    console.log(result)
  } catch (err) {
    console.error(err)
  }
}
\`\`\`

## 注意事项

1. **错误处理**：async 函数中用 \`try/catch\` 包裹 \`await\`
2. **并行执行**：多个不相关的异步操作用 \`Promise.all()\` 并行执行，而非逐个 \`await\`
3. **避免阻塞**：不要在循环中无意义地使用 \`await\`

\`\`\`javascript
// 正确：并行执行
const [a, b] = await Promise.all([fetchA(), fetchB()])

// 不推荐：串行执行，速度慢
const a = await fetchA()
const b = await fetchB()
\`\`\`

## 小结

- 回调函数：基础但易引发回调地狱
- Promise：链式调用，错误集中处理
- async/await：最现代的方式，代码可读性最佳

实际项目中，**async/await + try/catch** 是推荐写法。
`,X=`# 博客搭建记录

## 前言

这个个人网站是我使用 **Vue 3** + **Vite** 从零开始搭建的。最初的目的很简单：找一个地方记录学习过程中的思考、踩坑与收获。

## 技术选型

选择 Vue 3 是因为它轻量、灵活，Composition API 写起来非常顺手。配合 Vite 作为构建工具，开发体验极佳——热更新几乎是即时的。

博客系统采用了 Markdown 文件存储 + 动态加载的方案：

- 所有文章以 \`.md\` 文件的形式存放在 \`/src/markdowns/\` 目录
- 使用 \`import.meta.glob\` 动态加载所有 Markdown 文件
- 通过 \`vue3-markdown-it\` 渲染内容，支持代码高亮与数学公式

这样写博客只需要新建一个 \`.md\` 文件，无需重启服务。

## 页面结构

\`\`\`
/           主页 - 三体粒子动画 + 背景轮播 + 今日一言
/blog       博客列表与文章阅读
/about      关于页面
/animation  动画展示（Three.js + D3.js 实验）
\`\`\`

## 未来计划

- [ ] 增加文章分类与标签系统
- [ ] 添加搜索功能
- [ ] 优化移动端体验
- [ ] 增加评论区

如果你有任何建议或想法，欢迎通过邮箱联系我。
`,Y=`### 一、理论所（杭高院依托理论所招生）

#### （一）招生专业与初试科目

1. 学术型（070201 理论物理）
   - ==考试科目：1101 思想政治理论、2201 英语（一）、3601 高等数学（甲）、4811 量子力学==

2. 专业型（085405 软件工程）
   - 考试科目：①101 思想政治理论、②204 英语（二）、③302 数学（二）、④408 计算机学科专业基础

#### （二）复试线

1. 学术型（070201 理论物理）：
   - 政治≥50分，英语≥50分，业务课1≥90分，业务课2≥90分，总分≥390分

2. 专业型（085405 软件工程）：
   - 政治≥37分，英语≥37分，业务课1≥56分，业务课2≥56分，总分≥273分

#### （三）复试办法

1. 考察内容：专业基础知识的概念、掌握深度与广度，知识灵活运用能力及科研潜力；英语听说交际能力；政治态度、思想状况、道德品质等综合素质。

2. 成绩计算：总成绩（百分制）=（初试成绩 / 5）× 50% + 复试成绩 × 50%，复试成绩满分100分。

3. 合格标准：复试成绩60分以下为不合格，不予录取；未按要求提交材料、思想品德考核或体检不合格者，不予录取。

#### （四）复试录取情况

1. 杭高院
   - 2025年：理论物理（02方向）进入复试考生初试总成绩范围==325-397==分，拟录取15人；精密测量物理（0方向）有学术型硕士拟录取名额（具体人数未明确）。
   - 2023年：理论物理专业拟录取考生初试成绩范围==289-399==分，复试成绩范围64.1-91.5分，总成绩范围60.95-85.65分，共拟录取22人。
1. 理论所
   - 2025 年：学术型硕士拟录取考生初试总分 400-411 分，复试成绩 70.10-74.68 分，总成绩 75.05-78.44 分；专业型硕士拟录取考生初试总分 337 分，复试成绩 77.17 分，总成绩 72.29 分，共拟录取 3 人。
   - 2024 年：学术型硕士拟录取考生初试总分 404-428 分，复试成绩 87.5-94.07 分，总成绩 86.55-87.44 分；专业型硕士拟录取考生初试总分 281-374 分，复试成绩 73.53-90 分，总成绩 69.05-82.4 分，共拟录取 6 人。
   - 2023 年：学术型硕士拟录取考生初试总分 401-423 分，复试成绩 74.95-89.34 分，总成绩 77.58-86.97 分；专业型硕士拟录取考生初试总分 294-359 分，复试成绩 78.59-88.38 分，总成绩 73.59-75.20 分，共拟录取 4 人。

### 二、物理科学学院（依托国际理论物理中心亚太地区招生）

#### (一) 招生专业与初试科目

1. 硕士 (070201 理论物理)
   - 研究方向：物理科学学院及代招单位理论物理方向（粒子物理、量子场论、全息原理、可解模型、引力、弦论等）
   - ==考试科目：1101 思想政治理论、2201 英语（一）、3604 高等数学、4811 量子力学==
   - 预计招生：2 人

2. 直博 (ICTP 相关方向)
   - 研究方向：引力理论与宇宙学、引力理论和引力波、暗物质与粒子物理、粒子物理和量子场论、引力波数据处理等
   - 指导教师：朴云松、郭宗宽、田雨、张君、储晓勇、汤勇、郭怀珂、吴岳良、周宇峰等
#### (二) 复试线 (国际理论物理中心亚太地区代招相关专业)

1. 070201 理论物理：政治、外语、业务课一、业务课二均为国家线，==总分 295 分
2. 070202 粒子物理与原子核物理：政治、外语、业务课一、业务课二均为国家线，总分 302 分
#### 三）复试办法（国际理论物理中心亚太地区代招相关考核）

3. 考察内容
- 外语听力和口语测试：英文自我介绍 + 回答提问，考查英语综合运用能力
- 业务能力面试：专业知识广度/深度、知识运用能力、问题分析解决能力、科研兴趣与创新潜质
- 综合素质考核：学习成绩、科研/工作表现、学习能力、创新精神、团队精神等

2. 成绩计算
- 复试成绩（百分制）= 外语听力和口语测试成绩 × 20% + 业务能力及综合素质成绩 × 80%
- 总成绩（百分制）= （初试成绩 / 5）× 60% + 复试成绩 × 40%

3. 合格标准：复试成绩 60 分为及格，不及格者不予录取；未按规定参加复试、政审未通过、体检不合格、考试违纪等情况，均不予录取。

#### （四）国际理论物理中心亚太地区录取情况

1. 硕士拟录取
- 2025 年：物理科学学院拟录取考生（含国际理论物理中心亚太地区代招相关）初试成绩 ==343-345== 分，复试成绩 85.56-89.56 分，总成绩 75.38-77.19 分，共拟录取 3 人（代招名额占比未明确，但均关联中心招生体系）
- 2024 年：拟录取考生初试成绩 ==302-397== 分，复试成绩 76.6-91 分，总成绩 66.88-84.04 分，共拟录取 3 人（含中心代招相关）
- 2023 年：中心代招相关拟录取考生初试成绩 ===396-411== 分，复试成绩 85.00-88.13 分，总成绩 82.77-83.32 分，共 2 人（含卡弗里理论科学研究所代招关联中心方向 1 人）
- 2022 年：中心代招拟录取考生初试成绩==357-416== 分，复试成绩 84.80-94.28 分，总成绩 76.76-87.63 分，共 5 人（含电子电气与通信工程学院代招关联中心方向 1 人）
- 2021 年：中心代招拟录取考生初试成绩 ==324-418== 分，复试成绩 82.34-89.03 分，总成绩 74.1-85.77 分，共 5 人

### 三、北师大天文（070400 天文学）

#### （一）初试科目
==统一考试科目：①101 思想政治理论、②201 英语（一）、③726 量子物理、④816 普通物理

参考书目：《量子力学导论》（曾谨言，北京大学出版社）、《新概念物理教程》（力学、电磁学、热学，赵凯华等，高等教育出版社）

招生方向：01 不设方向（全日制，24 人，推免 19 人左右）、02 不设方向（珠海，全日制，2 人，推免 1 人左右）、03 少数民族高层次骨干人才计划（全日制，2 人，推免 0 人左右）

#### （二）复试线
2024 年：政治 48 分、英语 48 分、业务课一 75 分、业务课二 75 分，总分 ==302== 分
2023 年：政治 45 分、英语 45 分、业务课一 70 分、业务课二 70 分，总分 ==280== 分
2022 年：政治 48 分、英语 48 分、业务课一 70 分、业务课二 90 分，总分 ==300== 分

#### （三）复试办法
1. 考察形式：面试，含英语（自我介绍 + 提问）、天文及数理基础知识问答
2. 成绩计算：复试满分 300 分（英语 100 分 + 专业知识问答 200 分），总成绩 = 初试总分 + 复试总分
3. 合格标准：复试 180 分（不含）以下为不及格，不合格者不予录取
#### （四）复试录取情况
2024 年：一志愿复试 32 人==（初试最高分 429 分、最低分 303 分）==，录取 23 人（初试最高分 429 分、最低分 324 分）
2023 年：一志愿复试 26 人==（初试最高分 412 分、最低分 283 分）==，录取 20 人（初试最高分 412 分、最低分 311 分）
2022 年：录取 19 人==（初试最高分 392 分、最低分 309 分==）
`,Z=["innerHTML"],nn={__name:"MarkdownRenderer",props:{source:{type:String,default:""}},emits:["rendered"],setup(S,{emit:_}){const k=S,g=M(null),p=new U({html:!0,linkify:!0,typographer:!0,highlight(s,d){return d&&C.getLanguage(d)?C.highlight(s,{language:d,ignoreIllegals:!0}).value:C.highlightAuto(s).value}});p.use(Q);function h(s){return s?s.replace(/\$\$([\s\S]+?)\$\$/g,(d,o)=>{try{return`<div class="katex-block">${I.renderToString(o.trim(),{displayMode:!0,throwOnError:!1})}</div>`}catch{return`$$${o}$$`}}).replace(/\$([^\n$]+?)\$/g,(d,o)=>{try{return`<span class="katex-inline">${I.renderToString(o.trim(),{displayMode:!1,throwOnError:!1})}</span>`}catch{return`$${o}$`}}):""}const f=x(()=>p.render(h(k.source||""))),b=_;return j(f,()=>{b("rendered",g.value)}),(s,d)=>(r(),l("div",{ref_key:"containerRef",ref:g,class:"md-renderer markdown-body",innerHTML:f.value},null,8,Z))}},tn={class:"zhihu-page"},an={class:"zhihu-shell"},en={class:"zhihu-body"},sn={class:"zhihu-container"},on={class:"zhihu-main"},rn={key:0,class:"feed"},ln={class:"feed-content"},dn={class:"feed-title"},cn={class:"feed-excerpt"},un={class:"feed-footer"},vn={class:"feed-meta"},pn={class:"meta-date"},mn={class:"meta-read"},hn={key:1,class:"post-view"},gn={class:"post-header"},fn={class:"post-title"},bn={class:"post-meta"},_n={key:2,class:"post-empty"},kn={class:"zhihu-side"},wn={class:"side-card profile"},yn={class:"profile-stats"},$n={key:0,class:"side-card post-toc"},Cn={class:"toc-list"},Mn=["onClick"],xn={key:0,class:"toc-empty"},Sn={__name:"Blog",setup(S){const _=Object.assign({"../markdowns/2025-04-01-JavaScript异步编程.md":W,"../markdowns/first-blog.md":X,"../markdowns/考研信息调研.md":Y});function k(e){return e.replace(/```[\s\S]*?```/g,"").replace(/[#>*_\-`]/g,"").replace(/\s+/g," ").trim().slice(0,120).concat("…")}function g(e){var v;const n=e.replace(/```[\s\S]*?```/g,"").replace(/[#>*_\-`]/g," ").replace(/\s+/g," ").trim(),i=((v=n.match(/[\u4e00-\u9fa5]/g))==null?void 0:v.length)??0,c=n.replace(/[\u4e00-\u9fa5]/g," ").split(/\s+/).filter(Boolean).length+i;return{wordCount:c,readMinutes:Math.max(1,Math.round(c/300)),excerpt:k(n)}}const p=Object.entries(_).map(([e,n])=>{const i=e.match(/\/([^/]+)\.md$/),a=i?i[1]:e,c=i?decodeURIComponent(i[1]):e;let v=null,m=c;const w=c.match(/^(\d{4}-\d{2}-\d{2})[-_](.+)$/);w&&(v=w[1],m=w[2]);const B=n.match(/^#\s+(.+)$/m);B&&(m=B[1].trim());const E=v??c,y=g(n);return{path:e,slug:a,title:m,content:n,date:v,sortKey:E,excerpt:y.excerpt,readMinutes:y.readMinutes,wordCount:y.wordCount}}).sort((e,n)=>e.sortKey===n.sortKey?0:e.sortKey<n.sortKey?1:-1),h=O(),f=J(),b=x(()=>!!h.params.slug),s=x(()=>h.params.slug?R(h.params.slug):null),d=M(null),o=M([]);function z(){f.push({name:"BlogHome"})}function R(e){return p.find(n=>n.slug===e)}function N(e){const n=e??d.value;if(!n){o.value=[];return}const i=Array.from(n.querySelectorAll("h2, h3"));o.value=i.map((a,c)=>{var m;const v=a.tagName.toLowerCase();return a.id||(a.id=`heading-${c+1}`),{id:a.id,text:((m=a.textContent)==null?void 0:m.trim())||"标题",level:v}})}function A(e){const n=document.getElementById(e);n&&n.scrollIntoView({behavior:"smooth",block:"start"})}return j(s,e=>{e||(o.value=[])},{immediate:!0}),(e,n)=>{const i=q("router-link");return r(),l("section",tn,[$(L),t("div",an,[t("div",en,[n[17]||(n[17]=P('<div class="zhihu-hero" data-v-aadc41eb><div class="zhihu-hero-content" data-v-aadc41eb><div class="zhihu-title" data-v-aadc41eb>博客</div><p class="zhihu-subtitle" data-v-aadc41eb>记录学习、思考与项目沉淀</p><div class="zhihu-tabs" data-v-aadc41eb><button class="tab active" data-v-aadc41eb>推荐</button><button class="tab" data-v-aadc41eb>最新</button><button class="tab" data-v-aadc41eb>随笔</button></div></div><div class="zhihu-hero-card" data-v-aadc41eb><div class="hero-label" data-v-aadc41eb>本地 Markdown</div><div class="hero-desc" data-v-aadc41eb>文章自动加载于 /src/markdowns</div><div class="hero-actions" data-v-aadc41eb><span class="hero-pill" data-v-aadc41eb>Markdown</span><span class="hero-pill" data-v-aadc41eb>Vue</span><span class="hero-pill" data-v-aadc41eb>Study</span></div></div></div>',1)),t("div",sn,[t("main",on,[b.value?s.value?(r(),l("div",hn,[t("div",gn,[t("button",{class:"back-btn",onClick:z},"← 返回列表"),t("h1",fn,u(s.value.title),1),t("div",bn,[n[5]||(n[5]=t("span",{class:"post-tag"},"专栏",-1)),n[6]||(n[6]=t("span",{class:"meta-dot"},"·",-1)),t("span",null,u(s.value.date||"未标注日期"),1),n[7]||(n[7]=t("span",{class:"meta-dot"},"·",-1)),t("span",null,"约 "+u(s.value.readMinutes)+" 分钟阅读",1)])]),t("div",{ref_key:"postContentRef",ref:d,class:"post-content"},[$(nn,{source:s.value.content,onRendered:n[0]||(n[0]=a=>{a&&N(a)})},null,8,["source"])],512)])):(r(),l("div",_n,[n[8]||(n[8]=t("h2",null,"文章未找到",-1)),n[9]||(n[9]=t("p",null,"可能是链接已更新，返回列表查看最新文章。",-1)),t("button",{class:"back-btn",onClick:z},"返回博客首页")])):(r(),l("div",rn,[(r(!0),l(H,null,T(V(p),a=>(r(),l("article",{key:a.slug,class:"feed-item"},[$(i,{to:{name:"BlogDetail",params:{slug:a.slug}},class:"feed-link"},{default:F(()=>[t("div",ln,[t("h2",dn,u(a.title),1),t("p",cn,u(a.excerpt),1)]),t("div",un,[t("div",vn,[n[1]||(n[1]=t("span",{class:"meta-tag"},"专栏",-1)),n[2]||(n[2]=t("span",{class:"meta-dot"},"·",-1)),t("span",pn,u(a.date||"未标注日期"),1),n[3]||(n[3]=t("span",{class:"meta-dot"},"·",-1)),t("span",mn,"阅读 "+u(a.readMinutes)+" 分钟",1)]),n[4]||(n[4]=t("span",{class:"feed-arrow"},"→",-1))])]),_:2},1032,["to"])]))),128))]))]),t("aside",kn,[t("div",wn,[n[13]||(n[13]=t("div",{class:"profile-header"},[t("div",{class:"profile-avatar"}),t("div",null,[t("div",{class:"profile-name"},"Mingzhang HU"),t("div",{class:"profile-desc"},"Computer Student · 南昌")])],-1)),t("div",yn,[t("div",null,[t("strong",null,u(V(p).length),1),n[10]||(n[10]=t("span",null,"文章",-1))]),n[11]||(n[11]=t("div",null,[t("strong",null,"活跃"),t("span",null,"更新")],-1)),n[12]||(n[12]=t("div",null,[t("strong",null,"GitHub"),t("span",null,"代码")],-1))]),n[14]||(n[14]=t("a",{class:"profile-link",href:"https://github.com/NixumbraSolivagant",target:"_blank",rel:"noreferrer"}," 访问 GitHub ",-1))]),n[16]||(n[16]=P('<div class="side-card" data-v-aadc41eb><div class="side-title" data-v-aadc41eb>专栏标签</div><div class="tag-list" data-v-aadc41eb><span class="tag" data-v-aadc41eb>学习笔记</span><span class="tag" data-v-aadc41eb>算法</span><span class="tag" data-v-aadc41eb>前端</span><span class="tag" data-v-aadc41eb>生活</span></div></div><div class="side-card" data-v-aadc41eb><div class="side-title" data-v-aadc41eb>更新提醒</div><p class="side-text" data-v-aadc41eb>每周整理一次学习收获，欢迎交流。</p><button class="side-btn" data-v-aadc41eb>关注专栏</button></div>',2)),b.value?(r(),l("div",$n,[n[15]||(n[15]=t("div",{class:"toc-title"},"目录",-1)),t("ul",Cn,[(r(!0),l(H,null,T(o.value,a=>(r(),l("li",{key:a.id,class:G(["toc-item",a.level])},[t("button",{type:"button",class:"toc-link",onClick:c=>A(a.id)},u(a.text),9,Mn)],2))),128)),o.value.length?D("",!0):(r(),l("li",xn,"暂无目录"))])])):D("",!0)])])])])])}}},Hn=K(Sn,[["__scopeId","data-v-aadc41eb"]]);export{Hn as default};
