---
title: "日常记录小能手 - 零代码 AI Agent 实战"
description: "手把手搭建 Coze 智能体,让 AI 自动整理通知并写入飞书多维表格,新手友好!"
date: 2025.11.02
outline: [2, 3]
---

<style scoped>
/* 全局变量 - 统一配色方案 */
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --success-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  --warning-gradient: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  --card-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  --card-shadow-hover: 0 20px 60px rgba(0, 0, 0, 0.2);
  
  /* 深色模式变量 */
  --dark-bg: #1a1a1a;
  --dark-card-bg: #2d2d2d;
  --dark-border: #404040;
  --dark-text: #e0e0e0;
  --dark-text-secondary: #b0b0b0;
}

/* 主横幅 - 增强视觉冲击 */
.vibe-banner {
  background: linear-gradient(135deg, #5568d3 0%, #6b3fa0 100%);
  border-radius: 24px;
  padding: 4rem 2rem;
  color: white;
  text-align: center;
  margin: 2rem 0;
  box-shadow: var(--card-shadow);
  position: relative;
  overflow: hidden;
  animation: bannerFadeIn 1s ease-out;
  border: 3px solid rgba(255, 255, 255, 0.2);
}

/* 深色模式下的横幅 */
.dark .vibe-banner {
  background: linear-gradient(135deg, #7c8ff5 0%, #9d6dd1 100%);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 40px rgba(124, 143, 245, 0.3);
}

.vibe-banner::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bannerFadeIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.vibe-banner h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 0 4px 20px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.3);
  border: none;
  color: white;
  position: relative;
  z-index: 1;
  font-weight: 800;
  letter-spacing: -1px;
  background: linear-gradient(180deg, #ffffff 0%, #f0f0ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.vibe-banner p {
  font-size: 1.3rem;
  opacity: 0.98;
  position: relative;
  z-index: 1;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

/* 信息卡片网格 - 更现代的设计 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 3rem 0;
}

.info-card {
  background: white;
  border-radius: 16px;
  padding: 2rem 1.5rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 2px solid #f0f0f0;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  position: relative;
  overflow: hidden;
}

/* 深色模式 - 信息卡片 */
.dark .info-card {
  background: var(--dark-card-bg);
  border-color: var(--dark-border);
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

.dark .info-card h3 {
  color: var(--dark-text);
}

.dark .info-card p {
  color: var(--dark-text-secondary);
}

.dark .info-card:hover {
  border-color: #7c8ff5;
  box-shadow: 0 20px 60px rgba(124, 143, 245, 0.3);
}

.info-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--primary-gradient);
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.info-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: var(--card-shadow-hover);
  border-color: #667eea;
}

.info-card:hover::before {
  transform: scaleX(1);
}

.info-card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.info-card h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  border: none;
  font-weight: 700;
  font-size: 1.2rem;
}

.info-card p {
  color: #5a6c7d;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
}

/* 章节标题 - 更时尚的设计 */
.section-header {
  text-align: center;
  margin: 4rem 0 2rem 0;
  position: relative;
}

.section-header h2 {
  display: inline-block;
  padding: 0.8rem 3rem;
  background: white;
  color: #1e293b;
  border-radius: 50px;
  font-size: 2rem;
  border: 3px solid #667eea;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
  position: relative;
  overflow: hidden;
  font-weight: 700;
  transition: all 0.3s ease;
}

/* 深色模式 - 章节标题 */
.dark .section-header h2 {
  background: var(--dark-card-bg);
  color: var(--dark-text);
  border-color: #7c8ff5;
  box-shadow: 0 8px 25px rgba(124, 143, 245, 0.3);
}

