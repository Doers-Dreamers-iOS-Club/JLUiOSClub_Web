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


<MagHero eyebrow="AI 编程入门 · 面向 26 级新生" title="从想法到作品" subtitle="和 Agent 一起开始 AI 编程。">


<div class="course-actions">
  <MagButton href="/resources/ai-programming/chapters/01">开始第一章 <span aria-hidden="true">↗</span></MagButton>
  <MagButton href="/resources/ai-programming/reference/tools" variant="ghost">工具准备</MagButton>
  <a href="/resources/ai-programming/read-all">连续阅读 →</a>
</div>

</MagHero>

<CourseArtwork />

<CourseProgress />

<MagSection n="01" title="沿着一个作品，走过六章" />


<div class="course-chapters">
  <a v-for="chapter in chapters" :key="chapter.id" :href="courseBase + 'chapters/' + chapter.id" class="course-chapter">
    <span class="course-chapter__number">{{ chapter.id }}</span>
    <div><h3>{{ chapter.title }}</h3></div>
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
<a href="/resources/ai-programming/reference/tools"><span>01</span><div><b>工具准备</b></div><span aria-hidden="true">↗</span></a>
<a href="/resources/ai-programming/reference/operations"><span>02</span><div><b>常用操作</b></div><span aria-hidden="true">↗</span></a>
<a href="/resources/ai-programming/reference/glossary"><span>03</span><div><b>术语与例子</b></div><span aria-hidden="true">↗</span></a>
<a href="/resources/ai-programming/reference/sources"><span>04</span><div><b>案例与文档</b></div><span aria-hidden="true">↗</span></a>
</div>

<div class="course-download">
<h2>配套材料</h2>
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

<p class="course-colophon"><a href="/resources/ai-programming/reference/sources">资料来源</a></p>
