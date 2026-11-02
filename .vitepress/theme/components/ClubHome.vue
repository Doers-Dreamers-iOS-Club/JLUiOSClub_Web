<script setup lang="ts">
import MagArchive from './MagArchive.vue'
const paths = [
  { n: '01', title: '从想法到作品', label: 'AI 编程入门', text: '从一个小游戏开始，学会和 Agent 一起创作。', href: '/resources/ai-programming/', icon: 'ti-sparkles' },
  { n: '02', title: 'Winter Swift', label: 'Swift / SwiftUI', text: '用 CodeBreaker 项目，走进 App 开发。', href: '/activities/260209-winter-swift/', icon: 'ti-code' },
  { n: '03', title: 'AI Agent 实战', label: '工作坊', text: '搭建一个能帮你处理日常记录的助手。', href: '/activities/251102-AI-Agent/', icon: 'ti-terminal-2' },
  { n: '04', title: 'Vibe Coding', label: '工作坊', text: '把一个小想法，变成可以体验的应用。', href: '/activities/251018-vibe-coding/', icon: 'ti-device-mobile' }
]
</script>

<template>
  <div class="club-home">
    <section class="club-intro" aria-labelledby="club-title">
      <div class="club-intro__over" data-mag-enter><span>吉林大学 · Doers &amp; Dreamers</span><span>始于 2017</span></div>
      <div class="club-intro__main">
        <h1 id="club-title"><span class="club-line"><span data-mag-line>让想法，</span></span><span class="club-line"><span data-mag-line>成为你的第一个 App。</span></span></h1>
        <a class="club-intro__index" href="#start" aria-label="浏览学习入口"><span>一起学习<br>一起创造</span><i class="ti ti-arrow-down" aria-hidden="true" /></a>
      </div>
      <div class="club-intro__bottom" data-mag-enter>
        <p>一个教你从零开始创作的社团。<br>在这里，遇见伙伴，也做出自己的作品。</p>
        <div class="club-actions"><a class="club-button club-button--primary" href="/resources/ai-programming/">开始学习 <i class="ti ti-arrow-up-right" aria-hidden="true" /></a><a class="club-button" href="/about-us/">了解社团 <i class="ti ti-arrow-up-right" aria-hidden="true" /></a></div>
      </div>
    </section>

    <section id="start" class="club-section" aria-labelledby="learn-title">
      <header class="club-section__head" data-mag-reveal><span class="club-section__number">01 / 学习</span><h2 id="learn-title">从这里开始</h2><p>选一个方向，<br>慢慢把想法做出来。</p><a href="/resources/">全部资源 <i class="ti ti-arrow-up-right" aria-hidden="true" /></a></header>
      <div class="club-paths" data-mag-stagger>
        <a v-for="path in paths" :key="path.n" :href="path.href" class="club-path">
          <div class="club-path__top"><i :class="['ti', path.icon]" aria-hidden="true" /><span>{{ path.label }}</span><i class="ti ti-arrow-up-right club-path__arrow" aria-hidden="true" /></div>
          <h3>{{ path.title }}</h3><p>{{ path.text }}</p>
        </a>
      </div>
    </section>

    <section class="club-section" aria-labelledby="activity-title">
      <header class="club-section__head" data-mag-reveal><span class="club-section__number">02 / 记录</span><h2 id="activity-title">最近在做什么</h2><p>每一次相聚，<br>都留下新的可能。</p><a href="/activities/">全部活动 <i class="ti ti-arrow-up-right" aria-hidden="true" /></a></header>
      <MagArchive source="activities" :limit="3" :show-view-toggle="false" />
    </section>

    <section class="club-community" data-mag-reveal aria-labelledby="community-title">
      <span class="club-section__number">03 / 我们</span>
      <div><h2 id="community-title">好奇心，是共同的起点。</h2><p>我们来自不同专业，因热爱 Apple 与创作相聚。<br>从第一次技术分享，到第一件参赛作品，一起探索更多可能。</p><a class="club-button" href="/join-us/">加入我们 <i class="ti ti-arrow-up-right" aria-hidden="true" /></a></div>
      <span class="club-community__sign">JLU iOS Club<br><span>Doers &amp; Dreamers</span></span>
    </section>
  </div>
</template>