.dark .section-header h2:hover {
  background: linear-gradient(135deg, #7c8ff5 0%, #9d6dd1 100%);
  color: white;
}

.section-header h2::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--primary-gradient);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.section-header h2:hover {
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

.section-header h2:hover::before {
  opacity: 1;
}

/* 图片容器 - 增强交互 */
.image-container {
  margin: 2rem 0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 3px solid transparent;
}

/* 深色模式 - 图片容器 */
.dark .image-container {
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
  border-color: transparent;
}

.dark .image-container:hover {
  box-shadow: 0 20px 50px rgba(0,0,0,0.6);
  border-color: #a78bfa;
}

.image-container:hover {
  transform: scale(1.03) translateY(-5px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
  border-color: #667eea;
}

.image-container img {
  width: 100%;
  display: block;
  transition: transform 0.4s ease;
}

.image-container:hover img {
  transform: scale(1.05);
}

/* 提示框 - 更现代的风格 */
.tip-box {
  background: linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%);
  border-left: 5px solid #ffc107;
  padding: 2rem;
  border-radius: 12px;
  margin: 2rem 0;
  box-shadow: 0 5px 20px rgba(255, 193, 7, 0.15);
  transition: all 0.3s ease;
}

/* 深色模式 - 提示框 */
.dark .tip-box {
  background: linear-gradient(135deg, #3d3416 0%, #4a3f1a 100%);
  border-left-color: #d4a017;
  box-shadow: 0 5px 20px rgba(212, 160, 23, 0.2);
}

.dark .tip-box h3 {
  color: #fbbf24;
}

.dark .tip-box p,
.dark .tip-box ul,
.dark .tip-box li {
  color: #d4d4d8;
}

.tip-box:hover {
  transform: translateX(5px);
  box-shadow: 0 8px 30px rgba(255, 193, 7, 0.25);
}

.dark .tip-box:hover {
  box-shadow: 0 8px 30px rgba(212, 160, 23, 0.3);
}

.tip-box h3 {
  color: #b45309;
  margin-top: 0;
  border: none;
  font-weight: 700;
}

.tip-box p,
.tip-box ul,
.tip-box li {
  color: #422006;
}

/* 步骤容器 - 更清晰的层次 */
.step-container {
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  margin: 2rem 0;
  border: 2px solid #e2e8f0;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

/* 深色模式 - 步骤容器 */
.dark .step-container {
  background: var(--dark-card-bg);
  border-color: var(--dark-border);
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.dark .step-container:hover {
  border-color: #7c8ff5;
  box-shadow: 0 8px 25px rgba(124, 143, 245, 0.3);
  background: #353535;
}

.dark .step-container p,
.dark .step-container h4 {
  color: var(--dark-text-secondary);
}

.step-container:hover {
  border-color: #667eea;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  background: #fafbfc;
}

.step-container p {
  color: #475569;
}

.step-number {
  display: inline-block;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: white;
  color: #667eea;
  border: 3px solid #667eea;
  border-radius: 50%;
  font-weight: 800;
  margin-right: 1rem;
  font-size: 1.4rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

/* 深色模式 - 步骤数字 */
.dark .step-number {
  background: var(--dark-card-bg);
  color: #7c8ff5;
  border-color: #7c8ff5;
}

.step-container:hover .step-number {
  transform: scale(1.1) rotate(5deg);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.dark .step-container:hover .step-number {
  background: linear-gradient(135deg, #7c8ff5 0%, #9d6dd1 100%);
}

.step-container h4 {
  color: #2c3e50;
  font-weight: 700;
}

/* 高亮框 - 渐变优化 */
.highlight-box {
  background: linear-gradient(135deg, #f0f9ff 0%, #fef3f9 100%);
  border-radius: 16px;
  padding: 2rem;
  margin: 2rem 0;
  border: 2px solid #bae6fd;
  box-shadow: 0 5px 20px rgba(0, 188, 212, 0.1);
  transition: all 0.3s ease;
}

/* 深色模式 - 高亮框 */
.dark .highlight-box {
  background: linear-gradient(135deg, #1e3a4a 0%, #2d2438 100%);
  border-color: #0891b2;
  box-shadow: 0 5px 20px rgba(8, 145, 178, 0.2);
}

.dark .highlight-box h3 {
  color: #22d3ee;
}

.dark .highlight-box p,
.dark .highlight-box ul,
.dark .highlight-box li {
  color: var(--dark-text-secondary);
}

.highlight-box:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 35px rgba(0, 188, 212, 0.2);
}

.dark .highlight-box:hover {
  box-shadow: 0 10px 35px rgba(8, 145, 178, 0.3);
}

.highlight-box h3 {
  color: #0891b2;
  font-weight: 800;
  border: none;
}

.highlight-box p,
.highlight-box ul,
.highlight-box li {
  color: #334155;
}

/* 媒体网格 - 图片展示 */
.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.media-grid figure {
  margin: 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.dark .media-grid figure {
  box-shadow: 0 5px 15px rgba(0,0,0,0.4);
  background: var(--dark-card-bg);
}

.media-grid figure:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

.dark .media-grid figure:hover {
  box-shadow: 0 10px 25px rgba(0,0,0,0.6);
}

.media-grid img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
  max-height: 500px;
  background: #f8f9fa;
}

.dark .media-grid img {
  background: #1a1a1a;
}

.media-grid figcaption {
  padding: 1rem;
  background: #f8f9fa;
  text-align: center;
  font-size: 0.9rem;
  color: #6c757d;
  margin-top: auto;
}

.dark .media-grid figcaption {
  background: var(--dark-card-bg);
  color: var(--dark-text-secondary);
}

/* 步骤标题 */
.step-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.step-header h3 {
  margin: 0;
  border: none;
  color: #2c3e50;
  font-size: 1.5rem;
}

.dark .step-header h3 {
  color: var(--dark-text);
}

/* 响应式设计优化 */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-card,
.step-container {
  animation: slideInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.info-card:nth-child(1) { animation-delay: 0.1s; }
.info-card:nth-child(2) { animation-delay: 0.2s; }
.info-card:nth-child(3) { animation-delay: 0.3s; }
.info-card:nth-child(4) { animation-delay: 0.4s; }

@media (max-width: 768px) {
  .vibe-banner h1 {
    font-size: 2rem;
  }
  
  .vibe-banner {
    padding: 3rem 1.5rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .section-header h2 {
    font-size: 1.5rem;
    padding: 0.6rem 2rem;
  }

  .media-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<div class="vibe-banner">
  <h1>🤖 日常记录小能手工作坊</h1>
  <p>从零到一搭建你的第一个 AI 智能助手，让 AI 自动帮你整理通知、记录待办！</p>
</div>

<div class="info-grid">
  <div class="info-card">
    <div class="info-card-icon">👥</div>
    <h3>适合人群</h3>
    <p>零基础小白也能上手，无需编程经验</p>
  </div>
  <div class="info-card">
    <div class="info-card-icon">🛠️</div>
    <h3>核心工具</h3>
    <p>Coze 平台 + 飞书多维表格</p>
  </div>
  <div class="info-card">
    <div class="info-card-icon">🎯</div>
    <h3>学习目标</h3>
    <p>打造能自动记录的智能体</p>
  </div>
  <div class="info-card">
    <div class="info-card-icon">⏱️</div>
    <h3>所需时间</h3>
    <p>60-90 分钟完成全流程</p>
  </div>
</div>

<div class="tip-box">
  <h3>💡 活动前小贴士</h3>
  <p>建议提前准备好飞书账号，并在浏览器中保持登录状态。本教程将用简单易懂的语言，配合详细的截图，带你一步步完成智能体的搭建。即使是第一次接触 AI 开发，也能轻松跟上！</p>
</div>

<div class="section-header" id="preparation">
  <h2>📝 第一步：准备工作</h2>
</div>

<div class="step-container">
  <div class="step-header">
    <span class="step-number">1</span>
    <div>
      <h3>注册 Coze 账号</h3>
      <p>Coze 是扣子团队推出的 AI 智能体开发平台，就像是一个"AI 机器人工厂"🏭。在这里，即使你完全不懂编程，也能像搭积木一样组装出属于自己的智能助手！打开浏览器访问 Coze 官网，用手机号或邮箱注册一个账号，整个过程不到 3 分钟。</p>
    </div>
  </div>
  <div class="media-grid">
    <figure>
      <img src="./shots/1.png" alt="Coze 平台首页" />
      <figcaption>步骤 1: 访问 Coze 官网，看到这个界面就对了</figcaption>
    </figure>
    <figure>
      <img src="./shots/2.png" alt="登录 Coze" />
      <figcaption>步骤 2: 输入手机号或邮箱，验证码登录超快捷</figcaption>
    </figure>
    <figure>
      <img src="./shots/3.png" alt="Coze 工作台" />
      <figcaption>步骤 3: 欢迎来到你的 AI 工作台！这里就是创造魔法的地方 ✨</figcaption>
    </figure>
    <figure>
      <img src="./shots/4.png" alt="飞书安装扣子" />
      <figcaption>步骤 4: 在飞书中搜索"扣子"（不是扣子空间！）并安装</figcaption>
    </figure>
  </div>
</div>

<div class="highlight-box">
  <h3>🔍 什么是 Coze?</h3>
  <p>Coze 是字节跳动推出的 AI 智能体开发平台,无需编写代码就能创建功能强大的 AI 助手。通过可视化配置,你可以让 AI 帮你处理日常任务,比如整理通知、管理待办、自动回复等。</p>
</div>

<div class="section-header" id="agent-building">
  <h2>🚀 第二步:创建智能体</h2>
</div>

<div class="step-container">
  <div class="step-header">
    <span class="step-number">2</span>
    <div>
      <h3>创建你的第一个智能体</h3>
      <p>现在开始创造你的 AI 小助手啦！🎨 在 Coze 平台左上角找到"创建"按钮，选择"智能体"。给它起个响亮的名字，比如"日常记录小能手"或"超级备忘录"。接着写一段描述，告诉它"你是一个贴心的助手，帮我记录生活中的重要事情"。就像给新员工写岗位说明书一样，描述越清晰，AI 工作起来就越得心应手！</p>
    </div>
  </div>
  <div class="media-grid">
    <figure>
      <img src="./shots/5.png" alt="创建智能体" />
      <figcaption>步骤 5: 点击左上角的"创建"，选择"智能体"选项</figcaption>
    </figure>
    <figure>
      <img src="./shots/6.png" alt="填写基本信息" />
      <figcaption>步骤 6: 给你的 AI 助手起个酷炫的名字吧！💫</figcaption>
    </figure>
    <figure>
      <img src="./shots/7.png" alt="配置提示词" />
      <figcaption>步骤 7: 这里是给 AI 注入"灵魂"的地方，告诉它该怎么工作</figcaption>
    </figure>
  </div>
  <p>💬 <strong>提示词小贴士:</strong> 提示词就像是给 AI 下达的"工作说明书"。你可以这样写："你是一个贴心的日常记录助手，擅长从用户的消息中提取关键信息。当用户告诉你一件事情时，你要帮他记录下主题、具体内容和时间。说话要友好亲切，像个老朋友一样。" 记住，写得越生动，AI 的表现就越出色！✨</p>
</div>

<div class="step-container">
  <div class="step-header">
    <span class="step-number">3</span>
    <div>
      <h3>配置记忆变量</h3>
      <p>记忆变量就像是给 AI 配备了一个"记事本" 📒。我们要创建一个叫 <code>feishu_url</code> 的变量，专门用来记住飞书表格的地址。想象一下，如果你雇了个助手帮你送快递，你得先告诉他地址在哪儿对吧？这个变量就是干这个用的！有了它，智能体就知道该把整理好的信息写到哪个表格里了。</p>
    </div>
  </div>
  <div class="media-grid">
    <figure>
      <img src="./shots/8.png" alt="打开记忆配置" />
      <figcaption>步骤 8: 在左侧菜单找到"记忆"选项，点击进入配置</figcaption>
    </figure>
    <figure>
      <img src="./shots/9.png" alt="添加变量" />
      <figcaption>步骤 9: 点击"添加变量"，名字填 feishu_url（就像给抽屉贴标签）</figcaption>
    </figure>
    <figure>
      <img src="./shots/10.png" alt="开启用户ID" />
      <figcaption>步骤 10: 可选项 - 开启"用户唯一 ID"，方便多人使用时区分</figcaption>
    </figure>
  </div>
  <p>✅ <strong>别忘了保存！</strong> 点击右下角的"保存"按钮，就像给文档按下 Ctrl+S 一样重要。不保存的话，刚才的设置就白费了哦！</p>
</div>

<div class="section-header" id="workflows">
  <h2>⚙️ 第三步:设计工作流</h2>
</div>

<div class="step-container">
  <div class="step-header">
    <span class="step-number">4</span>
    <div>
      <h3>工作流 1: 保存表格链接</h3>
      <p>第一个工作流很简单,就是把你提供的飞书表格链接存起来。创建一个名为 <code>get_url</code> 的工作流,添加"变量赋值"节点,让它把输入的链接保存到 <code>feishu_url</code> 变量中。</p>
    </div>
  </div>
  <div class="media-grid">
    <figure>
      <img src="./shots/11.png" alt="新建工作流" />
      <figcaption>步骤 11: 点击"添加工作流"，准备搭建第一条自动化流水线</figcaption>
    </figure>
    <figure>
      <img src="./shots/12.png" alt="命名工作流" />
      <figcaption>步骤 12: 名字填 get_url，描述写"保存飞书表格链接"</figcaption>
    </figure>
    <figure>
      <img src="./shots/13.png" alt="添加节点" />
      <figcaption>步骤 13: 在画布上点击"+"，选择"变量赋值"节点</figcaption>
    </figure>
    <figure>
      <img src="./shots/14.png" alt="配置变量" />
      <figcaption>步骤 14: 变量名选择刚才创建的 feishu_url</figcaption>
    </figure>
    <figure>
      <img src="./shots/15.png" alt="连接输入" />
      <figcaption>步骤 15: 把"开始"节点的输出连到"变量赋值"（就像接水管）</figcaption>
    </figure>
    <figure>
      <img src="./shots/16.png" alt="设置输出" />
      <figcaption>步骤 16: 配置"结束"节点，让它告诉用户"保存成功"</figcaption>
    </figure>
    <figure>
      <img src="./shots/17.png" alt="检查连线" />
      <figcaption>步骤 17: 检查所有节点是否用箭头连起来了（断开的话不工作）</figcaption>
    </figure>
    <figure>
      <img src="./shots/18.png" alt="输出设置" />
      <figcaption>步骤 18: 在输出框填 {{output}}，表示返回操作结果</figcaption>
    </figure>
    <figure>
      <img src="./shots/19.png" alt="发布工作流" />
      <figcaption>步骤 19: 点击右上角"发布"按钮，让工作流正式上线</figcaption>
    </figure>
    <figure>
      <img src="./shots/20.png" alt="确认发布" />
      <figcaption>步骤 20: 确认添加到当前智能体，让它立刻拥有这个技能</figcaption>
    </figure>
  </div>
  <p>🎉 <strong>工作原理：</strong> 当你输入表格链接后，这个工作流会立刻把链接存到"记事本"里，然后回复你"保存成功 ✓"。就这么简单！以后智能体每次写数据，都会从这个记事本里查地址。</p>
</div>

<div class="step-container">
  <div class="step-header">
    <span class="step-number">5</span>
    <div>
      <h3>工作流 2: 智能记录助手</h3>
      <p>重头戏来了！🎭 这个工作流是整个系统的"大脑中枢"。它的工作流程是：<strong>① 接收你的消息</strong> → <strong>② AI 智能分析提取信息</strong> → <strong>③ 自动写入飞书表格</strong>。就像你跟朋友说"明天下午3点开会讨论项目"，它会自动理解成：主题=开会、内容=讨论项目、时间=明天下午3点，然后整整齐齐地记录在表格里。是不是很神奇？✨</p>
    </div>
  </div>
  <div class="media-grid">
    <figure>
      <img src="./shots/21.png" alt="创建 transfer" />
      <figcaption>步骤 21: 新建工作流，这次命名为 transfer（传输的意思）</figcaption>
    </figure>
    <figure>
      <img src="./shots/22.png" alt="填写描述" />
      <figcaption>步骤 22: 描述填"智能提取信息并写入飞书表格"</figcaption>
    </figure>
    <figure>
      <img src="./shots/23.png" alt="添加 AI 节点" />
      <figcaption>步骤 23: 添加"大模型"节点 - 这是 AI 的"智能大脑" 🧠</figcaption>
    </figure>
    <figure>
      <img src="./shots/24.png" alt="配置 AI" />
      <figcaption>步骤 24: 设置 AI 的输入为用户消息（从"开始"节点接过来）</figcaption>
    </figure>
    <figure>
      <img src="./shots/25.png" alt="添加飞书插件" />
      <figcaption>步骤 25: 在插件市场搜索"飞书多维表格"并添加</figcaption>
    </figure>
    <figure>
      <img src="./shots/26.png" alt="选择写入动作" />
      <figcaption>步骤 26: 选择 add_records 动作（意思是"添加记录"）</figcaption>
    </figure>
    <figure>
      <img src="./shots/27.png" alt="连接节点" />
      <figcaption>步骤 27: 把三个节点串联：开始 → AI 大脑 → 飞书插件 → 结束</figcaption>
    </figure>
    <figure>
      <img src="./shots/28.png" alt="AI 提示词" />
      <figcaption>步骤 28: 关键步骤！告诉 AI 要提取哪些信息（主题、内容、日期）</figcaption>
    </figure>
    <figure>
      <img src="./shots/29.png" alt="设置输出格式" />
      <figcaption>步骤 29: 输出格式设为 array&lt;object&gt;（数组对象，别担心这是固定写法）</figcaption>
    </figure>
    <figure>
      <img src="./shots/30.png" alt="授权提示" />
      <figcaption>步骤 30: 首次使用会弹出授权提示，点击"授权"继续</figcaption>
    </figure>
    <figure>
      <img src="./shots/31.png" alt="绑定链接" />
      <figcaption>步骤 31: App token 选择记忆变量里的 feishu_url（之前存的地址）</figcaption>
    </figure>
    <figure>
      <img src="./shots/32.png" alt="传入数据" />
      <figcaption>步骤 32: records 字段选择 AI 的输出结果（这样 AI 提取的信息就能传给飞书）</figcaption>
    </figure>
    <figure>
      <img src="./shots/33.png" alt="返回结果" />
      <figcaption>步骤 33: 结束节点返回插件的 msg 消息，告诉用户成功还是失败</figcaption>
    </figure>
    <figure>
      <img src="./shots/34.png" alt="完整流程图" />
      <figcaption>步骤 34: 完整的工作流全貌 - 像一条完美的流水线！🏭</figcaption>
    </figure>
    <figure>
      <img src="./shots/35.png" alt="发布" />
      <figcaption>步骤 35: 检查无误后点击"发布"，让智能体正式上岗</figcaption>
    </figure>
  </div>
  <p>🎨 <strong>AI 提示词示例：</strong> "请仔细分析用户的消息，从中提取出<strong>主题</strong>、<strong>具体内容</strong>和<strong>日期</strong>三个关键信息。输出格式为 JSON 数组，每个对象包含 subject、content、date 三个字段。如果某个信息找不到，就填写'无'。举个例子：用户说'明天下午3点开会'，你要输出 [{subject: '会议', content: '开会', date: '明天下午3点'}]"</p>
</div>

<div class="step-container">
  <div class="step-header">
    <span class="step-number">6</span>
    <div>
      <h3>授权飞书插件</h3>
      <p>就像你第一次用微信登录其他 App 需要授权一样 🔐，Coze 要访问你的飞书表格也需要你的许可。这一步很重要：<strong>必须安装"扣子"应用</strong>，不是"扣子空间"！（很多同学就栽在这里了😅）点击授权后，飞书会弹出确认窗口，点"同意"就行。从此，你的智能体就拥有了往飞书表格写数据的"通行证"。</p>
    </div>
  </div>
  <div class="media-grid">
    <figure>
      <img src="./shots/36.png" alt="授权弹窗" />
      <figcaption>步骤 36: 弹出授权窗口，别慌，点击"授权"按钮</figcaption>
    </figure>
    <figure>
      <img src="./shots/37.png" alt="授权成功" />
      <figcaption>步骤 37: 看到这个页面就成功啦！✅ 现在可以自由操作飞书表格了</figcaption>
    </figure>
  </div>
  <p>⚠️ <strong>常见问题：</strong> 如果授权失败，99% 是因为没装对应用。去飞书工作台搜索"<strong>扣子</strong>"（两个字），而不是"扣子空间"（四个字）。装错了就会一直授权不成功哦！</p>
</div>

<div class="step-container">
  <div class="step-header">
    <span class="step-number">7</span>
    <div>
      <h3>设置快捷指令</h3>
      <p>快捷指令就像是给智能体装了个"快捷键" ⌨️。想象一下，如果每次配置表格链接都要手动运行工作流，多麻烦啊！现在我们创建一个叫"配置 URL"的快捷指令，以后只需在聊天框点一下这个按钮，粘贴链接，瞬间搞定！就像手机上的"一键清理"功能一样方便。</p>
    </div>
  </div>
  <div class="media-grid">
    <figure>
      <img src="./shots/38.png" alt="添加快捷指令" />
      <figcaption>步骤 38: 在左侧菜单找到"快捷指令"，点击新建</figcaption>
    </figure>
    <figure>
      <img src="./shots/39.png" alt="指令命名" />
      <figcaption>步骤 39: 名字填"配置 URL"，描述写"一键保存飞书表格链接"</figcaption>
    </figure>
    <figure>
      <img src="./shots/40.png" alt="选择工具" />
      <figcaption>步骤 40: 工具类型选择"工作流"（我们要调用刚才的 get_url）</figcaption>
    </figure>
    <figure>
      <img src="./shots/41.png" alt="绑定工作流" />
      <figcaption>步骤 41: 从下拉菜单选择 get_url 工作流</figcaption>
    </figure>
    <figure>
      <img src="./shots/42.png" alt="设置输入" />
      <figcaption>步骤 42: 输入内容填 {{input}}（这是魔法语法，表示用户输入的内容）</figcaption>
    </figure>
  </div>
  <p>💾 <strong>最后一步别忘了：</strong> 点击右下角的"保存"按钮！不然快捷指令不会生效。保存后，你就能在聊天界面看到一个漂亮的"配置 URL"按钮了。</p>
</div>

<div class="section-header" id="feishu-setup">
  <h2>📊 第四步:准备飞书表格</h2>
</div>

<div class="step-container">
  <div class="step-header">
    <span class="step-number">8</span>
    <div>
      <h3>创建多维表格</h3>
      <p>现在来准备数据的"家" 🏠！打开飞书，新建一个多维表格。我们采用极简设计，只需要三个字段：<strong>主题</strong>（记录是关于什么的）、<strong>内容</strong>（具体内容）、<strong>日期</strong>（什么时候）。全部设为"文本"类型，这样 AI 想写什么都能写，最灵活！删掉其他多余的字段，保持表格简洁清爽。</p>
    </div>
  </div>
  <div class="media-grid">
    <figure>
      <img src="./shots/43.png" alt="新建表格" />
      <figcaption>步骤 43: 在飞书云文档点"新建" → "多维表格"</figcaption>
    </figure>
    <figure>
      <img src="./shots/44.png" alt="字段管理" />
      <figcaption>步骤 44: 点击字段名右侧的"..."，选择"字段设置"</figcaption>
    </figure>
    <figure>
      <img src="./shots/45.png" alt="主题字段" />
      <figcaption>步骤 45: 第一个字段改名为"主题"，类型选"文本"</figcaption>
    </figure>
    <figure>
      <img src="./shots/46.png" alt="内容字段" />
      <figcaption>步骤 46: 第二个字段叫"内容"，类型也是"文本"</figcaption>
    </figure>
    <figure>
      <img src="./shots/47.png" alt="日期字段" />
      <figcaption>步骤 47: 第三个字段叫"日期"，同样选"文本"（不是日期类型！）</figcaption>
    </figure>
    <figure>
      <img src="./shots/48.png" alt="复制链接" />
      <figcaption>步骤 48: 🔥 关键步骤！点击"分享"，权限设为"可编辑"，然后复制链接</figcaption>
    </figure>
  </div>
  <p>⚠️ <strong>超级重要的设置：</strong> 分享权限<strong>必须</strong>设为"<strong>互联网上获取链接的人可编辑</strong>"！如果只是"可查看"，智能体就写不进去了，会一直报错。这是最常见的坑，90% 的同学第一次都会忘记设置权限。😅</p>
</div>

<div class="section-header" id="testing">
  <h2>🧪 第五步:测试与发布</h2>
</div>

<div class="step-container">
  <div class="step-header">
    <span class="step-number">9</span>
    <div>
      <h3>调试智能体</h3>
      <p>激动人心的时刻到了！🎉 是时候测试我们的智能助手了。回到 Coze 平台，打开右侧的调试面板（像聊天窗口一样）。<strong>第一步：</strong>点击"配置 URL"快捷指令，粘贴刚才复制的飞书表格链接，看到返回 <code>true</code> 就说明链接保存成功。<strong>第二步：</strong>试着发送一条消息，比如"明天下午3点体测"，如果智能体回复"success"，赶紧去飞书表格看看 - 是不是多了一行记录？这就是 AI 的魔法！✨</p>
    </div>
  </div>
  <div class="media-grid">
    <figure>
      <img src="./shots/49.png" alt="调试面板" />
      <figcaption>步骤 49: 点击"配置 URL"按钮，把飞书表格链接粘贴进去</figcaption>
    </figure>
    <figure>
      <img src="./shots/50.png" alt="配置成功" />
      <figcaption>步骤 50: 看到 true ✅ 太好了！链接已经存进去了</figcaption>
    </figure>
    <figure>
      <img src="./shots/51.png" alt="测试消息" />
      <figcaption>步骤 51: 发送测试消息，比如"周五下午2点开组会"</figcaption>
    </figure>
    <figure>
      <img src="./shots/52.png" alt="写入成功" />
      <figcaption>步骤 52: 收到 success 提示 🎊 说明 AI 成功理解并写入了！</figcaption>
    </figure>
    <figure>
      <img src="./shots/53.png" alt="查看表格" />
      <figcaption>步骤 53: 去飞书表格看看 - 新记录已经出现！主题、内容、日期都整理好了</figcaption>
    </figure>
  </div>
  <p>🎉 <strong>成功的标志：</strong> 如果飞书表格里出现了一行新记录，并且主题、内容、日期都正确提取出来了，恭喜你！你的第一个 AI 智能体正式诞生了！可以多测试几条消息，比如"下周一交作业"、"后天早上9点面试"，看看 AI 的理解能力。</p>
  <p>💡 <strong>调试技巧：</strong> 如果写入失败，检查这几点：① 表格权限是否设为"可编辑" ② 表格字段名是否为"主题""内容""日期" ③ 字段类型是否都是"文本" ④ 是否安装了"扣子"应用并授权成功。</p>
</div>

<div class="step-container">
  <div class="step-header">
    <span class="step-number">10</span>
    <div>
      <h3>正式发布</h3>
      <p>经过反复测试确认一切正常后，就可以让你的智能体"出道"啦！🚀 点击 Coze 平台右上角的"<strong>发布</strong>"按钮，你的 AI 助手就正式上线了。发布后会生成一个专属链接，你可以：</p>
      <ul>
        <li>📱 <strong>分享给朋友：</strong>把链接发到群里，大家都能用你的智能体</li>
        <li>💬 <strong>集成到飞书群：</strong>在群聊里@智能体，它就能帮全组记录任务</li>
        <li>🔗 <strong>添加到个人工作台：</strong>随时随地快速调用</li>
        <li>📲 <strong>生成二维码：</strong>打印出来贴在桌子上，扫码即用</li>
      </ul>
      <p>发布后智能体依然可以继续迭代升级。收集用户反馈，优化提示词，调整字段，让它越来越聪明！</p>
    </div>
  </div>
</div>

<div class="tip-box">
  <h3>🚀 进阶玩法</h3>
  <ul>
    <li><strong>多轮确认:</strong> 让智能体在写入前先确认信息是否正确</li>
    <li><strong>自动提醒:</strong> 结合飞书机器人,写入后自动推送通知</li>
    <li><strong>更多字段:</strong> 添加"负责人"、"优先级"等字段,打造个人 GTD 系统</li>
    <li><strong>批量导入:</strong> 一次性粘贴多条消息,智能体自动分类记录</li>
  </ul>
</div>

<div class="highlight-box">
  <h3>💬 常见问题解答</h3>
  <p><strong>Q: 为什么授权失败?</strong><br>
  A: 确保安装的是"扣子"应用,不是"扣子空间"。可以在飞书工作台搜索"扣子"重新安装。</p>
  <p><strong>Q: 智能体没有反应怎么办?</strong><br>
  A: 检查工作流是否发布,快捷指令是否保存,飞书表格权限是否正确设置。</p>
  <p><strong>Q: 能不能记录更复杂的信息?</strong><br>
  A: 当然可以! 修改大模型的提示词,让它提取更多字段,比如地点、参与人等。</p>
</div>

<div class="section-header">
  <h2>🎓 学习总结</h2>
</div>

<div class="step-container">
  <p>恭喜你完成了第一个 AI 智能体的搭建! 🎊 通过这次实践,你学会了:</p>
  <ul>
    <li>✅ 在 Coze 平台创建和配置智能体</li>
    <li>✅ 设计工作流,让 AI 自动处理任务</li>
    <li>✅ 集成飞书插件,实现数据写入</li>
    <li>✅ 使用记忆变量和快捷指令提升体验</li>
  </ul>
  <p>现在,你可以用同样的方法打造更多智能助手,比如:</p>
  <ul>
    <li>📚 <strong>学习笔记助手:</strong> 自动整理课堂笔记到飞书文档</li>
    <li>📅 <strong>日程管理助手:</strong> 解析消息并添加到飞书日历</li>
    <li>💰 <strong>记账助手:</strong> 识别支出信息并记录到表格</li>
    <li>🎯 <strong>习惯打卡助手:</strong> 每天自动记录打卡情况</li>
  </ul>
  <p>AI 时代,让智能体成为你的得力助手,把重复的工作交给 AI,你专注于更有创造力的事情! 🚀</p>
</div>

<div class="highlight-box">
  <h3>📢 加入我们</h3>
  <p>想了解更多 AI 开发技巧? 加入吉林大学 iOS 俱乐部,和小伙伴们一起探索 AI 的无限可能! 我们定期举办技术分享、项目实战,帮助你快速成长为 AI 时代的开发者。</p>
</div>
