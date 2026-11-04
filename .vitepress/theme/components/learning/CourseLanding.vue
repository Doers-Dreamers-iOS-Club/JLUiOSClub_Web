<script setup lang="ts">
import { chapters, courseBase } from './course'
import CourseProgress from './CourseProgress.vue'

const features = [
  { n: '01', tag: '补充教程', title: '在 DSH 中接入模型', description: '通过一次界面配置，认识 API Key、服务地址、模型名与用量。看懂一次请求如何发生。', href: 'chapters/api-setup', note: '含动态流程图' },
  { n: '02', tag: 'Python 选读', title: '让自己的程序调用 API', description: '从环境变量、请求预览和第一次调用开始，把模型能力接进自己的程序。', href: 'reference/python-api', note: '含可下载源码' }
]
const references = [
  { title: '工具准备', note: '开始之前', href: 'tools' },
  { title: '常用操作', note: '随用随查', href: 'operations' },
  { title: '术语与例子', note: '理解概念', href: 'glossary' },
  { title: '案例与文档', note: '深入阅读', href: 'sources' }
]
const related = [
  { tag: '概念与工程视角', title: '现代 AI 编程全景', description: '理解 LLM、Tool Calling、RAG 与 Agent 之间的关系。', href: '/activities/260209-winter-swift/bonus-ai-programming' },
  { tag: '往期实战', title: 'Vibe Coding 工作坊', description: '继续探索 AI 辅助开发与 App 创作。', href: '/activities/251018-vibe-coding/' },
  { tag: '另一个项目', title: 'AI Agent 实战', description: '从日常通知出发，搭建自己的智能助手。', href: '/activities/251102-AI-Agent/' }
]
</script>