<style scoped>
.club-home { max-width: 1120px; margin: auto; padding: 0 40px 80px; color: var(--mag-text); }
.club-intro { padding: 56px 0 64px; }
.club-intro__over { display: flex; justify-content: space-between; gap: 1rem; color: var(--mag-text-secondary); font-size: 13px; }
.club-intro__main { display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem; padding: 64px 0 40px; }
.club-intro h1 { margin: 0; font-size: var(--mag-fs-masthead); line-height: 1.35; font-weight: 500; letter-spacing: -.04em; }
.club-line { display: block; overflow: hidden; padding-bottom: .06em; }
.club-line > span { display: block; }
.club-intro__index { display: flex; align-items: flex-end; gap: 28px; padding-bottom: 12px; font-size: 13px; line-height: 1.8; color: var(--mag-text-secondary); }
.club-intro__index i { font-size: 24px; transition: transform .5s var(--mag-ease); }
.club-intro__index:hover i { transform: translateY(5px); }
.club-intro__bottom { display: flex; justify-content: space-between; align-items: flex-end; gap: 2rem; }
.club-intro__bottom p { margin: 0; font-size: 16px; line-height: 1.8; color: var(--mag-text-secondary); }
.club-actions { display: flex; gap: 10px; flex-wrap: wrap; }
.club-button { display: inline-flex; align-items: center; justify-content: center; gap: 16px; padding: 11px 16px; min-height: 44px; border: var(--mag-rule); border-radius: 8px; font-size: 14px; font-weight: 400; transition: border-color .2s, background .2s; }
.club-button:hover { border-color: var(--mag-hairline-strong); background: var(--mag-surface-sunken); }
.club-button i { font-size: 18px; transition: transform .4s var(--mag-ease); }
.club-button:hover i { transform: translate(2px, -2px); }
.club-button--primary { background: var(--mag-accent); border-color: var(--mag-accent); color: var(--mag-on-accent); }
.club-button--primary:hover { background: var(--mag-accent-hover); border-color: var(--mag-accent-hover); }
.club-section { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 40px; border-top: var(--mag-rule); padding: 40px 0 64px; scroll-margin-top: 90px; }
.club-section__number { font-size: 13px; color: var(--mag-text-secondary); font-variant-numeric: tabular-nums; }
.club-section__head h2 { margin: 20px 0 12px; font-size: 18px; font-weight: 500; letter-spacing: -.015em; }
.club-section__head p { color: var(--mag-text-secondary); font-size: 14px; line-height: 1.8; margin: 0 0 24px; }
.club-section__head > a { display: inline-flex; align-items: center; gap: 10px; font-size: 13px; color: var(--mag-text-secondary); }
.club-section__head > a:hover { color: var(--mag-accent); }
.club-paths { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.club-path { padding: 24px; border: var(--mag-rule); border-radius: 12px; transition: border-color .2s, background .2s; }
.club-path:hover { border-color: var(--mag-hairline-strong); background: var(--mag-surface-sunken); }
.club-path__top { display: flex; align-items: center; gap: 10px; color: var(--mag-text-secondary); font-size: 13px; }
.club-path__top > i { font-size: 20px; }
.club-path__arrow { margin-left: auto; transition: transform .45s var(--mag-ease), color .2s; }
.club-path:hover .club-path__arrow { transform: translate(3px, -3px); color: var(--mag-accent); }
.club-path h3 { margin: 28px 0 8px; font-size: 16px; font-weight: 500; }
.club-path p { margin: 0; color: var(--mag-text-secondary); font-size: 14px; line-height: 1.7; }
.club-section :deep(.mag-archive) { margin: 0; }
.club-community { display: grid; grid-template-columns: 220px minmax(0, 1fr) auto; gap: 40px; border-top: var(--mag-rule); padding-top: 40px; }
.club-community h2 { margin: 0 0 16px; font-size: 22px; font-weight: 500; line-height: 1.5; letter-spacing: -.02em; }
.club-community p { margin: 0 0 24px; font-size: 14px; line-height: 1.8; color: var(--mag-text-secondary); }
.club-community__sign { align-self: end; font-size: 14px; line-height: 1.8; }
.club-community__sign > span { color: var(--mag-text-secondary); font-size: 13px; }
@media (max-width: 960px) {
  .club-section { grid-template-columns: 170px minmax(0, 1fr); gap: 24px; }
  .club-community { grid-template-columns: 170px 1fr; gap: 24px; }
  .club-community__sign { grid-column: 2; }
  .club-intro__index { display: none; }
}
@media (max-width: 700px) {
  .club-home { padding: 0 24px 48px; }
  .club-intro { padding: 32px 0 40px; }
  .club-intro__over { font-size: 12px; }
  .club-intro__main { padding: 40px 0 28px; }
  .club-intro h1 { font-size: clamp(28px, 6.5vw, 42px); }
  .club-intro__bottom { align-items: flex-start; flex-direction: column; gap: 24px; }
  .club-section { grid-template-columns: 1fr; gap: 24px; padding: 28px 0 40px; }
  .club-section__head { display: grid; grid-template-columns: 1fr auto; align-items: baseline; }
  .club-section__head h2 { grid-row: 2; margin: 12px 0 0; }
  .club-section__head p { display: none; }
  .club-section__head > a { grid-column: 2; grid-row: 2; }
  .club-path { padding: 20px; }
  .club-paths { gap: 12px; }
  .club-community { grid-template-columns: 1fr; gap: 24px; padding-top: 28px; }
  .club-community__sign { grid-column: 1; }
}
@media (max-width: 420px) {
  .club-home { padding-inline: 20px; }
  .club-paths { grid-template-columns: 1fr; }
  .club-path h3 { margin-top: 20px; }
}
</style>
