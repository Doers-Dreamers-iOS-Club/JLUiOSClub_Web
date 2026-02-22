---
title: "iOS Club 冬季 Swift 培训"
description: "冬季 Swift 培训导航页：课程信息、代码仓库、视频与讲义入口。"
date: 2026.02.22
sidebar: false
aside: false
outline: false
---

<style scoped>
:root {
  --mag-card: #ffffff;
  --mag-text: #1f2a37;
  --mag-subtext: #5b6676;
  --mag-border: #d8dde6;
  --mag-accent: #2f5d8a;
  --mag-accent-soft: #e8eff7;
  --mag-shadow: 0 10px 30px rgba(20, 32, 53, 0.08);
}

.dark {
  --mag-card: #1a212b;
  --mag-text: #e5eaf2;
  --mag-subtext: #aeb8c6;
  --mag-border: #2d3948;
  --mag-accent: #8ab4e1;
  --mag-accent-soft: #223246;
  --mag-shadow: 0 14px 36px rgba(0, 0, 0, 0.32);
}

@keyframes riseIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.vibe-banner {
  margin: 2rem 0;
  padding: 2.6rem 2rem;
  border-radius: 20px;
  border: 1px solid var(--mag-border);
  background: linear-gradient(145deg, var(--mag-card) 0%, var(--mag-accent-soft) 100%);
  box-shadow: var(--mag-shadow);
}

.vibe-banner h1 {
  margin: 0;
  border: 0;
  color: var(--mag-text);
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif;
  font-size: clamp(1.8rem, 3.4vw, 2.8rem);
}

.vibe-banner p {
  margin: 0.9rem 0 0;
  color: var(--mag-subtext);
  line-height: 1.8;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.info-card {
  background: var(--mag-card);
  border: 1px solid var(--mag-border);
  border-radius: 14px;
  padding: 1.2rem;
  box-shadow: 0 4px 14px rgba(20, 32, 53, 0.05);
  animation: riseIn 0.4s ease both;
}

.info-card h3 {
  margin: 0;
  border: 0;
  color: var(--mag-text);
  font-size: 1.02rem;
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif;
}

.info-card p {
  margin: 0.45rem 0 0;
  color: var(--mag-subtext);
  line-height: 1.7;
}

.vp-doc h2 {
  margin: 2.8rem 0 1rem;
  padding-top: 0.2rem;
  border-top: 1px solid var(--mag-border);
  border-bottom: 0;
  color: var(--mag-text);
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif;
}

.track-grid,
.resource-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin: 1.2rem 0;
}

.track-card,
.resource-card,
.tip-box {
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--mag-border);
  background: var(--mag-card);
}

.tip-box {
  border-left: 3px solid var(--mag-accent);
  margin: 1rem 0;
  color: var(--mag-subtext);
}

.track-card h3,
.resource-card h3 {
  margin: 0;
  border: 0;
  color: var(--mag-text);
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif;
}

.track-card p,
.resource-card p,
.track-card li {
  margin: 0.55rem 0 0;
  color: var(--mag-subtext);
  line-height: 1.75;
}

.track-tag {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--mag-border);
  background: var(--mag-accent-soft);
  color: var(--mag-subtext);
  border-radius: 999px;
  padding: 0.18rem 0.65rem;
  font-size: 0.82rem;
  margin-bottom: 0.6rem;
}

.track-card a,
.resource-card a {
  display: inline-block;
  margin-top: 0.7rem;
  font-weight: 600;
}

.route-split {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.9rem;
  margin-top: 0.8rem;
}

.route-item {
  border: 1px dashed var(--mag-border);
  border-radius: 10px;
  padding: 0.8rem 0.85rem;
}

.route-item strong {
  color: var(--mag-text);
}

@media (max-width: 1000px) {
  .info-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .vibe-banner {
    padding: 1.8rem 1.2rem;
    border-radius: 14px;
  }

  .info-grid,
  .track-grid,
  .resource-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<div class="vibe-banner">
  <h1>iOS Club 冬季 Swift 培训</h1>
  <p>这里是本期培训总导航页。已将讲义入口拆分为“数字正课”与“补充讲座”，便于按学习目的快速进入。</p>
</div>

<div class="info-grid">
  <div class="info-card">
    <h3>培训主题</h3>
    <p>Swift / SwiftUI 基础到进阶，配套 CodeBreaker 实战项目。</p>
  </div>
  <div class="info-card">
    <h3>内容结构</h3>
    <p>正课聚焦项目开发路径，补充讲座聚焦现代 AI 编程方法论。</p>
  </div>
  <div class="info-card">
    <h3>推荐节奏</h3>
    <p>主线学习swift知识，补充扩展工程视角。</p>
  </div>
  <div class="info-card">
    <h3>学习产出</h3>
    <p>从“会写页面”进阶到“会组织代码、会验证、会构建流程”。</p>
  </div>
</div>

## 讲义入口

<div class="track-grid">
  <div class="track-card">
    <span class="track-tag">培训主线</span>
    <h3>培训主线</h3>
    <p>围绕 CodeBreaker 项目，从 SwiftUI 入门到 Swift 进阶实战。</p>
    <div class="route-split">
      <div class="route-item">
        <strong>第一讲：</strong>SwiftUI 入门与 CodeBreaker 基础界面<br />
        <a href="/activities/260209-winter-swift/first/">进入第一讲</a>
      </div>
      <div class="route-item">
        <strong>第二讲：</strong>Swift 进阶与 CodeBreaker 实战<br />
        <a href="/activities/260209-winter-swift/second/">进入第二讲</a>
      </div>
    </div>
  </div>

  <div class="track-card">
    <span class="track-tag">主线之外</span>
    <h3>课程外扩展</h3>
    <p>现代 AI 编程全景：LLM、Tool Calling、RAG、Agent、Skills 与 MCP 的工程落地。</p>
    <div class="route-split">
      <div class="route-item">
        <strong>补充讲座：</strong>现代 AI 编程全景<br />
        <a href="/activities/260209-winter-swift/bonus-ai-programming/">进入补充讲座</a>
      </div>
    </div>
  </div>
</div>

## 培训资源

<div class="resource-grid">
  <div class="resource-card">
    <h3>Bilibili 课程视频</h3>
    <p>培训视频第一讲：</p>
    <a href="https://www.bilibili.com/video/BV1geFmzvEgj/" target="_blank" rel="noreferrer">点击观看第一讲视频（BV1geFmzvEgj）</a>
  </div>
  <div class="resource-card">
    <h3>GitHub 仓库</h3>
    <p>CodeBreaker 项目代码与版本记录：</p>
    <a href="https://github.com/Hean-Yi/CodeBreaker.git" target="_blank" rel="noreferrer">https://github.com/Hean-Yi/CodeBreaker.git</a>
  </div>
  <div class="resource-card">
    <h3>Gitee 仓库</h3>
    <p>国内镜像仓库（便于国内网络访问）：</p>
    <a href="https://gitee.com/Hean-Yi/CodeBreaker" target="_blank" rel="noreferrer">https://gitee.com/Hean-Yi/CodeBreaker</a>
  </div>
</div>