<template>
  <div class="course-journal">
    <header class="journal-cover">
      <div class="journal-masthead">
        <span>JLU iOS CLUB <span class="journal-masthead__slash">/</span> 学习手册</span>
        <span>2026 <span class="journal-masthead__dot">·</span> AI 编程入门</span>
      </div>
      <div class="journal-cover__spread">
        <div class="journal-cover__story" data-mag-enter>
          <p class="journal-eyebrow">给每一个，想把想法做出来的人</p>
          <h1><span>从想法</span><span>到作品<span class="journal-period">。</span></span></h1>
          <p class="journal-cover__intro">和 Agent 一起开始 AI 编程。<br>从一个贪吃蛇游戏出发，走过六章，<br class="journal-desktop-break">把第一次尝试，变成自己的作品。</p>
          <a class="journal-start" :href="courseBase + 'chapters/01'">开始第一章 <span aria-hidden="true">↗</span></a>
          <div class="journal-cover__links">
            <a :href="courseBase + 'reference/tools'">工具准备 <span aria-hidden="true">↗</span></a>
            <a :href="courseBase + 'read-all'">连续阅读 <span aria-hidden="true">→</span></a>
          </div>
        </div>
        <div class="journal-cover__type" aria-hidden="true" data-mag-enter>
          <span class="journal-cover__folio">A FIELD GUIDE TO AI PROGRAMMING</span>
          <div class="journal-cover__english"><span>Hello,</span><span>world.</span></div>
          <div class="journal-cover__caption"><span>每一个作品，<br>都始于一次尝试。</span><span class="journal-cover__asterisk">✳</span></div>
        </div>
      </div>
      <div class="journal-cover__edition"><span>面向 26 级新生 · 从零开始</span><span>06 章课程 <i>/</i> 01 个作品</span></div>
    </header>

    <CourseProgress editorial />

    <section class="journal-section journal-contents" aria-labelledby="course-contents-title">
      <div class="journal-section__head">
        <p class="journal-section__index">01 <span>/ CONTENTS</span></p>
        <div><h2 id="course-contents-title">沿着一个作品，<br>走过六章。</h2><p>从提出想法，到让工具真正行动。</p></div>
        <a class="journal-text-link" :href="courseBase + 'read-all'">连续阅读 <span aria-hidden="true">↗</span></a>
      </div>
      <nav class="journal-chapters" aria-label="六章课程目录">
        <a v-for="chapter in chapters" :key="chapter.id" :href="courseBase + 'chapters/' + chapter.id" class="journal-chapter">
          <span class="journal-chapter__number" aria-hidden="true">{{ chapter.id }}</span>
          <div class="journal-chapter__copy"><h3>{{ chapter.title }}</h3><p>{{ chapter.summary }}</p></div>
          <span class="journal-chapter__label">{{ chapter.label }}</span>
          <span class="journal-arrow" aria-hidden="true">↗</span>
        </a>
      </nav>
    </section>

    <section class="journal-section" aria-labelledby="course-further-title">
      <div class="journal-section__head">
        <p class="journal-section__index">02 <span>/ FURTHER</span></p>
        <div><h2 id="course-further-title">再向前走一点。</h2><p>当你想让模型走进自己的程序。</p></div>
      </div>
      <div class="journal-features">
        <a v-for="feature in features" :key="feature.href" :href="courseBase + feature.href" class="journal-feature">
          <div class="journal-feature__top"><span>{{ feature.tag }}</span><span class="journal-feature__number" aria-hidden="true">{{ feature.n }}</span></div>
          <h3>{{ feature.title }}</h3><p>{{ feature.description }}</p>
          <div class="journal-feature__foot"><span>{{ feature.note }}</span><span class="journal-arrow" aria-hidden="true">↗</span></div>
        </a>
      </div>
    </section>

    <section class="journal-section journal-desk" aria-labelledby="course-reference-title">
      <div class="journal-desk__reference">
        <p class="journal-section__index">03 <span>/ REFERENCE</span></p>
        <h2 id="course-reference-title">手边的参考。</h2>
        <nav class="journal-reference" aria-label="课程参考资料">
          <a v-for="(reference, index) in references" :key="reference.href" :href="courseBase + 'reference/' + reference.href">
            <span class="journal-reference__number">0{{ index + 1 }}</span><span>{{ reference.title }}</span><span class="journal-reference__note">{{ reference.note }}</span><span class="journal-arrow" aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
      <aside class="journal-materials" aria-labelledby="course-materials-title">
        <p class="journal-section__index">TAKE IT WITH YOU</p>
        <h2 id="course-materials-title">把灵感<br>带回去。</h2>
        <p>配套材料与完整讲义，<br>留给下一次动手的自己。</p>
        <a class="journal-text-link" :href="courseBase + 'materials/'">查看配套材料 <span aria-hidden="true">↗</span></a>
        <a class="journal-download" href="/ai-programming/ai-programming-handbook.zip" download>下载完整讲义包 <span aria-hidden="true">↓</span></a>
      </aside>
    </section>

    <section class="journal-section" aria-labelledby="course-related-title">
      <div class="journal-section__head">
        <p class="journal-section__index">04 <span>/ NEXT</span></p>
        <div><h2 id="course-related-title">下一个作品，<br>从这里继续。</h2></div>
      </div>
      <div class="journal-related">
        <a v-for="item in related" :key="item.href" :href="item.href">
          <span class="journal-eyebrow">{{ item.tag }}</span><h3>{{ item.title }}</h3><p>{{ item.description }}</p><span class="journal-arrow" aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
    <footer class="journal-colophon"><span>JLU iOS Club <span aria-hidden="true">/</span> 学习，让可能发生。</span><a :href="courseBase + 'reference/sources'">资料来源 <span aria-hidden="true">↗</span></a></footer>
  </div>
</template>

