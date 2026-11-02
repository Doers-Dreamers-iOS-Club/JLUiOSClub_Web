<script setup lang="ts">
import MagArchive from './MagArchive.vue'
const paths = [
  { n: '01', title: '从想法到作品', href: '/resources/ai-programming/', icon: 'ti-sparkles' },
  { n: '02', title: 'Winter Swift', href: '/activities/260209-winter-swift/', icon: 'ti-code' },
  { n: '03', title: 'AI Agent 实战', href: '/activities/251102-AI-Agent/', icon: 'ti-terminal-2' },
  { n: '04', title: 'Vibe Coding', href: '/activities/251018-vibe-coding/', icon: 'ti-device-mobile' }
]
</script>

<template>
  <div class="club-home">
    <section class="club-intro" data-mag-reveal aria-labelledby="club-title">
      <div class="club-intro__main">
        <h1 id="club-title"><span class="club-line"><span>让想法，</span></span><span class="club-line"><span>成为你的第一个 App。</span></span></h1>
        <a class="club-intro__index" href="#start" aria-label="浏览学习入口"><i class="ti ti-arrow-down" aria-hidden="true" /></a>
      </div>
      <div class="club-intro__bottom">
        <div class="club-actions"><a class="club-button club-button--primary" href="/resources/ai-programming/">开始学习 <i class="ti ti-arrow-up-right" aria-hidden="true" /></a><a class="club-button" href="/about-us/">了解社团 <i class="ti ti-arrow-up-right" aria-hidden="true" /></a></div>
      </div>
    </section>

    <section id="start" class="club-section" aria-labelledby="learn-title">
      <header class="club-section__head" data-mag-reveal><h2 id="learn-title">从这里开始</h2><a href="/resources/">全部资源 <i class="ti ti-arrow-up-right" aria-hidden="true" /></a></header>
      <div class="club-paths" data-mag-stagger>
        <a v-for="path in paths" :key="path.n" :href="path.href" class="club-path">
          <div class="club-path__top"><i :class="['ti', path.icon]" aria-hidden="true" /><i class="ti ti-arrow-up-right club-path__arrow" aria-hidden="true" /></div>
          <h3>{{ path.title }}</h3>
        </a>
      </div>
    </section>

    <section class="club-section" aria-labelledby="activity-title">
      <header class="club-section__head" data-mag-reveal><h2 id="activity-title">最近在做什么</h2><a href="/activities/">全部活动 <i class="ti ti-arrow-up-right" aria-hidden="true" /></a></header>
      <MagArchive source="activities" :limit="3" :show-view-toggle="false" />
    </section>

    <section class="club-community" data-mag-reveal aria-labelledby="community-title">
      <div><h2 id="community-title">好奇心，是共同的起点。</h2><a class="club-button" href="/join-us/">加入我们 <i class="ti ti-arrow-up-right" aria-hidden="true" /></a></div>
    </section>
  </div>
</template>

<style scoped>
.club-home { max-width: 1120px; margin: auto; padding: 0 40px 80px; color: var(--mag-text); }
.club-intro { padding: 56px 0 64px; }
.club-intro__main { display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem; padding: 0 0 32px; }
.club-intro h1 { margin: 0; font-size: var(--mag-fs-masthead); line-height: 1.35; font-weight: 500; letter-spacing: -.04em; }
.club-line { display: block; overflow: hidden; padding-bottom: .06em; }
.club-line > span { display: block; }
.club-intro__index { display: flex; align-items: flex-end; gap: 28px; padding-bottom: 12px; font-size: 13px; line-height: 1.8; color: var(--mag-text-secondary); }
.club-intro__index i { font-size: 24px; transition: transform .5s var(--mag-ease); }
.club-intro__index:hover i { transform: translateY(5px); }
.club-intro__bottom { display: flex; justify-content: space-between; align-items: flex-end; gap: 2rem; }
.club-actions { display: flex; gap: 10px; flex-wrap: wrap; }
.club-button { display: inline-flex; align-items: center; justify-content: center; gap: 16px; padding: 11px 16px; min-height: 44px; border: var(--mag-rule); border-radius: 8px; font-size: 14px; font-weight: 400; transition: border-color .2s, background .2s; }
.club-button:hover { border-color: var(--mag-hairline-strong); background: var(--mag-surface-sunken); }
.club-button i { font-size: 18px; transition: transform .4s var(--mag-ease); }
.club-button:hover i { transform: translate(2px, -2px); }
.club-button--primary { background: var(--mag-accent); border-color: var(--mag-accent); color: var(--mag-on-accent); }
.club-button--primary:hover { background: var(--mag-accent-hover); border-color: var(--mag-accent-hover); }
.club-section { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 40px; border-top: var(--mag-rule); padding: 40px 0 64px; scroll-margin-top: 90px; }
.club-section__head h2 { margin: 20px 0 12px; font-size: 18px; font-weight: 500; letter-spacing: -.015em; }
.club-section__head > a { display: inline-flex; align-items: center; gap: 10px; font-size: 13px; color: var(--mag-text-secondary); }
.club-section__head > a:hover { color: var(--mag-accent); }
.club-paths { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.club-path { display: flex; align-items: center; gap: 14px; padding: 24px; border: var(--mag-rule); border-radius: 12px; transition: border-color .2s, background .2s; }
.club-path:hover { border-color: var(--mag-hairline-strong); background: var(--mag-surface-sunken); }
.club-path__top { display: contents; align-items: center; gap: 10px; color: var(--mag-text-secondary); font-size: 13px; }
.club-path__top > i { font-size: 20px; }
.club-path__arrow { order: 2; margin-left: auto; transition: transform .45s var(--mag-ease), color .2s; }
.club-path:hover .club-path__arrow { transform: translate(3px, -3px); color: var(--mag-accent); }
.club-path h3 { margin: 0; font-size: 16px; font-weight: 500; }
.club-section :deep(.mag-archive) { margin: 0; }
.club-community { border-top: var(--mag-rule); padding-top: 32px; }
.club-community > div { display: flex; justify-content: space-between; align-items: center; gap: 24px; }
.club-community h2 { margin: 0; font-size: 22px; font-weight: 500; line-height: 1.5; letter-spacing: -.02em; }
@media (max-width: 960px) {
  .club-section { grid-template-columns: 170px minmax(0, 1fr); gap: 24px; }

  .club-intro__index { display: none; }
}
@media (max-width: 700px) {
  .club-home { padding: 0 24px 48px; }
  .club-intro { padding: 32px 0 40px; }
  .club-intro__main { padding: 40px 0 28px; }
  .club-intro h1 { font-size: clamp(28px, 6.5vw, 42px); }
  .club-intro__bottom { align-items: flex-start; flex-direction: column; gap: 24px; }
  .club-section { grid-template-columns: 1fr; gap: 24px; padding: 28px 0 40px; }
  .club-section__head { display: grid; grid-template-columns: 1fr auto; align-items: baseline; }
  .club-section__head h2 { grid-row: 1; margin: 0; }
  .club-section__head > a { grid-column: 2; grid-row: 1; }
  .club-path { padding: 20px; }
  .club-paths { gap: 12px; }
  .club-community > div { align-items: flex-start; flex-direction: column; }
}
@media (max-width: 420px) {
  .club-home { padding-inline: 20px; }
  .club-paths { grid-template-columns: 1fr; }
}
</style>
