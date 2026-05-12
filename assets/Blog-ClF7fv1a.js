import{u as V}from"./index-D1DHeWoI.js";import{N as H}from"./NavBar-CJW22K2v.js";import{r as A,c as D,k as Q,o as K,B as P,d as m,e as p,g as X,f as n,C as e,D as t,F as U,J as E,E as j,u as W,K as J,b as Y,w as Z,L as nn}from"./vendor-vue-zDyEjqOb.js";import{M as en,a as tn,b as q,H as S,k as F}from"./vendor-md-9MIaiziu.js";import{_ as I,S as an}from"./author-CBA2vuEx.js";const on=`# JavaScript 异步编程：从回调到 async/await

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
`,sn=`# 强化学习：从马尔可夫决策过程到深度 Q 网络

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
`,rn=`# 卷积神经网络：原理、架构与实战

> *"深度学习最强大的地方在于，它能从原始数据中自动学习出有效的特征表示，而无需人工设计特征。"*
> — Yann LeCun，卷积神经网络之父，2018 年图灵奖得主

## 什么是卷积神经网络？

**卷积神经网络**（Convolutional Neural Network，CNN）是一类专门用于处理具有**网格结构数据**的深度神经网络，尤其在图像和视频分析领域取得了突破性进展。与传统全连接神经网络不同，CNN 通过**局部连接**和**权重共享**两大核心机制，大幅减少了参数数量，同时增强了对图像中空间层次结构的建模能力。

CNN 的核心思想源于对生物视觉系统的研究。1962 年，David Hubel 和 Torsten Wiesel 在对猫视觉皮层的研究中发现，视觉系统中的神经元对视野中的局部区域最为敏感，这一特性被称为**局部感受野**（Local Receptive Field）。CNN 正是对这一生物视觉机制的数学建模。

### CNN 与传统神经网络的关键区别

| 特性 | 全连接神经网络 (MLP) | 卷积神经网络 (CNN) |
|------|---------------------|-------------------|
| **连接方式** | 每一层神经元与上一层所有神经元相连 | 仅与局部区域（感受野）神经元相连 |
| **参数共享** | 每个权重独立学习 | 同一特征图的权重共享 |
| **空间结构** | 忽略输入的空间结构 | 保留并利用空间层次结构 |
| **参数量** | 随输入增大而急剧增长 | 参数数量与输入尺寸相对独立 |
| **适用任务** | 表格数据、向量分类 | 图像、视频、语音频谱图 |

考虑一张 $224 \\times 224 \\times 3$ 的输入图像。如果使用全连接层（假设隐藏层有 4096 个神经元），仅这一层的参数量就达到了：

$$参数数量 = 224 \\times 224 \\times 3 \\times 4096 \\approx 6.2 \\times 10^8$$

而一个典型的 CNN 可能只需要数百万个参数，就能达到更好的效果。

## 卷积操作详解

**卷积**（Convolution）是 CNN 的核心运算。理解卷积是掌握 CNN 的基础。

### 一维卷积

从数学角度，一维离散卷积定义为：

$$(f * g)[n] = \\sum_{m=-\\infty}^{\\infty} f[m] \\cdot g[n - m]$$

在神经网络中，我们通常使用**互相关**（Cross-correlation）操作，虽然数学上与卷积有细微差别，但在实际应用中效果完全一致：

$$y[n] = \\sum_{m=0}^{k-1} x[n + m] \\cdot w[m]$$

其中 $x$ 是输入信号，$w$ 是卷积核（kernel）或滤波器（filter），$k$ 是卷积核大小。

### 二维卷积

对于图像这样的二维数据，卷积操作扩展为：

$$Y[i, j] = \\sum_{m=0}^{k_h-1} \\sum_{n=0}^{k_w-1} X[i + m, j + n] \\cdot K[m, n]$$

假设输入特征图 $X$ 大小为 $H \\times W$，卷积核 $K$ 大小为 $k \\times k$，则输出 $Y$ 的大小为：

$$H_{out} = H - k + 1, \\quad W_{out} = W - k + 1$$

### 填充与步长

卷积操作会导致输出尺寸小于输入，这会带来两个问题：

1. **边缘信息丢失** - 角落和边缘的像素只被使用一次
2. **网络深度受限** - 每经过一层，特征图都会缩小

**填充**（Padding）通过在输入周围添加额外的像素（通常为 0）来解决这个问题。如果添加 $p$ 层填充：

$$H_{out} = H + 2p - k + 1, \\quad W_{out} = W + 2p - k + 1$$

常见的填充策略：

- **Valid**（无填充）：$p = 0$
- **Same**（保持尺寸）：$p = \\lfloor k / 2 \\rfloor$（当 $k$ 为奇数时）
- **Full**（完全填充）：$p = k - 1$

**步长**（Stride）$s$ 决定了卷积核在输入上滑动的步长：

$$H_{out} = \\lfloor \\frac{H + 2p - k}{s} \\rfloor + 1, \\quad W_{out} = \\lfloor \\frac{W + 2p - k}{s} \\rfloor + 1$$

### 多通道卷积

现代 CNN 处理的是多通道（channel）数据。对于 $C_{in}$ 通道的输入和 $C_{out}$ 个卷积核：

$$Y_{c_{out}}[i, j] = \\sum_{c_{in}=1}^{C_{in}} \\sum_{m=0}^{k-1} \\sum_{n=0}^{k-1} X_{c_{in}}[i + m, j + n] \\cdot K_{c_{out}, c_{in}}[m, n] + b_{c_{out}}$$

每个卷积核的参数量：$k \\times k \\times C_{in} + 1$（加偏置）
总参数量：$C_{out} \\times (k \\times k \\times C_{in} + 1)$

### 空洞卷积

**空洞卷积**（Dilated/Atrous Convolution）通过在卷积核中引入间隔来扩大感受野，而不增加参数量：

$$y[i, j] = \\sum_{m=0}^{k-1} \\sum_{n=0}^{k-1} x[i + r \\cdot m, j + r \\cdot n] \\cdot w[m, n]$$

其中 $r$ 是空洞率（dilation rate）。当 $r = 1$ 时为空洞卷积退化为普通卷积。

空洞卷积在语义分割任务中尤为重要，它可以在不损失分辨率的情况下扩大感受野。

## 核心组件

### 卷积层

卷积层是 CNN 的基本构建块。每个卷积层包含多个可学习的卷积核，这些卷积核在输入上滑动，提取局部特征。

\`\`\`python
import torch
import torch.nn as nn

# 定义一个卷积层
conv_layer = nn.Conv2d(
    in_channels=3,      # 输入通道数（RGB图像为3）
    out_channels=64,    # 输出通道数（卷积核数量）
    kernel_size=3,      # 卷积核大小
    stride=1,           # 步长
    padding=1,          # 填充
    bias=True           # 是否添加偏置
)

# 输入张量：[batch_size, channels, height, width]
x = torch.randn(1, 3, 224, 224)

# 通过卷积层
output = conv_layer(x)
print(f"输出形状: {output.shape}")  # torch.Size([1, 64, 224, 224])
\`\`\`

### 激活函数

卷积操作是线性运算，激活函数为网络引入非线性，使其能够学习复杂的模式。

**ReLU**（Rectified Linear Unit）是最常用的激活函数：

$$\\text{ReLU}(x) = \\max(0, x)$$

\`\`\`python
# ReLU 激活函数
relu = nn.ReLU(inplace=True)
x = torch.randn(1, 64, 224, 224)
x = relu(x)
\`\`\`

ReLU 的优点：
- 计算简单，速度快
- 缓解梯度消失问题
- 引入稀疏性

但 ReLU 也有**神经元死亡**问题：当输入总是负数时，梯度为 0，神经元永远不会激活。

**Leaky ReLU** 解决了这个问题：

$$\\text{LeakyReLU}(x) = \\begin{cases} x & \\text{if } x > 0 \\\\ \\alpha x & \\text{if } x \\leq 0 \\end{cases}$$

\`\`\`python
leaky_relu = nn.LeakyReLU(negative_slope=0.01, inplace=True)
\`\`\`

**GELU**（Gaussian Error Linear Unit）是 Transformer 架构中常用的激活函数：

$$\\text{GELU}(x) = x \\cdot \\Phi(x)$$

其中 $\\Phi$ 是标准正态分布的累积分布函数。

\`\`\`python
gelu = nn.GELU()
\`\`\`

### 池化层

**池化**（Pooling）层对特征图进行下采样（down-sampling），减少空间尺寸、参数量和计算量，同时提供一定程度的平移不变性。

**最大池化**（Max Pooling）取局部区域的最大值：

\`\`\`python
# 2x2 最大池化，步长为2
max_pool = nn.MaxPool2d(kernel_size=2, stride=2)
x = torch.randn(1, 64, 224, 224)
x = max_pool(x)
print(f"池化后形状: {x.shape}")  # torch.Size([1, 64, 112, 112])
\`\`\`

**平均池化**（Average Pooling）取局部区域的平均值：

$$\\text{AvgPool}(x) = \\frac{1}{k \\times k} \\sum_{i=0}^{k-1} \\sum_{j=0}^{k-1} x[i, j]$$

**全局池化**（Global Pooling）对整个特征图进行池化，常用于替代全连接层：

\`\`\`python
# 全局平均池化
gap = nn.AdaptiveAvgPool2d((1, 1))
x = torch.randn(1, 512, 7, 7)
x = gap(x)
print(f"全局池化后形状: {x.shape}")  # torch.Size([1, 512, 1, 1])
\`\`\`

### 批量归一化

**批量归一化**（Batch Normalization）由 Ioffe 和 Szegedy 于 2015 年提出，是深度学习中最重要的技术之一。

对于一个小批量 $\\mathcal{B} = \\{x_1, \\ldots, x_m\\}$：

$$\\mu_{\\mathcal{B}} = \\frac{1}{m} \\sum_{i=1}^{m} x_i \\quad \\text{（均值）}$$

$$\\sigma_{\\mathcal{B}}^2 = \\frac{1}{m} \\sum_{i=1}^{m} (x_i - \\mu_{\\mathcal{B}})^2 \\quad \\text{（方差）}$$

$$\\hat{x}_i = \\frac{x_i - \\mu_{\\mathcal{B}}}{\\sqrt{\\sigma_{\\mathcal{B}}^2 + \\epsilon}} \\quad \\text{（归一化）}$$

$$y_i = \\gamma \\hat{x}_i + \\beta \\quad \\text{（仿射变换）}$$

其中 $\\gamma$ 和 $\\beta$ 是可学习的参数，$\\epsilon$ 是防止除零的小常数。

\`\`\`python
bn = nn.BatchNorm2d(num_features=64, momentum=0.1, affine=True)
x = torch.randn(32, 64, 224, 224)  # batch_size=32
x = bn(x)
print(f"归一化后均值: {x.mean(dim=(0,2,3)).mean():.4f}")  # 接近0
print(f"归一化后方差: {x.var(dim=(0,2,3)).mean():.4f}")  # 接近1
\`\`\`

批量归一化的作用：
- 允许使用更高的学习率
- 减少对初始化的敏感度
- 具有正则化效果
- 加速模型收敛

### Dropout

**Dropout** 通过在训练时随机"丢弃"（置零）部分神经元来防止过拟合：

\`\`\`python
dropout = nn.Dropout(p=0.5)  # 丢弃概率为0.5
x = torch.randn(32, 512)
x = dropout(x)  # 约一半的神经元被置零
\`\`\`

Dropout 的工作原理：
- 训练时：随机丢弃部分神经元，强迫网络学习冗余表示
- 推理时：使用所有神经元，并按保留概率缩放输出

### 全连接层

在 CNN 的最后几层，通常使用全连接层来整合特征并进行分类或回归：

\`\`\`python
# 将特征图展平后通过全连接层
x = torch.randn(32, 512, 7, 7)
x = x.view(x.size(0), -1)  # 展平: (32, 25088)
fc = nn.Linear(25088, 4096)
x = fc(x)
x = torch.relu(x)
\`\`\`

## 经典 CNN 架构

### LeNet-5（1998）

LeNet-5 是 CNN 的开山之作，由 Yann LeCun 等人提出，用于手写数字识别（MNIST 数据集）。

架构：
\`\`\`
输入(32×32) 
  → Conv1(6, 5×5, s=1) → AvgPool(2×2, s=2)
  → Conv2(16, 5×5, s=1) → AvgPool(2×2, s=2)
  → Conv3(120, 5×5, s=1) → Flatten
  → FC(84) → FC(10) → 输出(10分类)
\`\`\`

\`\`\`python
class LeNet5(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        self.conv1 = nn.Conv2d(1, 6, 5, padding=2)
        self.pool1 = nn.AvgPool2d(2, 2)
        self.conv2 = nn.Conv2d(6, 16, 5)
        self.pool2 = nn.AvgPool2d(2, 2)
        self.conv3 = nn.Conv2d(16, 120, 5)
        self.fc1 = nn.Linear(120, 84)
        self.fc2 = nn.Linear(84, num_classes)
        
    def forward(self, x):
        x = torch.relu(self.conv1(x))
        x = self.pool1(x)
        x = torch.relu(self.conv2(x))
        x = self.pool2(x)
        x = torch.relu(self.conv3(x))
        x = x.view(x.size(0), -1)
        x = torch.relu(self.fc1(x))
        x = self.fc2(x)
        return x
\`\`\`

### AlexNet（2012）

AlexNet 在 ImageNet 竞赛中以显著优势夺冠，掀起了深度学习的浪潮。它首次证明了深度 CNN 在大规模图像分类中的强大能力。

架构特点：
- 8 层网络（5 层卷积 + 3 层全连接）
- 使用 ReLU 激活函数
- 使用 Dropout 正则化
- 使用局部响应归一化（LRN）
- 使用数据增强

\`\`\`python
class AlexNet(nn.Module):
    def __init__(self, num_classes=1000):
        super().__init__()
        self.features = nn.Sequential(
            # Conv1: 224×224×3 → 55×55×96
            nn.Conv2d(3, 96, 11, stride=4, padding=2),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(3, 2),  # → 27×27×96
            # Conv2: 27×27×96 → 27×27×256
            nn.Conv2d(96, 256, 5, padding=2),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(3, 2),  # → 13×13×256
            # Conv3-5: 保持尺寸
            nn.Conv2d(256, 384, 3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(384, 384, 3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(384, 256, 3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(3, 2),  # → 6×6×256
        )
        self.avgpool = nn.AdaptiveAvgPool2d((6, 6))
        self.classifier = nn.Sequential(
            nn.Dropout(0.5),
            nn.Linear(256 * 6 * 6, 4096),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5),
            nn.Linear(4096, 4096),
            nn.ReLU(inplace=True),
            nn.Linear(4096, num_classes),
        )
    
    def forward(self, x):
        x = self.features(x)
        x = self.avgpool(x)
        x = x.view(x.size(0), -1)
        x = self.classifier(x)
        return x
\`\`\`

### VGGNet（2014）

VGGNet 通过使用更小的卷积核（3×3）堆叠代替大卷积核，展示了深度网络的重要性。

核心设计原则：
- 所有卷积核大小为 3×3，步长为 1，填充为 1
- 所有池化窗口为 2×2，步长为 2
- 使用连续多个 3×3 卷积代替大卷积核

例如，三个 3×3 卷积的感受野 = 7×7，但参数量更少：

$$参数比 = \\frac{3 \\times 3^2}{7 \\times 7} = \\frac{27}{49} \\approx 55\\%$$

\`\`\`python
class VGG16(nn.Module):
    def __init__(self, num_classes=1000):
        super().__init__()
        self.features = nn.Sequential(
            # Block 1: 224→112
            nn.Conv2d(3, 64, 3, padding=1), nn.ReLU(inplace=True),
            nn.Conv2d(64, 64, 3, padding=1), nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),
            # Block 2: 112→56
            nn.Conv2d(64, 128, 3, padding=1), nn.ReLU(inplace=True),
            nn.Conv2d(128, 128, 3, padding=1), nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),
            # Block 3: 56→28
            nn.Conv2d(128, 256, 3, padding=1), nn.ReLU(inplace=True),
            nn.Conv2d(256, 256, 3, padding=1), nn.ReLU(inplace=True),
            nn.Conv2d(256, 256, 3, padding=1), nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),
            # Block 4: 28→14
            nn.Conv2d(256, 512, 3, padding=1), nn.ReLU(inplace=True),
            nn.Conv2d(512, 512, 3, padding=1), nn.ReLU(inplace=True),
            nn.Conv2d(512, 512, 3, padding=1), nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),
            # Block 5: 14→7
            nn.Conv2d(512, 512, 3, padding=1), nn.ReLU(inplace=True),
            nn.Conv2d(512, 512, 3, padding=1), nn.ReLU(inplace=True),
            nn.Conv2d(512, 512, 3, padding=1), nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),
        )
        self.avgpool = nn.AdaptiveAvgPool2d((7, 7))
        self.classifier = nn.Sequential(
            nn.Linear(512 * 7 * 7, 4096), nn.ReLU(inplace=True), nn.Dropout(),
            nn.Linear(4096, 4096), nn.ReLU(inplace=True), nn.Dropout(),
            nn.Linear(4096, num_classes),
        )
    
    def forward(self, x):
        x = self.features(x)
        x = self.avgpool(x)
        x = x.view(x.size(0), -1)
        x = self.classifier(x)
        return x
\`\`\`

### GoogLeNet / Inception（2014）

GoogLeNet 引入了 **Inception 模块**，通过并行使用不同大小的卷积核来捕获多尺度特征：

\`\`\`
Inception Module:
    输入
    ├── 1×1 Conv ─────────────────────┐
    ├── 1×1 Conv → 3×3 Conv ─────────┤
    ├── 1×1 Conv → 5×5 Conv ─────────┤→ Concat → 输出
    └── 3×3 MaxPool → 1×1 Conv ─────┘
\`\`\`

核心创新：
- **1×1 卷积**：降维/升维，控制通道数
- **并行分支**：捕获多尺度特征
- **全局平均池化**：减少全连接层参数
- **辅助分类器**：缓解梯度消失

\`\`\`python
class InceptionModule(nn.Module):
    def __init__(self, in_channels, ch1x1, ch3x3red, ch3x3, ch5x5red, ch5x5, pool_proj):
        super().__init__()
        self.branch1 = nn.Sequential(
            nn.Conv2d(in_channels, ch1x1, 1), nn.ReLU(inplace=True)
        )
        self.branch2 = nn.Sequential(
            nn.Conv2d(in_channels, ch3x3red, 1), nn.ReLU(inplace=True),
            nn.Conv2d(ch3x3red, ch3x3, 3, padding=1), nn.ReLU(inplace=True)
        )
        self.branch3 = nn.Sequential(
            nn.Conv2d(in_channels, ch5x5red, 1), nn.ReLU(inplace=True),
            nn.Conv2d(ch5x5red, ch5x5, 5, padding=2), nn.ReLU(inplace=True)
        )
        self.branch4 = nn.Sequential(
            nn.MaxPool2d(3, stride=1, padding=1),
            nn.Conv2d(in_channels, pool_proj, 1), nn.ReLU(inplace=True)
        )
    
    def forward(self, x):
        return torch.cat([self.branch1(x), self.branch2(x), 
                          self.branch3(x), self.branch4(x)], dim=1)
\`\`\`

### ResNet（2015）

ResNet（Residual Network）通过**残差连接**（skip connection）解决了深层网络训练困难的问题，使得训练数百层的网络成为可能。

核心思想：让网络学习残差映射 $F(x) = H(x) - x$，而不是直接学习 $H(x)$。

\`\`\`python
class ResidualBlock(nn.Module):
    def __init__(self, in_channels, out_channels, stride=1):
        super().__init__()
        self.conv1 = nn.Conv2d(in_channels, out_channels, 3, stride, 1, bias=False)
        self.bn1 = nn.BatchNorm2d(out_channels)
        self.conv2 = nn.Conv2d(out_channels, out_channels, 3, 1, 1, bias=False)
        self.bn2 = nn.BatchNorm2d(out_channels)
        
        # 残差连接（如果尺寸改变，使用1×1卷积调整）
        self.shortcut = nn.Sequential()
        if stride != 1 or in_channels != out_channels:
            self.shortcut = nn.Sequential(
                nn.Conv2d(in_channels, out_channels, 1, stride, bias=False),
                nn.BatchNorm2d(out_channels)
            )
    
    def forward(self, x):
        out = torch.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        out += self.shortcut(x)  # 残差连接
        out = torch.relu(out)
        return out
\`\`\`

ResNet 的关键发现：
- 残差连接使得梯度能够直接流向前层
- 解决了网络退化问题（不是过拟合，而是训练误差增大）
- 指数级降低了训练难度

### DenseNet（2017）

DenseNet 通过将每一层与所有后续层直接连接，进一步增强了特征复用：

\`\`\`python
class DenseBlock(nn.Module):
    def __init__(self, in_channels, growth_rate, num_layers):
        super().__init__()
        self.layers = nn.ModuleList()
        for i in range(num_layers):
            self.layers.append(self._make_layer(in_channels + i * growth_rate, growth_rate))
    
    def _make_layer(self, in_channels, growth_rate):
        return nn.Sequential(
            nn.BatchNorm2d(in_channels), nn.ReLU(inplace=True),
            nn.Conv2d(in_channels, growth_rate * 4, 1, bias=False),
            nn.BatchNorm2d(growth_rate * 4), nn.ReLU(inplace=True),
            nn.Conv2d(growth_rate * 4, growth_rate, 3, padding=1, bias=False)
        )
    
    def forward(self, x):
        features = [x]
        for layer in self.layers:
            new_feature = layer(torch.cat(features, dim=1))
            features.append(new_feature)
        return torch.cat(features, dim=1)
\`\`\`

## 经典 CNN 架构对比

| 架构 | 年份 | Top-5 错误率 | 参数量 | 深度 | 主要贡献 |
|------|------|------------|--------|------|---------|
| LeNet-5 | 1998 | - | 60K | 5 | 基础架构 |
| AlexNet | 2012 | 15.3% | 60M | 8 | 深度学习复兴 |
| VGG-16 | 2014 | 7.3% | 138M | 16 | 小卷积核堆叠 |
| GoogLeNet | 2014 | 6.7% | 5M | 22 | Inception 模块 |
| ResNet-152 | 2015 | 3.6% | 60M | 152 | 残差连接 |
| DenseNet-264 | 2017 | 3.0% | 80M | 264 | 密集连接 |

## 现代 CNN 架构

### EfficientNet（2019）

EfficientNet 通过**复合缩放**（compound scaling）平衡网络深度、宽度和分辨率：

- 深度 $d$：层数增加，捕获更复杂的特征
- 宽度 $w$：每层通道数增加，捕获更细致的特征
- 分辨率 $r$：输入分辨率提高，捕获更细粒度的信息

复合缩放公式：

$$\\text{depth}: d = \\alpha^\\phi$$
$$\\text{width}: w = \\beta^\\phi$$
$$\\text{resolution}: r = \\gamma^\\phi$$

约束条件：$\\alpha \\times \\beta^2 \\times \\gamma^2 \\approx 2$，其中 $\\alpha \\geq 1, \\beta \\geq 1, \\gamma \\geq 1$，$\\phi$ 是复合系数。

\`\`\`python
import torch
import torch.nn as nn
from torchvision.models import efficientnet_b0, EfficientNet_B0_Weights

# 使用预训练的 EfficientNet-B0
model = efficientnet_b0(weights=EfficientNet_B0_Weights.DEFAULT)

# 修改最后的分类器
model.classifier = nn.Sequential(
    nn.Dropout(p=0.2, inplace=True),
    nn.Linear(model.classifier[1].in_features, num_classes)
)
\`\`\`

### ConvNeXt（2022）

ConvNeXt 是一个"现代化"的纯卷积架构，它将现代训练技术（Large Kernel、LayerNorm）与传统 CNN 设计相结合，在多个任务上超过了 Swin Transformer。

设计原则：
1. **Macro design**：更少的阶段数、更大的分辨率
2. **ResNeXt**：使用分组卷积
3. **Inverted Bottleneck**：反向瓶颈设计
4. **Large Kernel**：大卷积核（如 7×7）
5. **LayerNorm**：用 LayerNorm 替代 BatchNorm
6. **GELU**：使用 GELU 激活函数

\`\`\`python
from torchvision.models import convnext_tiny, ConvNeXt_Tiny_Weights

model = convnext_tiny(weights=ConvNeXt_Tiny_Weights.DEFAULT)
\`\`\`

## 训练技巧

### 数据增强

数据增强是提高模型泛化能力的关键技术，它通过对训练样本进行随机变换来增加数据多样性。

\`\`\`python
from torchvision import transforms

train_transform = transforms.Compose([
    transforms.RandomResizedCrop(224, scale=(0.08, 1.0)),  # 随机裁剪
    transforms.RandomHorizontalFlip(p=0.5),                  # 随机水平翻转
    transforms.RandomRotation(degrees=15),                  # 随机旋转
    transforms.ColorJitter(brightness=0.2, contrast=0.2,    # 颜色抖动
                          saturation=0.2, hue=0.1),
    transforms.RandomAffine(degrees=0, translate=(0.1, 0.1)),  # 仿射变换
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                       std=[0.229, 0.224, 0.225]),
    transforms.RandomErasing(p=0.1, scale=(0.02, 0.33)),  # 随机擦除
])

val_transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                       std=[0.229, 0.224, 0.225]),
])
\`\`\`

**Mixup** 和 **CutMix** 是更高级的数据增强技术：

\`\`\`python
def mixup_data(x, y, alpha=1.0):
    if alpha > 0:
        lam = np.random.beta(alpha, alpha)
    else:
        lam = 1
    
    batch_size = x.size(0)
    index = torch.randperm(batch_size).to(x.device)
    
    mixed_x = lam * x + (1 - lam) * x[index, :]
    y_a, y_b = y, y[index]
    return mixed_x, y_a, y_b, lam

def mixup_criterion(criterion, pred, y_a, y_b, lam):
    return lam * criterion(pred, y_a) + (1 - lam) * criterion(pred, y_b)
\`\`\`

### 学习率调度

学习率调度对训练稳定性和收敛速度有重要影响：

\`\`\`python
# 余弦退火
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(
    optimizer, T_max=50, eta_min=1e-6
)

# 学习率预热 + 余弦退火
def warmup_cosine_scheduler(optimizer, warmup_epochs, total_epochs, 
                           min_lr=1e-6, base_lr=0.1):
    def lr_lambda(epoch):
        if epoch < warmup_epochs:
            return epoch / warmup_epochs
        else:
            progress = (epoch - warmup_epochs) / (total_epochs - warmup_epochs)
            return min_lr / base_lr + (1 - min_lr / base_lr) * \\
                   (1 + np.cos(np.pi * progress)) / 2
    return torch.optim.lr_scheduler.LambdaLR(optimizer, lr_lambda)
\`\`\`

### 优化器选择

\`\`\`python
# SGD with Momentum（经典选择）
optimizer = torch.optim.SGD(
    model.parameters(), 
    lr=0.1, 
    momentum=0.9, 
    weight_decay=1e-4,
    nesterov=True
)

# AdamW（现代选择，默认用于 Transformer）
optimizer = torch.optim.AdamW(
    model.parameters(),
    lr=1e-3,
    betas=(0.9, 0.999),
    weight_decay=0.01
)

# Lion（更简单、更高效的优化器）
from torch_optimizer import Lion
optimizer = Lion(model.parameters(), lr=1e-4, weight_decay=0.01)
\`\`\`

## 完整训练流程

\`\`\`python
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import models, transforms
from tqdm import tqdm

def train_one_epoch(model, dataloader, criterion, optimizer, device):
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0
    
    pbar = tqdm(dataloader, desc='Training')
    for images, labels in pbar:
        images, labels = images.to(device), labels.to(device)
        
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item() * images.size(0)
        _, predicted = outputs.max(1)
        total += labels.size(0)
        correct += predicted.eq(labels).sum().item()
        
        pbar.set_postfix({
            'loss': f'{loss.item():.4f}',
            'acc': f'{100.*correct/total:.2f}%'
        })
    
    return running_loss / total, correct / total

def validate(model, dataloader, criterion, device):
    model.eval()
    running_loss = 0.0
    correct = 0
    total = 0
    
    with torch.no_grad():
        for images, labels in tqdm(dataloader, desc='Validating'):
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)
            
            running_loss += loss.item() * images.size(0)
            _, predicted = outputs.max(1)
            total += labels.size(0)
            correct += predicted.eq(labels).sum().item()
    
    return running_loss / total, correct / total

def main():
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    # 数据加载
    transform_train = transforms.Compose([
        transforms.RandomResizedCrop(224),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    
    # 使用 CIFAR-10 数据集
    from torchvision.datasets import CIFAR10
    train_dataset = CIFAR10(root='./data', train=True, transform=transform_train, download=True)
    train_loader = DataLoader(train_dataset, batch_size=256, shuffle=True, num_workers=4)
    
    # 模型
    model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
    model.fc = nn.Linear(model.fc.in_features, 10)  # CIFAR-10 10类
    model = model.to(device)
    
    # 损失函数和优化器
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.SGD(model.parameters(), lr=0.1, momentum=0.9, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=200)
    
    # 训练循环
    best_acc = 0.0
    for epoch in range(200):
        print(f'\\nEpoch {epoch+1}/200')
        
        train_loss, train_acc = train_one_epoch(model, train_loader, criterion, optimizer, device)
        val_loss, val_acc = validate(model, train_loader, criterion, device)  # 用训练集做简化演示
        
        scheduler.step()
        
        print(f'Train Loss: {train_loss:.4f}, Train Acc: {100*train_acc:.2f}%')
        print(f'Val Loss: {val_loss:.4f}, Val Acc: {100*val_acc:.2f}%')
        
        # 保存最佳模型
        if val_acc > best_acc:
            best_acc = val_acc
            torch.save(model.state_dict(), 'best_model.pth')
            print(f'Saved best model with accuracy: {100*best_acc:.2f}%')

if __name__ == '__main__':
    main()
\`\`\`

## 迁移学习

迁移学习是深度学习中最实用的技术之一，它允许我们利用在大规模数据集（如 ImageNet）上预训练的模型：

\`\`\`python
import torch
import torch.nn as nn
from torchvision import models

def load_pretrained_model(num_classes, freeze_backbone=False):
    # 加载预训练的 ResNet-50
    model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
    
    if freeze_backbone:
        # 冻结所有参数，只训练新的分类头
        for param in model.parameters():
            param.requires_grad = False
    
    # 替换最后的分类层
    in_features = model.fc.in_features
    model.fc = nn.Sequential(
        nn.Dropout(0.5),
        nn.Linear(in_features, 512),
        nn.ReLU(inplace=True),
        nn.Dropout(0.3),
        nn.Linear(512, num_classes)
    )
    
    return model

# 使用示例
model = load_pretrained_model(num_classes=10)
# 只有新添加的全连接层会被训练（如果 freeze_backbone=True）
\`\`\`

迁移学习的策略选择：
- **特征提取**：冻结预训练层，只训练新添加的层
- **微调**：解冻部分或全部预训练层，进行端到端训练
- **渐进式微调**：先冻结，训练几轮后逐步解冻更多层

## 模型压缩与部署

### 模型量化

量化将模型参数从浮点数转换为低精度表示：

\`\`\`python
import torch.quantization

# 动态量化（权重静态，激活动态）
quantized_model = torch.quantization.quantize_dynamic(
    model, {nn.Linear, nn.Conv2d}, dtype=torch.qint8
)

# 静态量化（需要校准）
model.eval()
model.qconfig = torch.quantization.get_default_qconfig('fbgemm')
torch.quantization.prepare(model, inplace=True)
# 校准
torch.quantization.convert(model, inplace=True)
\`\`\`

### 模型剪枝

剪枝移除不重要的连接或神经元：

\`\`\`python
import torch.nn.utils.prune as prune

# L1 非结构化剪枝
prune.l1_unstructured(model.conv1, name='weight', amount=0.3)

# 结构化剪枝（移除整个通道）
prune.ln_structured(model.conv2, name='weight', amount=0.3, n=2, dim=0)

# 全局剪枝
parameters_to_prune = [
    (model.conv1, 'weight'),
    (model.conv2, 'weight'),
    (model.fc1, 'weight'),
]
prune.global_unstructured(
    parameters_to_prune, pruning_method=prune.L1Unstructured, amount=0.3
)
\`\`\`

### TorchScript 导出

\`\`\`python
# 追踪法（适用于没有控制流的模型）
model.eval()
example_input = torch.randn(1, 3, 224, 224)
traced_model = torch.jit.trace(model, example_input)
traced_model.save('model_traced.pt')

# 脚本法（适用于有控制流的模型）
script_model = torch.jit.script(model)
script_model.save('model_script.pt')
\`\`\`

## 常见问题与解决方案

### 梯度消失与梯度爆炸

**梯度消失**在深层网络中尤为明显，表现为前面的层梯度接近0，无法有效更新。

解决方案：
- 使用 ReLU 及其变体（LeakyReLU, ELU）
- 批量归一化
- 残差连接
- 适当的权重初始化（Xavier, Kaiming）
- 使用 LSTMs（序列数据）

\`\`\`python
# Kaiming 初始化（适合 ReLU）
nn.init.kaiming_normal_(layer.weight, mode='fan_out', nonlinearity='relu')

# Xavier 初始化（适合 tanh, sigmoid）
nn.init.xavier_uniform_(layer.weight)
\`\`\`

### 过拟合

过拟合发生在模型在训练集上表现良好，但在测试集上泛化能力差。

解决方案：
- 数据增强
- Dropout
- 权重正则化（L1, L2）
- 提前停止（Early Stopping）
- 批量归一化
- 减小模型复杂度

\`\`\`python
# Early Stopping 实现
class EarlyStopping:
    def __init__(self, patience=10, min_delta=0, mode='max'):
        self.patience = patience
        self.min_delta = min_delta
        self.mode = mode
        self.counter = 0
        self.best_score = None
        self.early_stop = False
    
    def __call__(self, score):
        if self.best_score is None:
            self.best_score = score
        elif score < self.best_score + self.min_delta:
            self.counter += 1
            if self.counter >= self.patience:
                self.early_stop = True
        else:
            self.best_score = score
            self.counter = 0
        return self.early_stop
\`\`\`

### 类别不平衡

\`\`\`python
# 加权损失函数
class_counts = torch.tensor([1000, 100, 50, 10])  # 各类别样本数
class_weights = 1.0 / class_counts
class_weights = class_weights / class_weights.sum() * len(class_counts)
criterion = nn.CrossEntropyLoss(weight=class_weights.to(device))

# 采样策略
from torch.utils.data import WeightedRandomSampler
sample_weights = [1.0 / class_counts[label] for _, label in train_dataset]
sampler = WeightedRandomSampler(sample_weights, len(sample_weights))
train_loader = DataLoader(train_dataset, batch_size=256, sampler=sampler)
\`\`\`

## 应用场景

### 图像分类

图像分类是 CNN 最基础的应用，包括：
- 物体识别（ImageNet）
- 场景分类
- 人脸识别
- 医学图像诊断

### 目标检测

目标检测不仅分类，还定位图像中的物体：

\`\`\`python
from torchvision.models.detection import fasterrcnn_resnet50_fpn, FasterRCNN_ResNet50_FPN_Weights

model = fasterrcnn_resnet50_fpn(weights=FasterRCNN_ResNet50_FPN_Weights.DEFAULT)
model.eval()

# 预测
with torch.no_grad():
    predictions = model(images)
\`\`\`

### 语义分割

像素级别的分类：

\`\`\`python
from torchvision.models.segmentation import deeplabv3_resnet50, DeepLabV3_ResNet50_Weights

model = deeplabv3_resnet50(weights=DeepLabV3_ResNet50_Weights.DEFAULT)
model.eval()
\`\`\`

### 目标跟踪

视频中连续追踪物体：

- 多目标跟踪（MOT）
- 单目标跟踪（SOT）
- 行人检测与跟踪
- 自动驾驶中的障碍物跟踪

### 其他应用

- **姿态估计**：检测人体关键点
- **图像生成**：GAN、Diffusion Model 的基础
- **超分辨率**：提升图像清晰度
- **风格迁移**：艺术风格转换
- **图像去噪**：降噪和修复

## 结语

卷积神经网络自诞生以来，经历了数十年的发展，从 LeNet-5 的手写数字识别，到 AlexNet 掀起深度学习浪潮，再到 ResNet 的残差连接革命，每一次突破都推动着计算机视觉领域的进步。

理解 CNN 的核心原理——卷积操作、局部感受野、权重共享——是掌握现代深度视觉模型的基础。同时，熟悉经典架构的设计理念和训练技巧，对于构建高效的视觉系统至关重要。

在实践中，我们应该：

1. **理解数据**：选择合适的数据增强策略
2. **选择合适的模型**：平衡性能和计算资源
3. **遵循训练最佳实践**：正确的初始化、学习率调度、正则化
4. **善用迁移学习**：加速开发周期
5. **关注模型效率**：为实际部署考虑量化、剪枝

> CNN 的发展告诉我们：**简单而深刻的思想，往往能够撬动整个领域的变革。** 正如残差连接用一条简单的直连，解决了深层网络训练的难题。

---

*本文涵盖了 CNN 的核心概念、经典架构和实战技巧。如有疏漏或疑问，欢迎探讨交流。*
`,ln=`# XGBoost：梯度提升的工程极致

> *"XGBoost 代表了一种将算法与系统设计深度融合的思路——不是在实验室里追求理论上的最优，而是在真实场景中追求工程上的极致。"*
> — 陈亮，XGBoost 作者之一

## 什么是 XGBoost？

**XGBoost**（eXtreme Gradient Boosting）是_gradient boosting_算法的高性能开源实现，由陈亮（Tianqi Chen）于 2014 年创建。它在 Kaggle 等数据科学竞赛中横扫千军，几乎成为了梯度提升决策树的代名词。

XGBoost 的核心思想可以概括为：**通过集成多棵弱学习器（决策树），逐步减少预测误差，每一棵树都专注于修正前面所有树的残差**。与传统方法相比，它在算法层面和工程层面都做到了极致的优化。

### XGBoost 与其他梯度提升方法的对比

| 特性 | 传统 GBDT | XGBoost | LightGBM | CatBoost |
|------|-----------|---------|----------|----------|
| **提出年份** | 2001 | 2014 | 2017 | 2017 |
| **建树算法** | 贪心枚举 | 贪心枚举 + 近似 | GOSS/EFB | Ordered Boosting |
| **分裂点搜索** | 精确贪心 | 精确 + 近似 | 直方图 | 精确 + 直方图 |
| **缺失值处理** | 不支持 | 内置支持 | 内置支持 | 内置支持 |
| **类别特征** | 需编码 | 需编码 | 优化编码 | 原生支持 |
| **并行化** | 特征级 | 特征级 + 块级 | 特征级 | 特征级 |
| **正则化** | 简单 | L1/L2 + 复杂度控制 | L1/L2 | Ordered TS |
| **原生语言** | - | C++/Python/R | C++/Python/R | C++/Python/R |

## 梯度提升决策树原理

### 加法模型与前向分步算法

GBDT 属于加法模型（Additive Model），最终预测是 $K$ 棵树的加权求和：

$$\\hat{y}_i = \\sum_{k=1}^{K} f_k(x_i), \\quad f_k \\in \\mathcal{F}$$

其中 $\\mathcal{F}$ 是所有决策树的空间。每棵树 $f_k(x)$ 输入样本 $x$，输出一个实数值（回归）或类别概率（分类）。

前向分步算法逐棵学习这些树。假设已经学习了前 $t-1$ 棵树，第 $t$ 棵树的优化目标是：

$$\\mathcal{L}^{(t)} = \\sum_{i=1}^{n} l(y_i, \\hat{y}_i^{(t-1)} + f_t(x_i)) + \\Omega(f_t)$$

其中 $l$ 是损失函数，$\\Omega$ 是正则化项。

### 泰勒展开与二阶近似

XGBoost 的关键创新在于：对损失函数做**二阶泰勒展开**，直接用梯度信息指导树的构建。

将损失函数在 $\\hat{y}_i^{(t-1)}$ 处展开：

$$\\mathcal{L}^{(t)} \\approx \\sum_{i=1}^{n} \\left[ l(y_i, \\hat{y}_i^{(t-1)}) + g_i f_t(x_i) + \\frac{1}{2} h_i f_t^2(x_i) \\right] + \\Omega(f_t)$$

其中：

$$g_i = \\frac{\\partial l(y_i, \\hat{y}^{(t-1)})}{\\partial \\hat{y}^{(t-1)}} \\quad \\text{（一阶导数/梯度）}$$

$$h_i = \\frac{\\partial^2 l(y_i, \\hat{y}^{(t-1)})}{\\partial (\\hat{y}^{(t-1)})^2} \\quad \\text{（二阶导数/海森矩阵）}$$

去掉常数项 $l(y_i, \\hat{y}_i^{(t-1)})$，优化目标变为：

$$\\tilde{\\mathcal{L}}^{(t)} = \\sum_{i=1}^{n} \\left[ g_i f_t(x_i) + \\frac{1}{2} h_i f_t^2(x_i) \\right] + \\Omega(f_t)$$

**为什么用二阶展开？**
- 一阶信息只告诉你"往哪个方向走"，二阶信息还告诉你"走多快"——收敛更快更稳定
- 相比一阶近似，二阶展开对损失的近似精度更高
- 当 $l$ 是逻辑损失时，二阶近似等价于牛顿法，理论上收敛更快

### 决策树的正则化

XGBoost 对每棵树定义了显式的正则化项：

$$\\Omega(f) = \\gamma T + \\frac{1}{2}\\lambda \\sum_{j=1}^{T} w_j^2$$

其中：
- $T$ 是树的叶节点数（控制树的复杂度）
- $w_j$ 是第 $j$ 个叶节点的输出权重
- $\\gamma$ 是叶节点数的惩罚系数
- $\\lambda$ 是 L2 正则化系数

### 分裂增益的精确计算

给定一个分裂点 $P$，将样本划分为左子集 $I_L$ 和右子集 $I_R$，则分裂增益为：

$$\\text{Gain} = \\frac{1}{2} \\left[ \\frac{G_L^2}{H_L + \\lambda} + \\frac{G_R^2}{H_R + \\lambda} - \\frac{(G_L + G_R)^2}{H_L + H_R + \\lambda} \\right] - \\gamma$$

其中 $G = \\sum_{i \\in I} g_i$，$H = \\sum_{i \\in I} h_i$。

**分裂增益的直观理解**：
- 分子 $G^2$ 衡量样本梯度的"方向一致性"——梯度越同向，$G^2$ 越大
- 分母 $H + \\lambda$ 中的 $H$ 衡量梯度的"幅度总和"
- $\\lambda$ 防止过拟合：平滑叶节点权重
- $\\gamma$ 直接惩罚叶节点数量

### 缺失值处理

XGBoost 内置了缺失值处理机制。对于每个特征：

1. 在训练时，将缺失样本分别放入左子树和右子树，计算不包含缺失样本时的增益
2. 选择使增益最大（或损失最小）的方向作为默认分裂方向
3. 预测时，缺失样本自动沿默认方向走

\`\`\`python
# XGBoost 自动处理缺失值
import xgboost as xgb

model = xgb.XGBClassifier(
    missing=-999,  # 指定缺失值的标记（XGBoost 默认用 NaN 或 -1/-999）
    enable_categorical=True
)

# 训练数据中可以包含 NaN，XGBoost 会自动处理
model.fit(X_train, y_train)
\`\`\`

## 目标函数与损失函数

XGBoost 支持多种损失函数，适用于不同任务：

### 回归任务

**均方误差（MSE / L2 Loss）**：

$$l(y_i, \\hat{y}_i) = (y_i - \\hat{y}_i)^2$$

梯度：$g_i = -2(y_i - \\hat{y}_i)$，海森矩阵：$h_i = 2$

**绝对误差（MAE / L1 Loss）**：

$$l(y_i, \\hat{y}_i) = |y_i - \\hat{y}_i|$$

梯度：$g_i = \\text{sign}(\\hat{y}_i - y_i)$，海森矩阵：$h_i = 1$（次梯度）

**Huber 损失**（MSE 和 MAE 的折中）：

$$l(y_i, \\hat{y}_i) = \\begin{cases} \\frac{1}{2}(y_i - \\hat{y}_i)^2 & \\text{if } |y_i - \\hat{y}_i| \\leq \\delta \\\\ \\delta |y_i - \\hat{y}_i| - \\frac{1}{2}\\delta^2 & \\text{otherwise} \\end{cases}$$

### 分类任务

**逻辑损失（Logistic Loss）**：

$$l(y_i, \\hat{y}_i) = -y_i \\log(\\hat{p}_i) - (1-y_i)\\log(1-\\hat{p}_i)$$

其中 $\\hat{p}_i = \\frac{1}{1 + e^{-\\hat{y}_i}}$，$\\hat{y}_i$ 是原始输出（未被 sigmoid 归一化）

梯度：$g_i = \\hat{p}_i - y_i$，海森矩阵：$h_i = \\hat{p}_i(1-\\hat{p}_i)$

**Softmax 损失（多分类）**：

$$l(y_i, \\hat{y}_i) = -\\log\\left( \\frac{e^{\\hat{y}_{i,y_i}}}{\\sum_{c} e^{\\hat{y}_{i,c}}} \\right)$$

## 树的分裂策略

### 精确贪心算法

最朴素的建树方法：枚举所有可能的分裂点，计算每个分裂的增益，选择最优。

\`\`\`python
# XGBoost 精确贪心算法
import xgboost as xgb

params = {
    'tree_method': 'hist',  # 精确贪心用 'exact'
    'max_depth': 6,
    'learning_rate': 0.1,
    'objective': 'binary:logistic',
}

# 精确贪心（适用于小数据集）
model = xgb.XGBClassifier(
    tree_method='exact',  # 精确枚举所有分裂点
    max_depth=6,
    min_child_weight=1,
)
\`\`\`

但精确贪心的复杂度是 $O(n \\cdot d \\cdot K)$，其中 $n$ 是样本数，$d$ 是特征数，$K$ 是树数。当 $n$ 很大时，计算代价极高。

### 近似算法（Approximate Algorithm）

XGBoost 提出了基于**特征值分位数**的近似算法：

1. 对每个特征，根据其分位数（如百分位数）选出候选分裂点
2. 只在这些候选分裂点上计算增益
3. 将连续特征离散化为直方图桶

\`\`\`python
# 近似算法（推荐用于大数据集）
model = xgb.XGBClassifier(
    tree_method='hist',      # 基于直方图的近似
    max_bin=256,              # 直方图的桶数
)
\`\`\`

**近似算法的优势**：
- 大幅减少候选分裂点数量
- 可以处理超大规模数据
- 支持并行化

### 权重分位数 sketch（Weighted Quantile Sketch）

在近似算法中，候选分裂点的选择不是均匀的，而是根据**二阶导数 $h_i$ 作为权重**来选择：

$$|h_i| \\sum_{j} w_j = 1$$

即选择满足以下条件的分裂点：

$$\\left| \\frac{1}{\\sum_{(x, h) \\in S_k} h} \\sum_{(x, h) \\in S_k} h - \\frac{1}{n} \\right| < \\epsilon$$

其中 $\\epsilon$ 是近似误差参数。

### 列采样与特征并行

XGBoost 支持**列采样**（Column Subsampling），类似随机森林：

\`\`\`python
model = xgb.XGBClassifier(
    colsample_bytree=0.8,  # 每棵树随机选择 80% 的特征
    colsample_bylevel=0.8, # 每层随机选择 80% 的特征
)
\`\`\`

### 学习率（Shrinkage）与行采样

\`\`\`python
model = xgb.XGBClassifier(
    learning_rate=0.1,        # 收缩系数（也称 eta）
    subsample=0.8,            # 每棵树随机选择 80% 的样本
    colsample_bytree=0.8,     # 每棵树随机选择 80% 的特征
    min_child_weight=3,       # 叶节点的最小样本权重和
)
\`\`\`

## 防止过拟合

XGBoost 提供了多种正则化手段：

### 显式正则化

\`\`\`python
params = {
    'lambda': 1.0,  # L2 正则化
    'alpha': 0.0,  # L1 正则化
    'gamma': 0.0,  # 最小分裂增益阈值
}
\`\`\`

### 树结构正则化

\`\`\`python
model = xgb.XGBClassifier(
    max_depth=6,           # 树的最大深度
    min_child_weight=1,   # 叶节点的最小权重和
    max_delta_step=0,     # 限制叶节点输出的最大步长
)
\`\`\`

### Early Stopping

\`\`\`python
# 监控验证集表现，自动停止
model = xgb.XGBClassifier(
    n_estimators=1000,
    early_stopping_rounds=50,
    eval_metric='auc',
)

model.fit(
    X_train, y_train,
    eval_set=[(X_val, y_val)],
    verbose=50,
)
\`\`\`

输出示例：

\`\`\`
[0] validation_0-auc:0.82314
[10] validation_0-auc:0.89123
[20] validation_0-auc:0.90345
[30] validation_0-auc:0.90712
[40] validation_0-auc:0.90567  # 开始下降
...
Early stopping at iteration 41
Best iteration: 31
\`\`\`

## 特征重要性

XGBoost 提供了多种衡量特征重要性的指标：

### 常用指标

\`\`\`python
# 训练模型后获取特征重要性
importance = model.feature_importances_

# 使用 Shap 值（最权威）
import shap
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# 可视化
shap.summary_plot(shap_values, X_test, feature_names=feature_names)
\`\`\`

### 重要性的计算方式

| 指标 | 计算方式 | 适用场景 |
|------|---------|---------|
| **weight** | 特征被用作分裂点的次数 | 粗略评估 |
| **gain** | 所有分裂的平均增益 | 默认选项 |
| **cover** | 分裂涉及的样本覆盖量 | 类别不平衡 |
| **total_gain** | 所有分裂的增益之和 | 综合评估 |
| **total_cover** | 所有分裂的覆盖量之和 | 综合评估 |

\`\`\`python
# 查看不同指标的重要性
importance_df = xgb.plot_importance(
    model,
    importance_type='gain',  # weight / gain / cover / total_gain / total_cover
    max_num_features=20,
    show_values=False,
)
\`\`\`

## 实战：完整分类流程

\`\`\`python
import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score

# ===================== 数据准备 =====================
# 使用 sklearn 的信用卡欺诈数据集作为演示
from sklearn.datasets import fetch_openml
credit = fetch_openml(name='credit-g', as_frame=True)
X, y = credit.data, credit.target

# 编码目标变量
le = LabelEncoder()
y = le.fit_transform(y)

# 分离数值和类别特征
numeric_features = X.select_dtypes(include=['number']).columns.tolist()
categorical_features = X.select_dtypes(include=['category', 'object']).columns.tolist()

# ===================== 特征工程 =====================
# XGBoost 可以直接处理类别特征
X_cat = X[categorical_features].astype('category')

# 合并特征
X_processed = pd.concat([
    X[numeric_features],
    X_cat
], axis=1)

# 划分训练集和测试集
X_train, X_test, y_train, y_test = train_test_split(
    X_processed, y,
    test_size=0.2,
    stratify=y,
    random_state=42
)

# ===================== 模型训练 =====================
# 方法一：Scikit-Learn 接口（推荐）
model = xgb.XGBClassifier(
    n_estimators=500,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    min_child_weight=3,
    reg_alpha=0.1,
    reg_lambda=1.0,
    gamma=0.1,
    objective='binary:logistic',
    eval_metric='auc',
    early_stopping_rounds=50,
    enable_categorical=True,
    tree_method='hist',
    device='cuda',  # GPU 加速
    random_state=42,
)

model.fit(
    X_train, y_train,
    eval_set=[(X_test, y_test)],
    verbose=50,
)

# ===================== 模型评估 =====================
y_pred = model.predict(X_test)
y_pred_proba = model.predict_proba(X_test)[:, 1]

print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print(f"AUC-ROC: {roc_auc_score(y_test, y_pred_proba):.4f}")
print("\\nClassification Report:")
print(classification_report(y_test, y_pred))

# ===================== 交叉验证 =====================
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(model, X_processed, y, cv=cv, scoring='roc_auc')
print(f"CV AUC: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
\`\`\`

## 高级调参技巧

### 参数分组

XGBoost 的参数可以分为几组来调节：

**第一组：收敛速度**
\`\`\`python
params = {
    'n_estimators': 1000,  # 迭代次数（配合 early_stopping）
    'learning_rate': 0.05,  # 步长 shrink
    'early_stopping_rounds': 50,
}
\`\`\`

**第二组：树结构**
\`\`\`python
params = {
    'max_depth': 6,           # 最大深度（4-10）
    'min_child_weight': 1,    # 最小叶节点权重（数据量小时用 1，数据量大时用 5-10）
    'gamma': 0.1,             # 最小分裂增益
}
\`\`\`

**第三组：随机化（正则化）**
\`\`\`python
params = {
    'subsample': 0.8,          # 行采样（0.6-1.0）
    'colsample_bytree': 0.8,   # 列采样（0.6-1.0）
    'colsample_bylevel': 1.0,  # 每层列采样
}
\`\`\`

**第四组：正则化参数**
\`\`\`python
params = {
    'reg_alpha': 0.1,  # L1 正则化
    'reg_lambda': 1.0, # L2 正则化
}
\`\`\`

### 贝叶斯调参

\`\`\`python
from sklearn.model_selection import BayesianOptimization
import xgboost as xgb

def xgb_cv(n_estimators, max_depth, learning_rate, subsample, colsample_bytree, min_child_weight):
    model = xgb.XGBClassifier(
        n_estimators=int(n_estimators),
        max_depth=int(max_depth),
        learning_rate=learning_rate,
        subsample=subsample,
        colsample_bytree=colsample_bytree,
        min_child_weight=int(min_child_weight),
        enable_categorical=True,
        tree_method='hist',
        random_state=42,
        verbosity=0,
    )
    scores = cross_val_score(model, X_train, y_train, cv=3, scoring='roc_auc')
    return scores.mean()

pbounds = {
    'n_estimators': (100, 1000),
    'max_depth': (3, 10),
    'learning_rate': (0.01, 0.3),
    'subsample': (0.6, 1.0),
    'colsample_bytree': (0.6, 1.0),
    'min_child_weight': (1, 10),
}

optimizer = BayesianOptimization(
    f=xgb_cv,
    pbounds=pbounds,
    random_state=42,
    verbose=2
)
optimizer.maximize(init_points=5, n_iter=25)

print(f"Best AUC: {optimizer.max['target']:.4f}")
print(f"Best params: {optimizer.max['params']}")
\`\`\`

### 学习曲线分析

\`\`\`python
# 分析不同学习率的效果
results_list = []
for lr in [0.01, 0.05, 0.1, 0.3]:
    model = xgb.XGBClassifier(
        n_estimators=500,
        learning_rate=lr,
        max_depth=6,
        eval_metric='auc',
        early_stopping_rounds=50,
        enable_categorical=True,
        tree_method='hist',
        random_state=42,
    )
    model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
    results_list.append({
        'learning_rate': lr,
        'best_iteration': model.best_iteration,
        'best_score': model.best_score,
    })

results_df = pd.DataFrame(results_list)
print(results_df)
\`\`\`

## 类别特征与原生支持

从 XGBoost 1.5 开始，支持**原生类别特征**处理，无需手动 one-hot 编码：

\`\`\`python
import pandas as pd
import xgboost as xgb

# 准备类别特征数据
df = pd.DataFrame({
    'feature1': pd.Categorical(['A', 'B', 'A', 'C', 'B']),
    'feature2': pd.Categorical([1, 2, 3, 1, 2]),
    'numeric1': [0.1, 0.5, 0.3, 0.8, 0.2],
})

# 指定特征类型
df['feature1'] = df['feature1'].astype('category')
df['feature2'] = df['feature2'].astype('category')

# 训练时启用类别支持
model = xgb.XGBClassifier(
    enable_categorical=True,
    tree_method='hist',
)
model.fit(df, y)
\`\`\`

## XGBoost 回归与自定义目标

### 回归任务

\`\`\`python
# 方法一：使用 XGBRegressor
model = xgb.XGBRegressor(
    n_estimators=500,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    reg_alpha=0.1,
    reg_lambda=1.0,
    enable_categorical=True,
    tree_method='hist',
)

model.fit(
    X_train, y_train,
    eval_set=[(X_test, y_test)],
    early_stopping_rounds=50,
)
\`\`\`

### 自定义损失函数

\`\`\`python
import xgboost as xgb
import numpy as np

# 定义自定义损失函数（需要提供梯度和海森矩阵）
def custom_mse(y_true, y_pred):
    grad = y_pred - y_true
    hess = np.ones_like(grad)  # MSE 的海森矩阵为 1
    return grad, hess

# 定义自定义评估指标
def custom_mae(y_true, y_pred):
    mae = np.mean(np.abs(y_true - y_pred))
    return 'custom_mae', mae

model = xgb.XGBClassifier(
    objective=custom_mse,
    n_estimators=500,
    enable_categorical=True,
)

model.fit(
    X_train, y_train,
    eval_metric=custom_mae,
    verbose=50,
)
\`\`\`

## XGBoost 的工程实现

### 稀疏感知（Sparsity-aware）算法

XGBoost 为稀疏数据（one-hot 编码、缺失值、用户未记录行为）专门优化：

\`\`\`python
# XGBoost 将稀疏矩阵压缩为 CSC/CSR 格式
# 只需 O(nnz) 的内存，而非 O(n * d)
from scipy.sparse import csr_matrix

X_sparse = csr_matrix(X_processed.values)

model = xgb.XGBClassifier(
    tree_method='hist',  # 稀疏感知建树
)
model.fit(X_sparse, y)
\`\`\`

### 缓存感知访问（Cache-aware Access）

- 梯度统计量 $(g_i, h_i)$ 按特征连续存储
- 使用预取（prefetch）减少缓存未命中
- 减少随机内存访问，提升 CPU 利用率

### 块结构（Block Structure）

- 按列存储训练数据，每列对应一个特征的所有值
- 预排序后的数据以 CSC 格式存储
- 并行计算所有特征的一阶梯度和二阶导数

### GPU 加速

\`\`\`python
# 使用 GPU 训练
model = xgb.XGBClassifier(
    tree_method='hist',  # GPU hist 算法
    device='cuda',
    max_bin=256,
)

# GPU 直方图算法在数据量大时加速显著
model.fit(X_train, y_train, verbose=50)
\`\`\`

### 分布式训练

\`\`\`python
# XGBoost 支持 Spark、Flink、Dask 等分布式框架
# 以下为 PySpark 示例
from xgboost.spark import SparkXGBClassifier

spark_model = SparkXGBClassifier(
    num_workers=4,
    max_depth=6,
    learning_rate=0.1,
    n_estimators=500,
    reg_lambda=1.0,
)

# 在 Spark DataFrame 上训练
spark_model.fit(spark_df)
\`\`\`

## 模型保存与部署

\`\`\`python
import joblib

# ===================== 模型保存 =====================
# 方法一：joblib（通用）
joblib.dump(model, 'xgb_model.joblib')

# 方法二：XGBoost 原生 JSON 格式（推荐，保留元信息）
model.save_model('xgb_model.json')

# 方法三：UBJSON（更小更快）
model.save_model('xgb_model.ubj')

# ===================== 模型加载 =====================
loaded_model = xgb.XGBClassifier()
loaded_model.load_model('xgb_model.json')

# ===================== 模型导出 =====================
# 导出为 ONNX 格式（跨平台部署）
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

initial_type = [('float_input', FloatTensorType([None, X_train.shape[1]]))]
onnx_model = convert_sklearn(model, initial_types=initial_type)

with open('xgb_model.onnx', 'wb') as f:
    f.write(onnx_model.SerializeToString())

# ===================== 生产环境预测 =====================
# 使用 njobs 并行预测
import numpy as np

def predict_proba_batch(model, X_batch, batch_size=10000):
    """分批预测，避免内存溢出"""
    n_samples = X_batch.shape[0]
    predictions = []
    for i in range(0, n_samples, batch_size):
        batch = X_batch[i:i+batch_size]
        pred = model.predict_proba(batch)
        predictions.append(pred)
    return np.vstack(predictions)
\`\`\`

## 与其他模型的关系

### XGBoost vs LightGBM

| 维度 | XGBoost | LightGBM |
|------|---------|----------|
| **建树方向** | 逐层生长（level-wise） | 逐叶生长（leaf-wise） |
| **分裂点** | 基于特征的直方图 | 基于样本权重的直方图 |
| **内存占用** | 较高（预排序矩阵） | 较低（只存储梯度） |
| **稀疏数据** | 稀疏感知优化 | 稀疏优化 |
| **类别特征** | 原生支持 | 原生支持 |
| **训练速度** | 中等 | 更快（尤其大数据） |
| **准确率** | 相当 | 相当 |
| **大数据支持** | 好 | 更好（百万级+） |

\`\`\`python
# LightGBM 逐叶生长示例
# LightGBM 每次选择增益最大的叶节点分裂
# XGBoost 则每次分裂一层（所有叶节点）

# XGBoost 的 level-wise 更保守，不易过拟合
# LightGBM 的 leaf-wise 更快，但需要更小的 max_depth
\`\`\`

### XGBoost vs 随机森林

| 维度 | XGBoost | 随机森林 |
|------|---------|---------|
| **集成方式** | 加法（前向逐步） | Bagging（并行） |
| **弱学习器** | 决策树（带 boosting 权重） | 决策树（独立训练） |
| **偏差-方差** | 低偏差 | 低方差 |
| **对噪声的鲁棒性** | 较差 | 较强 |
| **调参难度** | 较高 | 较低 |
| **可解释性** | 较低 | 较高 |

### XGBoost vs 神经网络

| 维度 | XGBoost | 神经网络 |
|------|---------|---------|
| **数据需求** | 中等 | 大量 |
| **特征工程** | 可自动处理 | 需要较多 |
| **可解释性** | 高（特征重要性） | 低（黑盒） |
| **训练时间** | 分钟-小时 | 小时-天 |
| **表格数据** | **最优选择** | 良好 |
| **非结构化数据** | 不适用 | 最优选择 |

对于**结构化/表格数据**，XGBoost 和 LightGBM 仍然是 Kaggle 竞赛的主流选择，在大多数任务上不逊于甚至优于深度学习。

## 常见问题与解决方案

### 过拟合

症状：训练集 AUC 接近 1，验证集 AUC 很低。

解决方案：
\`\`\`python
# 1. 减少模型复杂度
model = xgb.XGBClassifier(
    max_depth=4,           # 从 6 降到 4
    min_child_weight=5,     # 增加最小叶节点权重
)

# 2. 增强正则化
model = xgb.XGBClassifier(
    reg_alpha=0.5,   # 增加 L1 正则化
    reg_lambda=2.0, # 增加 L2 正则化
)

# 3. 增加随机化
model = xgb.XGBClassifier(
    subsample=0.7,        # 减少行采样
    colsample_bytree=0.7, # 减少列采样
)

# 4. 降低学习率，增加迭代次数
model = xgb.XGBClassifier(
    learning_rate=0.01,
    n_estimators=2000,
    early_stopping_rounds=100,
)
\`\`\`

### 类别不平衡

\`\`\`python
# 方法一：scale_pos_weight
# 对于二分类：负样本数 / 正样本数
model = xgb.XGBClassifier(
    scale_pos_weight=sum(y_train == 0) / sum(y_train == 1),
)

# 方法二：sample_weight
sample_weights = np.where(y_train == 1, 10, 1)
model.fit(X_train, y_train, sample_weight=sample_weights)

# 方法三：AUC 作为评估指标
model = xgb.XGBClassifier(
    eval_metric='auc',
)
\`\`\`

### 预测概率校准

\`\`\`python
from sklearn.calibration import CalibratedClassifierCV

# Platt Scaling（逻辑斯蒂回归校准）
calibrated_model = CalibratedClassifierCV(
    model,
    method='isotonic',  # isotonic 或 sigmoid
    cv=5
)
calibrated_model.fit(X_train, y_train)

y_pred_proba_calibrated = calibrated_model.predict_proba(X_test)
\`\`\`

### 特征质量差

\`\`\`python
# 1. 使用 eval_metric 为 logloss 而非 auc
model = xgb.XGBClassifier(eval_metric='logloss')

# 2. 检查特征分布
import matplotlib.pyplot as plt

for col in numeric_features:
    plt.hist(X_train[col], bins=50)
    plt.title(col)
    plt.show()

# 3. 移除低方差特征
from sklearn.feature_selection import VarianceThreshold
selector = VarianceThreshold(threshold=0.01)
X_filtered = selector.fit_transform(X_train)
\`\`\`

## 结语

XGBoost 的成功不是偶然的。它在算法、工程和工程-算法协同三个层面都做到了极致：

- **算法层面**：二阶泰勒展开、显式正则化、缺失值处理、近似搜索
- **工程层面**：稀疏感知、缓存优化、块结构、GPU 加速、分布式训练
- **协同设计**：每个工程优化都有算法动机，每个算法决策都考虑了工程可行性

更重要的是，XGBoost 证明了**好的工程实现和好的算法一样重要**。同样的梯度提升框架，一个经过精心工程优化的实现可以在真实数据上快几十倍、占用少几倍的内存。

在深度学习大放异彩的今天，XGBoost 仍然牢牢占据着表格数据的统治地位。对于每一个数据科学实践者来说，深入理解 XGBoost 的原理与工程细节，仍然是基本功中的基本功。

> **实用建议**：
> 1. 小数据集（< 1 万样本）优先用精确贪心，大数据集用 hist
> 2. 先用默认参数跑一个 baseline，再调参
> 3. 类别特征直接用 \`enable_categorical\`，别手动编码
> 4. 始终用 \`early_stopping_rounds\`，别手动定 \`n_estimators\`
> 5. 调参时优先：learning_rate → max_depth → min_child_weight → subsample → reg_lambda

---

*本文参考了 XGBoost 原论文（KDD 2016）及陈亮的公开分享。*
`,cn=`# 博客搭建记录

## 前言

这个个人网站是我使用 **Vue 3** + **Vite** 从零开始搭建的。最初的目的很简单：找一个地方记录学习过程中的思考、踩坑与收获。

几年下来，网站从最初的单页逐步演变成了一个包含博客、动画实验、技术文章的个人数字空间。技术栈有所升级，但核心诉求从未改变——**写自己想写的东西**。

## 技术选型

选择 Vue 3 是因为它轻量、灵活，Composition API 写起来非常顺手。配合 Vite 作为构建工具，开发体验极佳——热更新几乎是即时的。

博客系统采用了 Markdown 文件存储 + 动态加载的方案：

- 所有文章以 \`.md\` 文件的形式存放在 \`/src/markdowns/\` 目录
- 使用 \`import.meta.glob\` 动态加载所有 Markdown 文件，无需重启服务即可预览新文章
- 通过 \`MarkdownRenderer\` 组件渲染内容，支持代码高亮与 KaTeX 数学公式
- 文章列表自动提取标题、日期、阅读时间（按字数估算）和目录（TOC）

\`\`\`javascript
// 核心加载逻辑
const markdownModules = import.meta.glob('../markdowns/*.md', { eager: true, query: '?raw', import: 'default' })

// 自动生成摘要
function buildExcerpt(content) {
  return content
    .replace(/\`\`\`[\\s\\S]*?\`\`\`/g, '')   // 移除代码块
    .replace(/[#>*_\\-\`]/g, '')         // 移除 Markdown 语法
    .replace(/\\s+/g, ' ')
    .trim()
    .slice(0, 120)
    .concat('…')
}
\`\`\`

## 页面结构

\`\`\`
/           主页 - Three.js 粒子动画 + 背景轮播 + 今日一言
/blog       博客列表与文章阅读（自动加载 markdowns/ 下所有 .md）
/about      关于页面
/animation  动画展示（Three.js 3D 地球、自转星空 Rubik 魔方；三体问题）
\`\`\`

## 核心功能

### 国际化（i18n）

站点支持中英文切换，通过 \`vue-i18n\` 实现。所有页面文案、博客元信息均可本地化。

\`\`\`javascript
// 路由级切换，无需重载页面
router.replace({ ...route, params: { locale: lang } })
\`\`\`

### Three.js 动画实验

\`/animation\` 页面是技术探索区，目前包含：

- **3D 地球**：自定义着色器渲染光照、大气辉光、昼夜分界线，支持鼠标拖拽旋转
- **自转星空**：以赤道坐标投影星星数据，带极昼极夜和星座连线效果
- **三体问题**：经典力学数值积分可视化，模拟多个天体在引力作用下的混沌运动
- **Rubik 魔方**：实时 3D 魔方模拟，支持键盘/鼠标交互操作

### 文章系统

目前已发布的专题文章涵盖：

| 文章 | 主题 | 字数 |
|------|------|------|
| JavaScript 异步编程 | Promise / async-await / 事件循环 | ~2K |
| 强化学习：从 MDP 到 DQN | RL 理论、TD 学习、深度 Q 网络 | ~5K |
| 卷积神经网络 | CNN 原理、经典架构、训练技巧 | ~10K |
| XGBoost：梯度提升的工程极致 | GBDT、二阶泰勒展开、工程实现 | ~8K |

## 未来计划

- [ ] 增加文章分类与标签系统
- [ ] 添加搜索功能
- [ ] 优化移动端体验
- [ ] 增加评论区
- [ ] 支持暗色 / 亮色主题切换
- [ ] 添加博客订阅（RSS）
- [ ] 增加文章赞赏 / 打赏功能

## 结语

这个博客本身也是一个持续迭代的项目。从最初的静态页面到如今支持 i18n、Three.js 动画、Markdown 渲染的个人站，每一步都是边学边做。

> 最好的学习方式，就是把学到的东西讲出来、写下来。

如果你有任何建议或想法，欢迎通过 GitHub 提 Issue 或 PR。

---

*本篇文章最后更新于 2026 年 5 月。*

`,_n=`### 一、理论所（杭高院依托理论所招生）

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
`,dn=["innerHTML"],mn={__name:"MarkdownRenderer",props:{source:{type:String,default:""}},emits:["rendered"],setup(M,{emit:a}){const L=M,{t:N}=V(),f=A(null),w=a;function $(l){return l.toLowerCase().normalize("NFC").replace(/[\u4e00-\u9fff]/g,_=>_.charCodeAt(0).toString(36)).replace(/[^\w\s-]/g,"").trim().replace(/[\s_-]+/g,"-").replace(/^-+|-+$/g,"")}const b=new en({html:!0,linkify:!0,typographer:!0,highlight(l,_){const r=_&&S.getLanguage(_)?_:null,c=r?S.highlight(l,{language:r,ignoreIllegals:!0}).value:S.highlightAuto(l).value;return`<div class="code-block-wrapper"><pre class="hljs"><code class="hljs language-${r||"plaintext"}">${c}</code></pre></div>`}});b.use(tn),b.use(q,{slugify:$,level:[2,3,4],permalink:q.permalink.headerLink()});function y(l){if(!l)return"";const _=[];let r=l.replace(/```[\s\S]*?```/g,c=>(_.push(c),`__CODE_BLOCK_${_.length-1}__`));return r=r.replace(/\$\$([\s\S]+?)\$\$/g,(c,i)=>{try{return`<div class="katex-block">${F.renderToString(i.trim(),{displayMode:!0,throwOnError:!1})}</div>`}catch{return`$$${i}$$`}}).replace(new RegExp("(?<!\\w)\\$([^\\n$]+?)\\$","g"),(c,i)=>{try{return`<span class="katex-inline">${F.renderToString(i.trim(),{displayMode:!1,throwOnError:!1})}</span>`}catch{return`$${i}$`}}),_.forEach((c,i)=>{r=r.replace(`__CODE_BLOCK_${i}__`,c)}),r}function v(l){if(!l)return l;const _=window.location.origin;return l.replace(/<img\s+([^>]*?)>/g,(r,c)=>c.includes("loading=")?r:`<img ${c} loading="lazy">`).replace(/<a\s+([^>]*?)>/g,(r,c)=>{const i=c.match(/href="([^"]*)"/);if(i){const C=i[1];if(C.startsWith("http://")||C.startsWith("https://"))try{if(new URL(C).origin!==_&&!c.includes("target="))return`<a ${c} target="_blank" rel="noopener noreferrer">`}catch{}}return r})}const k=D(()=>v(b.render(y(L.source||""))));Q(k,async()=>{await P(),x(),w("rendered",f.value)}),K(async()=>{await P(),x(),w("rendered",f.value)});function x(){if(!f.value)return;f.value.querySelectorAll(".code-block-wrapper:not(.copy-injected)").forEach(_=>{_.classList.add("copy-injected");const r=_.querySelector("code"),c=(r==null?void 0:r.textContent)||"",i=document.createElement("button");i.className="copy-btn",i.type="button",i.setAttribute("aria-label",N("common.copyCode")),i.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',i.addEventListener("click",()=>{c&&navigator.clipboard.writeText(c).then(()=>{i.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',i.classList.add("copied"),setTimeout(()=>{i.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',i.classList.remove("copied")},2e3)})}),_.appendChild(i)})}return(l,_)=>(m(),p("div",{ref_key:"containerRef",ref:f,class:"md-renderer",innerHTML:k.value},null,8,dn))}},pn=I(mn,[["__scopeId","data-v-b6bba450"]]),hn={class:"zhihu-page"},un={class:"zhihu-shell"},gn={class:"zhihu-body"},fn={class:"zhihu-hero"},$n={class:"zhihu-hero-content"},bn={class:"zhihu-title"},yn={class:"zhihu-subtitle"},vn={class:"zhihu-tabs"},xn={class:"tab active"},Cn={class:"tab"},wn={class:"tab"},kn={class:"zhihu-hero-card"},Ln={class:"hero-label"},Nn={class:"hero-desc"},Rn={class:"hero-actions"},Bn={class:"hero-pill"},Tn={class:"hero-pill"},Gn={class:"hero-pill"},Xn={class:"zhihu-container"},Sn={class:"zhihu-main"},An={key:0,class:"feed"},Dn={class:"feed-content"},Mn={class:"feed-title"},zn={class:"feed-excerpt"},Pn={class:"feed-footer"},Un={class:"feed-meta"},En={class:"meta-tag"},jn={class:"meta-date"},qn={class:"meta-read"},Fn={key:1,class:"post-view"},Vn={class:"post-header"},Qn={class:"post-title"},In={class:"post-meta"},On={class:"post-tag"},Hn={key:2,class:"post-empty"},Kn={class:"zhihu-side"},Wn={class:"side-card profile"},Jn={class:"profile-header"},Yn={class:"profile-name"},Zn={class:"profile-desc"},ne={class:"profile-stats"},ee=["href"],te={class:"side-card"},ae={class:"side-title"},oe={class:"tag-list"},se={class:"tag"},re={class:"tag"},ie={class:"tag"},le={class:"tag"},ce={class:"side-card"},_e={class:"side-title"},de={class:"side-text"},me={class:"side-btn"},pe={key:0,class:"side-card post-toc"},he={class:"toc-title"},ue={class:"toc-list"},ge=["onClick"],fe={key:0,class:"toc-empty"},$e={__name:"Blog",setup(M){const{t:a}=V(),L=Object.assign({"../markdowns/2025-04-01-JavaScript异步编程.md":on,"../markdowns/2026-05-09-强化学习：从MDP到DQN.md":sn,"../markdowns/2026-05-10-卷积神经网络：原理、架构与实战.md":rn,"../markdowns/2026-05-12-XGBoost：梯度提升的工程极致.md":ln,"../markdowns/first-blog.md":cn,"../markdowns/考研信息调研.md":_n});function N(o){return o?typeof o=="string"?o:o&&typeof o=="object"&&"default"in o?o.default:String(o):""}function f(o){return o.replace(/```[\s\S]*?```/g,"").replace(/[#>*_\-`]/g,"").replace(/\s+/g," ").trim().slice(0,120).concat("…")}function w(o){var g;const s=o.replace(/```[\s\S]*?```/g,"").replace(/[#>*_\-`]/g," ").replace(/\s+/g," ").trim(),u=((g=s.match(/[\u4e00-\u9fa5]/g))==null?void 0:g.length)??0,h=s.replace(/[\u4e00-\u9fa5]/g," ").split(/\s+/).filter(Boolean).length+u;return{wordCount:h,readMinutes:Math.max(1,Math.round(h/300)),excerpt:f(s)}}const $=new Map,b=o=>($.has(o)||$.set(o,w(o)),$.get(o)),y=Object.entries(L).map(([o,s])=>{const u=N(s),d=o.match(/\/([^/]+)\.md$/),h=d?d[1]:o;let g=h,R=null;const B=u.match(/^#\s+(.+)$/m);B&&(g=B[1].trim());const T=h.match(/^(\d{4}-\d{2}-\d{2})[-_](.+)$/);T&&(R=T[1],B||(g=T[2]));const O=R??h,G=b(u);return{path:o,slug:h,title:g,content:u,date:R,sortKey:O,excerpt:G.excerpt,readMinutes:G.readMinutes,wordCount:G.wordCount}}).sort((o,s)=>o.sortKey===s.sortKey?0:o.sortKey<s.sortKey?1:-1),v=W(),k=J(),x=D(()=>!!v.params.slug),l=D(()=>v.params.slug?i(v.params.slug):null),_=A(null),r=A([]);function c(){k.push({name:"BlogHome"})}function i(o){return y.find(s=>s.slug===o)}function C(o){const s=o??_.value;if(!s){r.value=[];return}const u=Array.from(s.querySelectorAll("h2, h3"));r.value=u.map(d=>{var g;const h=d.tagName.toLowerCase();return{id:d.id,text:((g=d.textContent)==null?void 0:g.trim())||"标题",level:h}})}function z(o){const s=document.getElementById(o);s&&s.scrollIntoView({behavior:"smooth",block:"start"})}return Q(l,o=>{o||(r.value=[])},{immediate:!0}),(o,s)=>{const u=Y("router-link");return m(),p("section",hn,[X(H),n("div",un,[n("div",gn,[n("div",fn,[n("div",$n,[n("div",bn,e(t(a)("blog.heroTitle")),1),n("p",yn,e(t(a)("blog.heroSubtitle")),1),n("div",vn,[n("button",xn,e(t(a)("blog.tabRecommend")),1),n("button",Cn,e(t(a)("blog.tabLatest")),1),n("button",wn,e(t(a)("blog.tabEssay")),1)])]),n("div",kn,[n("div",Ln,e(t(a)("blog.heroLabel")),1),n("div",Nn,e(t(a)("blog.heroDesc")),1),n("div",Rn,[n("span",Bn,e(t(a)("blog.heroTechMarkdown")),1),n("span",Tn,e(t(a)("blog.heroTechVue")),1),n("span",Gn,e(t(a)("blog.heroTechStudy")),1)])])]),n("div",Xn,[n("main",Sn,[x.value?l.value?(m(),p("div",Fn,[n("div",Vn,[n("button",{class:"back-btn",onClick:c},e(t(a)("blog.backToList")),1),n("h1",Qn,e(l.value.title),1),n("div",In,[n("span",On,e(t(a)("blog.metaColumn")),1),s[3]||(s[3]=n("span",{class:"meta-dot"},"·",-1)),n("span",null,e(l.value.date||t(a)("blog.postMetaDate")),1),s[4]||(s[4]=n("span",{class:"meta-dot"},"·",-1)),n("span",null,e(t(a)("blog.postMetaReadTime",{n:l.value.readMinutes})),1)])]),n("div",{ref_key:"postContentRef",ref:_,class:"post-content"},[X(pn,{source:l.value.content,onRendered:C},null,8,["source"])],512)])):(m(),p("div",Hn,[n("h2",null,e(t(a)("blog.postNotFound")),1),n("p",null,e(t(a)("blog.postNotFoundDesc")),1),n("button",{class:"back-btn",onClick:c},e(t(a)("blog.backToBlog")),1)])):(m(),p("div",An,[(m(!0),p(U,null,E(t(y),d=>(m(),p("article",{key:d.slug,class:"feed-item"},[X(u,{to:{name:"BlogDetail",params:{slug:d.slug}},class:"feed-link"},{default:Z(()=>[n("div",Dn,[n("h2",Mn,e(d.title),1),n("p",zn,e(d.excerpt),1)]),n("div",Pn,[n("div",Un,[n("span",En,e(t(a)("blog.metaColumn")),1),s[0]||(s[0]=n("span",{class:"meta-dot"},"·",-1)),n("span",jn,e(d.date||t(a)("blog.metaNoDate")),1),s[1]||(s[1]=n("span",{class:"meta-dot"},"·",-1)),n("span",qn,e(t(a)("blog.metaReadMinutes",{n:d.readMinutes})),1)]),s[2]||(s[2]=n("span",{class:"feed-arrow"},"→",-1))])]),_:2},1032,["to"])]))),128))]))]),n("aside",Kn,[n("div",Wn,[n("div",Jn,[s[5]||(s[5]=n("div",{class:"profile-avatar"},null,-1)),n("div",null,[n("div",Yn,e(t(a)("blog.profileName")),1),n("div",Zn,e(t(a)("blog.profileDesc")),1)])]),n("div",ne,[n("div",null,[n("strong",null,e(t(y).length),1),n("span",null,e(t(a)("blog.statsArticles")),1)]),n("div",null,[n("strong",null,e(t(a)("blog.statsActive")),1),n("span",null,e(t(a)("blog.statsCode")),1)]),n("div",null,[n("strong",null,e(t(a)("blog.statsGithub")),1),n("span",null,e(t(a)("blog.statsCode")),1)])]),n("a",{class:"profile-link",href:t(an).githubUrl,target:"_blank",rel:"noreferrer"},e(t(a)("blog.visitGithub")),9,ee)]),n("div",te,[n("div",ae,e(t(a)("blog.sidebarTags")),1),n("div",oe,[n("span",se,e(t(a)("blog.tagLearning")),1),n("span",re,e(t(a)("blog.tagAlgorithm")),1),n("span",ie,e(t(a)("blog.tagFrontend")),1),n("span",le,e(t(a)("blog.tagLife")),1)])]),n("div",ce,[n("div",_e,e(t(a)("blog.sidebarUpdate")),1),n("p",de,e(t(a)("blog.sidebarUpdateDesc")),1),n("button",me,e(t(a)("blog.sidebarFollow")),1)]),x.value?(m(),p("div",pe,[n("div",he,e(t(a)("blog.tocTitle")),1),n("ul",ue,[(m(!0),p(U,null,E(r.value,d=>(m(),p("li",{key:d.id,class:nn(["toc-item",d.level])},[n("button",{type:"button",class:"toc-link",onClick:h=>z(d.id)},e(d.text),9,ge)],2))),128)),r.value.length?j("",!0):(m(),p("li",fe,e(t(a)("blog.tocEmpty")),1))])])):j("",!0)])])])])])}}},we=I($e,[["__scopeId","data-v-b82abc87"]]);export{we as default};