<style scoped>
@font-face { font-family: 'Club Instrument Serif'; src: url('/fonts/instrument-serif/instrument-serif-latin.woff2') format('woff2'); font-style: normal; font-weight: 400; font-display: swap; }
.course-journal { --journal-serif: 'Club Instrument Serif', Georgia, serif; padding-top: 4px; }
.course-journal :is(h1,h2,h3,p) { margin: 0; padding: 0; border: 0; }
.course-journal a { color: inherit; text-decoration: none; }
.course-journal a:focus-visible { outline: 2px solid var(--mag-accent); outline-offset: 5px; }
.journal-masthead, .journal-cover__edition { display: flex; justify-content: space-between; align-items: center; gap: 16px; font-size: 12px; line-height: 1.6; }
.journal-masthead { border-top: 1px solid var(--mag-text); padding: 16px 0; letter-spacing: .04em; }
.journal-masthead__slash { color: var(--mag-accent); padding: 0 12px; }
.journal-masthead__dot { padding: 0 8px; }
.journal-cover__spread { display: grid; grid-template-columns: 1.15fr 1fr; gap: 6%; padding: 60px 0 52px; }
.course-journal .journal-eyebrow { font-size: 12px; color: var(--mag-text-secondary); letter-spacing: .06em; line-height: 1.7; }
.course-journal h1 { font-size: clamp(52px, 5.3vw, 76px); font-weight: 400; line-height: 1.2; letter-spacing: -.06em; margin: 24px 0 26px; }
.journal-cover h1 > span { display: block; }
.journal-period { color: var(--mag-accent); }
.course-journal .journal-cover__intro { font-size: 15px; color: var(--mag-text-secondary); line-height: 1.9; }
.course-journal .journal-start { display: flex; align-items: center; justify-content: space-between; width: 230px; padding: 14px 0; border-bottom: 1px solid var(--mag-accent); color: var(--mag-accent); margin-top: 24px; font-size: 16px; }
.journal-start > span { font-size: 24px; transition: transform .25s ease; }
.journal-start:hover > span { transform: translate(3px,-3px); }
.journal-cover__links { display: flex; gap: 28px; margin-top: 13px; font-size: 12px; color: var(--mag-text-secondary); }
.journal-cover__links a { display: inline-flex; gap: 16px; align-items: center; min-height: 36px; }
.journal-cover__links a:hover { color: var(--mag-accent); }
.journal-cover__type { display: flex; flex-direction: column; justify-content: space-between; border-left: var(--mag-rule); padding-left: 12%; }
.journal-cover__folio { font-size: 10px; letter-spacing: .14em; color: var(--mag-text-secondary); }
.journal-cover__english { font-family: var(--journal-serif); font-size: clamp(100px, 12.5vw, 180px); font-weight: 400; letter-spacing: -.04em; line-height: .82; padding: 32px 0 36px; }
.journal-cover__english > span { display: block; }
.journal-cover__english > span:last-child { color: var(--mag-accent); }
.journal-cover__caption { display: flex; align-items: end; justify-content: space-between; font-size: 12px; color: var(--mag-text-secondary); line-height: 1.8; }
.journal-cover__asterisk { color: var(--mag-accent); font-size: 54px; line-height: 1; font-weight: 300; }
.journal-cover__edition { padding: 17px 0; border-top: var(--mag-rule); border-bottom: var(--mag-rule); color: var(--mag-text-secondary); }
.journal-cover__edition i { font-style: normal; padding: 0 12px; color: var(--mag-text-tertiary); }
.journal-section { margin-top: 88px; }
.journal-section__head { display: grid; grid-template-columns: 170px 1fr auto; align-items: start; gap: 24px; border-top: 1px solid var(--mag-text); padding-top: 22px; margin-bottom: 36px; }
.course-journal .journal-section__index { font-size: 11px; color: var(--mag-accent); letter-spacing: .06em; line-height: 1.7; }
.journal-section__index > span { color: var(--mag-text-secondary); padding-left: 9px; }
.course-journal h2 { font-size: 30px; line-height: 1.4; font-weight: 400; letter-spacing: -.035em; }
.journal-section__head > div > p { color: var(--mag-text-secondary); font-size: 13px; margin-top: 12px; }
.course-journal .journal-text-link { display: inline-flex; align-items: center; gap: 28px; font-size: 13px; color: var(--mag-accent); min-height: 40px; }
.journal-text-link:hover { text-decoration: underline; text-underline-offset: 6px; }
.journal-chapters { border-bottom: var(--mag-rule); }
.journal-chapter { display: grid; grid-template-columns: 78px 1fr 100px 24px; align-items: center; gap: 24px; padding: 25px 0; border-top: var(--mag-rule); }
.journal-chapter__number { font-family: var(--journal-serif); font-size: 48px; line-height: 1; color: var(--mag-text-tertiary); transition: color .25s ease; }
.course-journal h3 { font-size: 20px; line-height: 1.5; font-weight: 400; letter-spacing: -.025em; }
.course-journal .journal-chapter__copy p { color: var(--mag-text-secondary); font-size: 13px; margin-top: 7px; line-height: 1.7; }
.journal-chapter__label { font-size: 12px; color: var(--mag-text-secondary); }
.journal-arrow { display: inline-block; font-size: 20px; line-height: 1.4; color: var(--mag-accent); transition: transform .25s ease; }
.course-journal a:hover .journal-arrow { transform: translate(2px,-2px); }
.course-journal a:hover h3, .journal-chapter:hover .journal-chapter__number { color: var(--mag-accent); }
.journal-features { display: grid; grid-template-columns: 1fr 1fr; }
.journal-feature { padding: 4px 44px 12px 0; }
.journal-feature + .journal-feature { border-left: var(--mag-rule); padding: 4px 0 12px 44px; }
.journal-feature__top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; font-size: 12px; color: var(--mag-accent); }
.journal-feature__number { font-family: var(--journal-serif); font-size: 64px; line-height: 1; color: var(--mag-text-tertiary); }
.course-journal .journal-feature h3 { font-size: 24px; }
.course-journal .journal-feature > p { color: var(--mag-text-secondary); font-size: 14px; line-height: 1.9; max-width: 360px; margin: 15px 0 28px; }
.journal-feature__foot { display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--mag-text-secondary); }
.journal-desk { display: grid; grid-template-columns: 1.35fr 1fr; gap: 8%; border-top: 1px solid var(--mag-text); padding-top: 28px; }
.course-journal .journal-desk h2 { margin: 24px 0 28px; }
.journal-reference a { display: grid; grid-template-columns: 22px 1fr auto 20px; gap: 16px; align-items: center; border-top: var(--mag-rule); padding: 20px 0; font-size: 15px; }
.journal-reference a:last-child { border-bottom: var(--mag-rule); }
.journal-reference__number, .journal-reference__note { font-size: 11px; color: var(--mag-text-secondary); }
.journal-reference a:hover { color: var(--mag-accent); }
.journal-materials { padding: 0 0 0 36px; border-left: var(--mag-rule); }
.course-journal .journal-materials h2 { font-size: 40px; }
.course-journal .journal-materials > p:not(.journal-section__index) { font-size: 13px; color: var(--mag-text-secondary); line-height: 1.9; margin-bottom: 17px; }
.course-journal .journal-download { display: flex; align-items: center; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid var(--mag-accent); color: var(--mag-accent); font-size: 13px; margin-top: 4px; }
.journal-download > span { font-size: 22px; }
.journal-related { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 28px; }
.journal-related > a { display: flex; flex-direction: column; align-items: start; padding-top: 22px; border-top: var(--mag-rule); }
.course-journal .journal-related h3 { font-size: 19px; margin-top: 18px; }
.course-journal .journal-related p { color: var(--mag-text-secondary); font-size: 13px; line-height: 1.8; margin: 12px 0 22px; }
.journal-related .journal-arrow { margin-top: auto; }
.journal-colophon { display: flex; justify-content: space-between; gap: 20px; font-size: 11px; color: var(--mag-text-secondary); border-top: 1px solid var(--mag-text); padding: 22px 0 0; margin-top: 70px; }
.journal-colophon > span > span { padding: 0 8px; }
.journal-colophon a:hover { color: var(--mag-accent); }
@media (max-width: 960px) {
  .journal-cover__spread { gap: 5%; padding-top: 40px; }
  .journal-cover__english { font-size: clamp(96px, 13vw, 140px); }
  .journal-section__head { grid-template-columns: 130px 1fr auto; gap: 18px; }
  .journal-chapter { grid-template-columns: 58px 1fr 90px 20px; gap: 18px; }
  .journal-feature { padding-right: 28px; }
  .journal-feature + .journal-feature { padding-left: 28px; }
  .journal-desk { gap: 5%; }
  .journal-materials { padding-left: 24px; }
}
@media (max-width: 640px) {
  .journal-masthead, .journal-cover__edition { font-size: 10px; gap: 10px; }
  .journal-masthead__slash { padding: 0 5px; }
  .journal-masthead__dot { padding: 0 3px; }
  .journal-cover__spread { grid-template-columns: 1fr; padding: 34px 0 28px; gap: 36px; }
  .course-journal h1 { font-size: clamp(52px, 11vw, 70px); margin: 21px 0; }
  .course-journal .journal-cover__intro { font-size: 14px; }
  .journal-cover__type { border-left: 0; border-top: var(--mag-rule); padding: 22px 0 0; }
  .journal-cover__folio { font-size: 9px; }
  .journal-cover__english { display: flex; flex-wrap: wrap; column-gap: .16em; font-size: clamp(66px, 16vw, 100px); padding: 25px 0; }
  .journal-cover__caption { font-size: 11px; }
  .journal-cover__caption br { display: none; }
  .journal-cover__asterisk { font-size: 30px; }
  .journal-cover__edition i { padding: 0 5px; }
  .journal-section { margin-top: 56px; }
  .journal-section__head { grid-template-columns: 1fr auto; gap: 18px 10px; margin-bottom: 28px; padding-top: 16px; }
  .journal-section__head > .journal-section__index { grid-column: 1 / -1; }
  .course-journal h2 { font-size: 27px; }
  .journal-section__head > .journal-text-link { align-self: end; gap: 8px; font-size: 12px; }
  .journal-chapter { grid-template-columns: 38px 1fr 18px; gap: 0 12px; padding: 22px 0; }
  .journal-chapter__number { align-self: start; font-size: 36px; grid-row: 1 / 3; }
  .journal-chapter__copy { grid-column: 2; }
  .journal-chapter__label { grid-column: 2; font-size: 10px; margin-top: 10px; color: var(--mag-accent); }
  .journal-chapter > .journal-arrow { grid-column: 3; grid-row: 1; align-self: start; font-size: 18px; }
  .course-journal .journal-chapter h3 { font-size: 17px; }
  .course-journal .journal-chapter__copy p { font-size: 12px; }
  .journal-features { grid-template-columns: 1fr; }
  .journal-feature { padding: 0 0 28px; }
  .journal-feature + .journal-feature { border-left: 0; border-top: var(--mag-rule); padding: 26px 0 0; }
  .journal-feature__top { margin-bottom: 20px; }
  .journal-feature__number { font-size: 48px; }
  .course-journal .journal-feature h3 { font-size: 22px; }
  .journal-desk { grid-template-columns: 1fr; gap: 44px; }
  .journal-materials { padding: 26px 0 0; border-left: 0; border-top: var(--mag-rule); }
  .course-journal .journal-materials h2 { font-size: 36px; margin: 20px 0; }
  .journal-materials h2 br { display: none; }
  .journal-reference a { gap: 10px; }
  .journal-related { grid-template-columns: 1fr; gap: 26px; }
  .journal-related > a { display: grid; grid-template-columns: 1fr auto; gap: 0 16px; }
  .journal-related .journal-eyebrow, .journal-related h3, .journal-related p { grid-column: 1; }
  .journal-related .journal-arrow { grid-column: 2; grid-row: 2; margin-top: 18px; }
  .course-journal .journal-related p { margin-bottom: 0; }
  .journal-colophon { font-size: 10px; margin-top: 48px; }
  .journal-colophon > span { max-width: 65%; }
}
@media (prefers-reduced-motion: reduce) {
  .journal-arrow, .journal-start > span, .journal-chapter__number { transition: none; }
  .course-journal a:hover .journal-arrow, .journal-start:hover > span { transform: none; }
}
</style>
