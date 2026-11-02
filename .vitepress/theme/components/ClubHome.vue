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
      <div class="club-section__content">
        <header class="club-section__head" data-mag-reveal><h2 id="learn-title">从这里开始</h2><a href="/resources/">全部资源 <i class="ti ti-arrow-up-right" aria-hidden="true" /></a></header>
        <div class="club-paths" data-mag-stagger>
          <a v-for="path in paths" :key="path.n" :href="path.href" class="club-path">
            <div class="club-path__top"><i :class="['ti', path.icon]" aria-hidden="true" /><i class="ti ti-arrow-up-right club-path__arrow" aria-hidden="true" /></div>
            <h3>{{ path.title }}</h3>
          </a>
        </div>
      </div>
      <figure class="club-art" data-mag-reveal data-mag-art aria-hidden="true"><img src="/home-art/learn.png" alt="" width="1254" height="1254" loading="lazy" decoding="async" /></figure>
    </section>

    <section class="club-section club-section--reverse" aria-labelledby="activity-title">
      <div class="club-section__content">
        <header class="club-section__head" data-mag-reveal><h2 id="activity-title">最近在做什么</h2><a href="/activities/">全部活动 <i class="ti ti-arrow-up-right" aria-hidden="true" /></a></header>
        <MagArchive source="activities" :limit="3" :show-view-toggle="false" />
      </div>
      <figure class="club-art" data-mag-reveal data-mag-art aria-hidden="true"><img src="/home-art/activities.png" alt="" width="1254" height="1254" loading="lazy" decoding="async" /></figure>
    </section>

    <section class="club-section club-community" aria-labelledby="community-title">
      <div class="club-section__content" data-mag-reveal><h2 id="community-title">好奇心，<br />是共同的起点。</h2><a class="club-button" href="/join-us/">加入我们 <i class="ti ti-arrow-up-right" aria-hidden="true" /></a></div>
      <figure class="club-art" data-mag-reveal data-mag-art aria-hidden="true"><img src="/home-art/community.png" alt="" width="1254" height="1254" loading="lazy" decoding="async" /></figure>
    </section>
  </div>
</template>

<style scoped>
.club-home { max-width: 1280px; margin: auto; padding: 0 48px; color: var(--mag-text); }
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
.club-section { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: center; gap: clamp(40px, 6vw, 88px); min-height: calc(100svh - var(--vp-nav-height, 64px)); box-sizing: border-box; border-top: var(--mag-rule); padding: 64px 0; scroll-margin-top: var(--vp-nav-height, 64px); }
.club-section__content { min-width: 0; }
.club-section__head { display: flex; align-items: baseline; justify-content: space-between; flex-wrap: wrap; gap: 12px 20px; margin-bottom: 40px; }
.club-section__head h2 { margin: 0; font-size: 22px; font-weight: 500; letter-spacing: -.015em; }
.club-section__head > a { display: inline-flex; align-items: center; gap: 10px; font-size: 13px; color: var(--mag-text-secondary); }
.club-section__head > a:hover { color: var(--mag-accent); }
.club-paths { display: grid; grid-template-columns: 1fr; }
.club-path { display: flex; align-items: center; gap: 16px; min-height: 76px; padding: 20px 0; border-bottom: var(--mag-rule); transition: border-color .2s; }
.club-path:hover { border-color: var(--mag-hairline-strong); }
.club-path__top { display: contents; align-items: center; gap: 10px; color: var(--mag-text-secondary); font-size: 13px; }
.club-path__top > i { font-size: 20px; }
.club-path__arrow { order: 2; margin-left: auto; transition: transform .45s var(--mag-ease), color .2s; }
.club-path:hover .club-path__arrow { transform: translate(3px, -3px); color: var(--mag-accent); }
.club-path h3 { margin: 0; font-size: 16px; font-weight: 500; }
.club-section :deep(.mag-archive) { margin: 0; }
.club-section :deep(.mag-archive__row) { grid-template-columns: minmax(0, 1fr) 20px; gap: 8px 16px; }
.club-section :deep(.mag-archive__date) { grid-column: 1; }
.club-section :deep(.mag-archive__row-main) { grid-column: 1; }
.club-section :deep(.mag-archive__arrow) { grid-column: 2; grid-row: 2; }
.club-section--reverse .club-section__content { grid-column: 2; grid-row: 1; }
.club-section--reverse .club-art { grid-column: 1; grid-row: 1; }
.club-art { margin: 0; width: 100%; height: min(62svh, 560px); min-height: 320px; overflow: hidden; border-radius: 12px; }
.club-art img { display: block; width: 100%; height: 100%; object-fit: cover; }
.club-community .club-button { margin-top: 32px; }
.club-community h2 { margin: 0; font-size: 22px; font-weight: 500; line-height: 1.5; letter-spacing: -.02em; }
@media (max-width: 960px) {
  .club-home { padding-inline: 32px; }
  .club-section { gap: 32px; }
  .club-intro__index { display: none; }
}
@media (max-width: 700px) {
  .club-home { padding: 0 24px; }
  .club-intro { padding: 32px 0 40px; }
  .club-intro__main { padding: 40px 0 28px; }
  .club-intro h1 { font-size: clamp(28px, 6.5vw, 42px); }
  .club-intro__bottom { align-items: flex-start; flex-direction: column; gap: 24px; }
  .club-section { grid-template-columns: 1fr; align-content: center; gap: 32px; padding: 48px 0; }
  .club-section__head { margin-bottom: 28px; }
  .club-section__head h2 { font-size: 20px; }
  .club-path { min-height: 64px; padding: 18px 0; }
  .club-art { height: min(36svh, 320px); min-height: 200px; }
  .club-section--reverse .club-section__content, .club-section--reverse .club-art { grid-column: auto; grid-row: auto; }
}
@media (max-width: 420px) {
  .club-home { padding-inline: 20px; }
}
</style>
