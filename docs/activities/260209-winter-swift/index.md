---
title: "iOS Club 冬季 Swift 培训"
description: "冬季 Swift 培训导航页：课程信息、代码仓库、视频与讲义入口。"
date: 2026.02.09
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

.tip-box,
.link-card {
  margin: 1.2rem 0;
  padding: 1rem 1.05rem;
  border-radius: 10px;
  border: 1px solid var(--mag-border);
  background: var(--mag-card);
  color: var(--mag-subtext);
  line-height: 1.8;
}

.tip-box {
  border-left: 3px solid var(--mag-accent);
}

.vp-doc h2 {
  margin: 2.8rem 0 1rem;
  padding-top: 0.2rem;
  border-top: 1px solid var(--mag-border);
  border-bottom: 0;
  color: var(--mag-text);
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin: 1.2rem 0;
}

.project-card {
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--mag-border);
  background: var(--mag-card);
}

.project-card h3 {
  margin: 0;
  border: 0;
  color: var(--mag-text);
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif;
}

.project-card p {
  margin: 0.55rem 0 0;
  color: var(--mag-subtext);
}

.project-card a {
  display: inline-block;
  margin-top: 0.7rem;
  font-weight: 600;
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
  .project-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<div class="vibe-banner">
  <h1>iOS Club 冬季 Swift 培训</h1>
  <p>这里是寒假培训总导航页。你可以在这里查看课程基础信息、代码仓库地址、视频入口，以及进入讲义专区。</p>
</div>

<div class="info-grid">
  <div class="info-card">
    <h3>培训主题</h3>
    <p>Swift / SwiftUI 基础到进阶，配套 CodeBreaker 实战项目。</p>
  </div>
  <div class="info-card">
    <h3>内容结构</h3>
    <p>语言基础、架构设计、状态管理、算法与 UI 实现。</p>
  </div>
</div>

## 培训资源

<div class="project-grid">
  <div class="project-card">
    <h3>Bilibili 课程视频</h3>
    <p>培训视频第一讲：</p>
    <a href="https://www.bilibili.com/video/BV1geFmzvEgj/" target="_blank" rel="noreferrer">点击观看第一讲视频（BV1geFmzvEgj）</a>
  </div>
  <div class="project-card">
    <h3>GitHub 仓库</h3>
    <p>CodeBreaker 项目代码与版本记录：</p>
    <a href="https://github.com/Hean-Yi/CodeBreaker.git" target="_blank" rel="noreferrer">https://github.com/Hean-Yi/CodeBreaker.git</a>
  </div>
  <div class="project-card">
    <h3>Gitee 仓库</h3>
    <p>国内镜像仓库（便于国内网络访问）：</p>
    <a href="https://gitee.com/Hean-Yi/CodeBreaker" target="_blank" rel="noreferrer">https://gitee.com/Hean-Yi/CodeBreaker</a>
  </div>
  <div class="project-card">
    <h3>讲义专区导航</h3>
    <p>按讲次阅读：</p>
    <a href="/activities/260209-winter-swift/first/">第一讲：SwiftUI 入门与 CodeBreaker 基础界面</a>
    <br />
    <a href="/activities/260209-winter-swift/second/">第二讲：Swift 进阶与 CodeBreaker 实战</a>
  </div>
</div>
