import{N as O}from"./NavBar-CFBgy8nQ.js";import{r as x,c as Q,z as T,d as r,e as i,g as y,f as t,x as D,F as P,p as V,A as M,t as p,m as z,B as H,u as j,b as J,w as K,s as F}from"./vendor-vue-B_bEzuzB.js";import{M as q,a as U,H as A,k as N}from"./vendor-md-iCEmOvwu.js";import{_ as I}from"./_plugin-vue_export-helper-DlAUqK2U.js";const Y=`# JavaScript 异步编程：从回调到 async/await

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
`,Z=`# 强化学习：从马尔可夫决策过程到深度 Q 网络

> *"强化学习讨论的是：智能体（Agent）如何在不确定的环境中，通过试错学习，获得最大累积奖励。"*
> — Sutton & Barto，《强化学习导论》

## 什么是强化学习？

强化学习（Reinforcement Learning，RL）是机器学习的三大范式之一，与监督学习和无监督学习并列。它的核心思想来源于心理学中的**操作性条件反射**——有机体通过环境反馈（奖励或惩罚）来学习最优行为策略。

想象一下学走路的孩子：他会摔倒（负反馈），也会站稳（正反馈），通过无数次这样的试错，最终学会行走。强化学习正是对这一过程的数学化描述。

### 强化学习与其他学习范式的区别

| 范式 | 数据来源 | 反馈类型 | 目标 |
|------|---------|---------|------|
| 监督学习 | 固定数据集 | 即时正确答案 | 最小化预测误差 |
| 无监督学习 | 固定数据集 | 无标签 | 发现数据结构 |
| **强化学习** | **与环境交互** | **延迟的奖励信号** | **最大化累积回报** |

## 马尔可夫决策过程（MDP）

强化学习的数学基础是**马尔可夫决策过程**（Markov Decision Process，MDP）。一个 MDP 由五元组 $(S, A, P, R, \\gamma)$ 定义：

- $S$：状态空间（State Space）
- $A$：动作空间（Action Space）
- $P(s'|s, a)$：状态转移概率
- $R(s, a, s')$：奖励函数
- $\\gamma \\in [0, 1]$：折扣因子

### 马尔可夫性

马尔可夫性的核心假设是：**未来只与当前状态有关，与历史无关。**

$$P(s_{t+1} | s_t, s_{t-1}, \\ldots, s_0) = P(s_{t+1} | s_t)$$

这大大简化了问题的复杂度，使我们能够只关注当前状态做决策。

### 累积回报

智能体的目标是最大化**累积折扣回报**（Cumulative Discounted Return）：

$$G_t = R_{t+1} + \\gamma R_{t+2} + \\gamma^2 R_{t+3} + \\cdots = \\sum_{k=0}^{\\infty} \\gamma^k R_{t+k+1}$$

折扣因子 $\\gamma$ 平衡了**即时奖励**与**远期奖励**的重要性：
- $\\gamma \\to 0$：只关注即时奖励（短视）
- $\\gamma \\to 1$：同等重视远期奖励（有远见）

## 策略与价值函数

### 策略（Policy）

策略 $\\pi$ 是从状态到动作的映射：

$$\\pi(a|s) = P(a_t = a | s_t = s)$$

策略可以是：
- **确定性策略**：$\\pi(s) = a$
- **随机策略**：$\\pi(a|s)$ 输出动作的概率分布

### 价值函数

**状态价值函数** $V^\\pi(s)$ 衡量在状态 $s$ 下遵循策略 $\\pi$ 的期望回报：

$$V^\\pi(s) = \\mathbb{E}_\\pi [G_t | s_t = s] = \\mathbb{E}_\\pi \\left[ \\sum_{k=0}^{\\infty} \\gamma^k R_{t+k+1} \\middle| s_t = s \\right]$$

**动作价值函数** $Q^\\pi(s, a)$ 衡量在状态 $s$ 下执行动作 $a$，之后遵循策略 $\\pi$ 的期望回报：

$$Q^\\pi(s, a) = \\mathbb{E}_\\pi [G_t | s_t = s, a_t = a]$$

两者之间的关系：

$$V^\\pi(s) = \\sum_{a \\in A} \\pi(a|s) \\cdot Q^\\pi(s, a)$$

### 贝尔曼方程

价值函数满足**贝尔曼方程**，这是几乎所有 RL 算法的基石：

$$V^\\pi(s) = \\sum_{a} \\pi(a|s) \\sum_{s'} P(s'|s,a) \\left[ R(s,a,s') + \\gamma V^\\pi(s') \\right]$$

直觉上：当前状态的价值 = 所有可能动作的加权平均（加权了策略概率），每个动作的价值 = 所有可能转移的加权平均（加权了转移概率），转移后的价值 + 即时奖励。

### 最优价值函数

我们的目标是找到**最优策略** $\\pi^*$，使得：

$$V^*(s) = \\max_\\pi V^\\pi(s), \\quad \\forall s \\in S$$

同样，最优动作价值函数：

$$Q^*(s, a) = \\max_\\pi Q^\\pi(s, a)$$

## 动态规划：策略迭代与价值迭代

当环境模型（$P$ 和 $R$）已知时，可以使用经典的**动态规划**方法。

### 策略迭代（Policy Iteration）

1. **策略评估**：给定策略 $\\pi$，计算 $V^\\pi$
2. **策略改进**：贪心选择最大化 $Q$ 的动作
3. 重复直到收敛

$$V^{k+1}(s) = \\sum_{a} \\pi(a|s) \\sum_{s'} P(s'|s,a) \\left[ R(s,a,s') + \\gamma V^k(s') \\right]$$

### 价值迭代（Value Iteration）

将策略评估和改进合并为一步：

$$V^{k+1}(s) = \\max_{a} \\sum_{s'} P(s'|s,a) \\left[ R(s,a,s') + \\gamma V^k(s') \\right]$$

## 无模型方法：蒙特卡洛与时序差分

当环境模型未知时（现实中的大多数场景），必须通过**与环境交互**来学习。

### 蒙特卡洛（MC）方法

通过完整的 episode 采样来估计价值函数：

$$V(s) \\leftarrow V(s) + \\alpha \\left[ G_t - V(s) \\right]$$

其中 $G_t$ 是从时刻 $t$ 到 episode 结束的累积折扣回报，$\\alpha$ 是学习率。

### 时序差分（TD）学习

TD 方法结合了 MC 和 DP 的思想，用** bootstrapping**（用当前估计来更新）：

$$V(s) \\leftarrow V(s) + \\alpha \\left[ R + \\gamma V(s') - V(s) \\right]$$

核心是 TD 目标：$R + \\gamma V(s')$，它是对真实回报的部分估计。

#### MC vs TD

| 方面 | 蒙特卡洛 | 时序差分 |
|------|---------|---------|
| 采样 | 需要完整 episode | 单步即可更新 |
| 方差 | 高（长回报累积噪声） | 低（bootstrapping 降低方差） |
| 偏差 | 无偏 | 有偏（依赖估计） |
| 收敛 | 收敛到最小均方误差 | 收敛到 $V^\\pi$ |

## SARSA 与 Q 学习

这两种是 TD 学习在动作价值函数上的具体算法。

### SARSA（On-Policy）

\`\`\`python
def sarsa(env, num_episodes=500, alpha=0.1, gamma=0.99, epsilon=0.1):
    Q = defaultdict(lambda: np.zeros(env.action_space.n))
    
    for episode in range(num_episodes):
        state, _ = env.reset()
        action = epsilon_greedy(Q, state, epsilon)
        
        while not terminated:
            next_state, reward, terminated, _, _ = env.step(action)
            next_action = epsilon_greedy(Q, next_state, epsilon)
            
            # SARSA 更新：使用实际选择的 next_action
            td_target = reward + gamma * Q[next_state][next_action]
            Q[state][action] += alpha * (td_target - Q[state][action])
            
            state = next_state
            action = next_action
    
    return Q
\`\`\`

SARSA 的名称来源于更新的五元组：$S_t, A_t, R_{t+1}, S_{t+1}, A_{t+1}$

### Q 学习（Off-Policy）

\`\`\`python
def q_learning(env, num_episodes=500, alpha=0.1, gamma=0.99, epsilon=0.1):
    Q = defaultdict(lambda: np.zeros(env.action_space.n))
    
    for episode in range(num_episodes):
        state, _ = env.reset()
        
        while not terminated:
            action = epsilon_greedy(Q, state, epsilon)
            next_state, reward, terminated, _, _ = env.step(action)
            
            # Q 学习更新：使用最优 next_action（而非实际选择的）
            td_target = reward + gamma * np.max(Q[next_state])
            Q[state][action] += alpha * (td_target - Q[state][action])
            
            state = next_state
    
    return Q
\`\`\`

**关键区别**：SARSA 使用 $\\epsilon$\\-greedy 策略选择的下一个动作来计算 TD 目标，而 Q 学习使用最优值 $\\max_a Q(s', a)$。这使 Q 学习更具"野心"（aggressive），而 SARSA 更"保守"（conservative）。

## 深度 Q 网络（DQN）

当状态空间连续且巨大时（如原始像素输入），表格型方法无法处理。**深度 Q 网络**（Deep Q-Network）用深度神经网络来近似 $Q(s, a)$。

### 经验回放（Experience Replay）

智能体的经验 $(s_t, a_t, r_{t+1}, s_{t+1})$ 存储在回放缓冲区中，训练时随机采样，打破了样本间的时序相关性，提高了数据利用率。

### 目标网络（Target Network）

DQN 使用两个网络：
- **在线网络**（Online Network）：用于选择动作和主更新
- **目标网络**（Target Network）：冻结参数，计算 TD 目标

目标网络每隔 $C$ 步同步一次：

$$L(\\theta) = \\mathbb{E} \\left[ \\left( r + \\gamma \\max_{a'} Q_{\\theta^-}(s', a') - Q_\\theta(s, a) \\right)^2 \\right]$$

这个技巧使 TD 目标在一段时间内保持稳定，解决了非平稳目标的问题。

### 双 DQN（Double DQN）

标准 DQN 存在**过估计偏差**（overestimation bias），因为 $\\max$ 操作既选择了最优动作又估计了其价值。Double DQN 解决了这个问题：

$$Y_t^{\\text{Double}} = R_{t+1} + \\gamma Q_{\\theta^-} \\left( s_{t+1}, \\arg\\max_{a'} Q_\\theta(s_{t+1}, a') \\right)$$

## 策略梯度方法

前述方法都是学习**价值函数**然后从中导出策略。策略梯度方法直接**参数化策略**并优化它。

### 策略梯度定理

对于可微策略 $\\pi_\\theta(a|s)$，梯度：

$$\\nabla_\\theta J(\\theta) = \\mathbb{E}_{\\tau \\sim \\pi_\\theta} \\left[ \\sum_{t=0}^{T} \\nabla_\\theta \\log \\pi_\\theta(a_t | s_t) \\cdot G_t \\right]$$

其中 $\\tau$ 是轨迹（trajectory），$G_t$ 是累积回报。直观上：增加被高回报轨迹选中的动作的概率，减少被低回报轨迹选中的动作的概率。

### REINFORCE 算法

\`\`\`python
def reinforce(env, num_episodes=1000, gamma=0.99, lr=1e-3):
    policy_net = PolicyNetwork()
    optimizer = torch.optim.Adam(policy_net.parameters(), lr=lr)
    
    for episode in range(num_episodes):
        log_probs = []
        rewards = []
        state, _ = env.reset()
        
        while not terminated:
            action, log_prob = policy_net.select_action(state)
            log_probs.append(log_prob)
            state, reward, terminated, _, _ = env.step(action)
            rewards.append(reward)
        
        # 计算折扣回报
        returns = []
        G = 0
        for r in reversed(rewards):
            G = r + gamma * G
            returns.insert(0, G)
        
        # 策略梯度更新
        loss = 0
        for log_prob, G in zip(log_probs, returns):
            loss -= log_prob * G
        
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
    
    return policy_net
\`\`\`

### 策略梯度 vs 值函数方法

| 方面 | 策略梯度 | 值函数方法 |
|------|---------|-----------|
| 收敛性 | 收敛到局部最优 | 可能震荡 |
| 样本效率 | 低（高方差） | 高 |
| 探索 | 固有的随机策略 | 需要额外机制 |
| 动作空间 | 连续/离散均可 | 离散更自然 |
| 梯度平滑 | 连续 | 不连续（max 操作） |

## Actor-Critic：两全其美

Actor-Critic 结合了策略梯度（Actor）和值函数（Critic）的优点：

- **Actor**：策略网络，负责选择动作
- **Critic**：价值网络，负责评估当前策略

用优势函数 $A(s, a) = Q(s, a) - V(s)$ 来减少方差：

$$\\nabla_\\theta J \\approx \\mathbb{E} \\left[ \\nabla_\\theta \\log \\pi_\\theta(a|s) \\cdot A(s, a) \\right]$$

### A2C 与 A3C

- **A2C**（Advantage Actor-Critic）：同步更新，多个 worker 收集数据后汇总
- **A3C**（Asynchronous Advantage Actor-Critic）：异步更新，各自独立探索，参数服务器定期同步

## 近端策略优化（PPO）

PPO 是当前最流行的 RL 算法之一，通过**裁剪**来限制策略更新的幅度：

$$L^{\\text{CLIP}}(\\theta) = \\mathbb{E}_t \\left[ \\min\\left( r_t(\\theta) \\hat{A}_t, \\text{clip}(r_t(\\theta), 1-\\epsilon, 1+\\epsilon) \\hat{A}_t \\right) \\right]$$

其中 $r_t(\\theta) = \\frac{\\pi_\\theta(a_t|s_t)}{\\pi_{\\theta_{\\text{old}}}(a_t|s_t)}$ 是概率比，$\\epsilon$ 通常取 0.2。

## 应用场景

强化学习的应用范围极为广泛：

### 游戏与仿真
- Atari 游戏：DQN 达到人类水平
- 围棋：AlphaGo/AlphaZero 超越所有人类
- 星际争霸 II：AlphaStar
- Dota 2：OpenAI Five

### 机器人控制
- 机械臂操作（如抓取未知物体）
- 双足/四足机器人行走
- 无人机编队控制

### 自动驾驶
- 决策规划（换道、超车）
- 运动控制

### 推荐系统
- 长期用户满意度优化
- 探索-利用权衡

### 资源管理
- 数据中心冷却优化（DeepMind 节约 40% 能耗）
- 网络路由
- 电力调度

## 结语

强化学习是一门深刻而优雅的学科，它将最优控制、统计学习和心理学思想融为一体。从贝尔曼方程出发，我们建立了一套理解序列决策问题的完整框架；从表格型方法到深度网络，我们不断突破问题的规模边界。

当前，强化学习仍面临诸多挑战：样本效率低、 reward shaping 困难、泛化能力弱、安全性保证不足等。但正如历史上每一次技术突破一样，这些挑战正是研究最活跃、进步最快的领域。

> 强化学习教会我们的不仅是如何让机器学习，更是一种深刻的哲学启示：**在不确定性中，通过试错与反思，我们终将找到通往目标的道路。**

---

*本文参考了 Sutton & Barto 的《强化学习导论》（第二版）及 OpenAI Spinning Up 等资料。*
`,W=`# 博客搭建记录

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
`,X=`### 一、理论所（杭高院依托理论所招生）

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
`,nn=["innerHTML"],tn={__name:"MarkdownRenderer",props:{source:{type:String,default:""}},emits:["rendered"],setup(S,{emit:v}){const f=S,b=x(null),_=new q({html:!0,linkify:!0,typographer:!0,highlight(s,c){return c&&A.getLanguage(c)?A.highlight(s,{language:c,ignoreIllegals:!0}).value:A.highlightAuto(s).value}});_.use(U);function $(s){return s?s.replace(/\$\$([\s\S]+?)\$\$/g,(c,o)=>{try{return`<div class="katex-block">${N.renderToString(o.trim(),{displayMode:!0,throwOnError:!1})}</div>`}catch{return`$$${o}$$`}}).replace(/\$([^\n$]+?)\$/g,(c,o)=>{try{return`<span class="katex-inline">${N.renderToString(o.trim(),{displayMode:!1,throwOnError:!1})}</span>`}catch{return`$${o}$`}}):""}const g=Q(()=>_.render($(f.source||""))),h=v;return T(g,()=>{h("rendered",b.value)}),(s,c)=>(r(),i("div",{ref_key:"containerRef",ref:b,class:"md-renderer markdown-body",innerHTML:g.value},null,8,nn))}},an=I(tn,[["__scopeId","data-v-f9a38720"]]),en={class:"zhihu-page"},sn={class:"zhihu-shell"},on={class:"zhihu-body"},rn={class:"zhihu-container"},ln={class:"zhihu-main"},cn={key:0,class:"feed"},dn={class:"feed-content"},pn={class:"feed-title"},un={class:"feed-excerpt"},_n={class:"feed-footer"},mn={class:"feed-meta"},$n={class:"meta-date"},bn={class:"meta-read"},gn={key:1,class:"post-view"},hn={class:"post-header"},vn={class:"post-title"},fn={class:"post-meta"},kn={key:2,class:"post-empty"},wn={class:"zhihu-side"},yn={class:"side-card profile"},An={class:"profile-stats"},xn={key:0,class:"side-card post-toc"},Qn={class:"toc-list"},Sn=["onClick"],Cn={key:0,class:"toc-empty"},Rn={__name:"Blog",setup(S){const v=Object.assign({"../markdowns/2025-04-01-JavaScript异步编程.md":Y,"../markdowns/2026-05-09-强化学习：从MDP到DQN.md":Z,"../markdowns/first-blog.md":W,"../markdowns/考研信息调研.md":X});function f(a){return a.replace(/```[\s\S]*?```/g,"").replace(/[#>*_\-`]/g,"").replace(/\s+/g," ").trim().slice(0,120).concat("…")}function b(a){var u;const n=a.replace(/```[\s\S]*?```/g,"").replace(/[#>*_\-`]/g," ").replace(/\s+/g," ").trim(),l=((u=n.match(/[\u4e00-\u9fa5]/g))==null?void 0:u.length)??0,d=n.replace(/[\u4e00-\u9fa5]/g," ").split(/\s+/).filter(Boolean).length+l;return{wordCount:d,readMinutes:Math.max(1,Math.round(d/300)),excerpt:f(n)}}const _=Object.entries(v).map(([a,n])=>{const l=a.match(/\/([^/]+)\.md$/),e=l?l[1]:a,d=l?decodeURIComponent(l[1]):a;let u=null,m=d;const k=d.match(/^(\d{4}-\d{2}-\d{2})[-_](.+)$/);k&&(u=k[1],m=k[2]);const R=n.match(/^#\s+(.+)$/m);R&&(m=R[1].trim());const L=u??d,w=b(n);return{path:a,slug:e,title:m,content:n,date:u,sortKey:L,excerpt:w.excerpt,readMinutes:w.readMinutes,wordCount:w.wordCount}}).sort((a,n)=>a.sortKey===n.sortKey?0:a.sortKey<n.sortKey?1:-1),$=j(),g=H(),h=Q(()=>!!$.params.slug),s=Q(()=>$.params.slug?B($.params.slug):null),c=x(null),o=x([]);function C(){g.push({name:"BlogHome"})}function B(a){return _.find(n=>n.slug===a)}function G(a){const n=a??c.value;if(!n){o.value=[];return}const l=Array.from(n.querySelectorAll("h2, h3"));o.value=l.map((e,d)=>{var m;const u=e.tagName.toLowerCase();return e.id||(e.id=`heading-${d+1}`),{id:e.id,text:((m=e.textContent)==null?void 0:m.trim())||"标题",level:u}})}function E(a){const n=document.getElementById(a);n&&n.scrollIntoView({behavior:"smooth",block:"start"})}return T(s,a=>{a||(o.value=[])},{immediate:!0}),(a,n)=>{const l=J("router-link");return r(),i("section",en,[y(O),t("div",sn,[t("div",on,[n[16]||(n[16]=D('<div class="zhihu-hero" data-v-b980bbc9><div class="zhihu-hero-content" data-v-b980bbc9><div class="zhihu-title" data-v-b980bbc9>博客</div><p class="zhihu-subtitle" data-v-b980bbc9>记录学习、思考与项目沉淀</p><div class="zhihu-tabs" data-v-b980bbc9><button class="tab active" data-v-b980bbc9>推荐</button><button class="tab" data-v-b980bbc9>最新</button><button class="tab" data-v-b980bbc9>随笔</button></div></div><div class="zhihu-hero-card" data-v-b980bbc9><div class="hero-label" data-v-b980bbc9>本地 Markdown</div><div class="hero-desc" data-v-b980bbc9>文章自动加载于 /src/markdowns</div><div class="hero-actions" data-v-b980bbc9><span class="hero-pill" data-v-b980bbc9>Markdown</span><span class="hero-pill" data-v-b980bbc9>Vue</span><span class="hero-pill" data-v-b980bbc9>Study</span></div></div></div>',1)),t("div",rn,[t("main",ln,[h.value?s.value?(r(),i("div",gn,[t("div",hn,[t("button",{class:"back-btn",onClick:C},"← 返回列表"),t("h1",vn,p(s.value.title),1),t("div",fn,[n[4]||(n[4]=t("span",{class:"post-tag"},"专栏",-1)),n[5]||(n[5]=t("span",{class:"meta-dot"},"·",-1)),t("span",null,p(s.value.date||"未标注日期"),1),n[6]||(n[6]=t("span",{class:"meta-dot"},"·",-1)),t("span",null,"约 "+p(s.value.readMinutes)+" 分钟阅读",1)])]),t("div",{ref_key:"postContentRef",ref:c,class:"post-content"},[y(an,{source:s.value.content,onRendered:G},null,8,["source"])],512)])):(r(),i("div",kn,[n[7]||(n[7]=t("h2",null,"文章未找到",-1)),n[8]||(n[8]=t("p",null,"可能是链接已更新，返回列表查看最新文章。",-1)),t("button",{class:"back-btn",onClick:C},"返回博客首页")])):(r(),i("div",cn,[(r(!0),i(P,null,V(M(_),e=>(r(),i("article",{key:e.slug,class:"feed-item"},[y(l,{to:{name:"BlogDetail",params:{slug:e.slug}},class:"feed-link"},{default:K(()=>[t("div",dn,[t("h2",pn,p(e.title),1),t("p",un,p(e.excerpt),1)]),t("div",_n,[t("div",mn,[n[0]||(n[0]=t("span",{class:"meta-tag"},"专栏",-1)),n[1]||(n[1]=t("span",{class:"meta-dot"},"·",-1)),t("span",$n,p(e.date||"未标注日期"),1),n[2]||(n[2]=t("span",{class:"meta-dot"},"·",-1)),t("span",bn,"阅读 "+p(e.readMinutes)+" 分钟",1)]),n[3]||(n[3]=t("span",{class:"feed-arrow"},"→",-1))])]),_:2},1032,["to"])]))),128))]))]),t("aside",wn,[t("div",yn,[n[12]||(n[12]=t("div",{class:"profile-header"},[t("div",{class:"profile-avatar"}),t("div",null,[t("div",{class:"profile-name"},"Mingzhang HU"),t("div",{class:"profile-desc"},"Computer Student · 南昌")])],-1)),t("div",An,[t("div",null,[t("strong",null,p(M(_).length),1),n[9]||(n[9]=t("span",null,"文章",-1))]),n[10]||(n[10]=t("div",null,[t("strong",null,"活跃"),t("span",null,"更新")],-1)),n[11]||(n[11]=t("div",null,[t("strong",null,"GitHub"),t("span",null,"代码")],-1))]),n[13]||(n[13]=t("a",{class:"profile-link",href:"https://github.com/NixumbraSolivagant",target:"_blank",rel:"noreferrer"}," 访问 GitHub ",-1))]),n[15]||(n[15]=D('<div class="side-card" data-v-b980bbc9><div class="side-title" data-v-b980bbc9>专栏标签</div><div class="tag-list" data-v-b980bbc9><span class="tag" data-v-b980bbc9>学习笔记</span><span class="tag" data-v-b980bbc9>算法</span><span class="tag" data-v-b980bbc9>前端</span><span class="tag" data-v-b980bbc9>生活</span></div></div><div class="side-card" data-v-b980bbc9><div class="side-title" data-v-b980bbc9>更新提醒</div><p class="side-text" data-v-b980bbc9>每周整理一次学习收获，欢迎交流。</p><button class="side-btn" data-v-b980bbc9>关注专栏</button></div>',2)),h.value?(r(),i("div",xn,[n[14]||(n[14]=t("div",{class:"toc-title"},"目录",-1)),t("ul",Qn,[(r(!0),i(P,null,V(o.value,e=>(r(),i("li",{key:e.id,class:F(["toc-item",e.level])},[t("button",{type:"button",class:"toc-link",onClick:d=>E(e.id)},p(e.text),9,Sn)],2))),128)),o.value.length?z("",!0):(r(),i("li",Cn,"暂无目录"))])])):z("",!0)])])])])])}}},zn=I(Rn,[["__scopeId","data-v-b980bbc9"]]);export{zn as default};
