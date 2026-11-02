---
title: 从想法到作品：AI 编程入门
description: 面向新生的 AI 编程入门讲义。从贪吃蛇开始，学习与 Agent 协作、排错、Skill、MCP 和模型接入，配有交互演示与练习。
sidebar: false
aside: false
outline: false
prev: false
next: false
pageClass: ai-course-home
---

<script setup>
import { chapters, courseBase } from '../../../.vitepress/theme/components/learning/course'
</script>

<div class="course-masthead">
  <span>JLU iOS Club / 学习手记</span>
  <span>BEGINNER'S FIELD GUIDE</span>
</div>

<MagHero eyebrow="AI 编程入门 · 面向 26 级新生" title="从想法到作品" subtitle="和 Agent 一起开始 AI 编程。">

从一个贪吃蛇小游戏开始，学会表达想法、观察结果、继续修改，把好用的方法留给下一个作品。

<div class="course-actions">
  <MagButton href="/resources/ai-programming/chapters/01">开始第一章 <span aria-hidden="true">↗</span></MagButton>
  <MagButton href="/resources/ai-programming/reference/tools" variant="ghost">工具准备</MagButton>
  <a href="/resources/ai-programming/read-all">连续阅读 →</a>
</div>

</MagHero>

<CourseArtwork />

<div class="course-editorial">
<div>
<p class="course-kicker">写在开始之前 / A NOTE TO YOU</p>

## 先做出来，再一点点变成你的作品。

不必先记住所有术语。你可以先顺着案例读，遇到想尝试的地方，再打开工具和配套文件。每一章都从上一轮留下的真实问题出发。

正文中的小演示可以暂停、单步观察；练习可以先选一个答案，再看解释。读懂之后，把同样的方法用回自己的项目。

<p class="course-editorial__meta">6 章主线 · 1 篇补充教程 · 5 篇随查 · 配套文件</p>
</div>
<CourseProgress />
</div>

<MagSection n="01" title="沿着一个作品，走过六章" />

<p class="course-section-intro">每次解决一个问题，也为下一步留下起点。按顺序阅读，或回到你需要的那一章。</p>

<div class="course-chapters">
  <a v-for="chapter in chapters" :key="chapter.id" :href="courseBase + 'chapters/' + chapter.id" class="course-chapter">
    <span class="course-chapter__number">{{ chapter.id }}</span>
    <div><span class="course-chapter__label">{{ chapter.label }}</span><h3>{{ chapter.title }}</h3><p>{{ chapter.summary }}</p><span class="course-chapter__link">阅读这一章 <span aria-hidden="true">↗</span></span></div>
  </a>
</div>

<MagSection n="02" title="再向前走一点" />

<MagGrid :cols="2">
<MagCard tag="补充教程" title="在 DSH 中接入模型" href="/resources/ai-programming/chapters/api-setup">

通过一次界面配置，认识 API Key、服务地址、模型名与用量。配有一次请求的动态流程图。

</MagCard>
<MagCard tag="Python 选读" title="让自己的程序调用 API" href="/resources/ai-programming/reference/python-api">

想亲手写代码时，再从环境变量、请求预览和第一次调用开始。配套源码可以查看、下载。

</MagCard>
</MagGrid>

<MagSection n="03" title="读到这里，用到哪里" />

<div class="course-reference">
<a href="/resources/ai-programming/reference/tools"><span>01</span><div><b>工具准备</b><p>把环境准备到可以开始工作的程度。</p></div><span aria-hidden="true">↗</span></a>
<a href="/resources/ai-programming/reference/operations"><span>02</span><div><b>常用操作</b><p>想法、计划、修改、反馈与会话交接。</p></div><span aria-hidden="true">↗</span></a>
<a href="/resources/ai-programming/reference/glossary"><span>03</span><div><b>术语与例子</b><p>上下文、计时器、Skill、MCP 与版本记录。</p></div><span aria-hidden="true">↗</span></a>
<a href="/resources/ai-programming/reference/sources"><span>04</span><div><b>案例与文档</b><p>按当前问题查找来源与官方说明。</p></div><span aria-hidden="true">↗</span></a>
</div>

<div class="course-download">
<div><p class="course-kicker">带走这些，再开始动手 / TAKE IT WITH YOU</p><h2>你的第一份项目工具包。</h2><p>小游戏检查 Skill、Playwright MCP 配置、API 示例和项目记录模板，都放在这里。</p></div>
<div class="course-actions"><MagButton href="/resources/ai-programming/materials/">查看配套材料</MagButton><a href="/ai-programming/ai-programming-handbook.zip" download>下载完整讲义包 ↓</a></div>
</div>

<MagSection n="04" title="把这次学习，接到下一个作品" />

<MagGrid :cols="3">
<MagCard title="现代 AI 编程全景" tag="概念与工程视角" href="/activities/260209-winter-swift/bonus-ai-programming">
理解 LLM、Tool Calling、RAG 与 Agent 之间的关系。
</MagCard>
<MagCard title="Vibe Coding 工作坊" tag="往期实战" href="/activities/251018-vibe-coding/">
继续探索 AI 辅助开发与 App 创作。
</MagCard>
<MagCard title="AI Agent 实战" tag="另一个项目" href="/activities/251102-AI-Agent/">
从日常通知出发，搭建自己的智能助手。
</MagCard>
</MagGrid>

<p class="course-colophon">主案例参考 Datawhale Easy-Vibe。教学练习与网页交互围绕本讲义编排。<a href="/resources/ai-programming/reference/sources">查看资料来源</a></p>
