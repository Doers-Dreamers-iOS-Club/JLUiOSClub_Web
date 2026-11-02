<script setup lang="ts">
import { ref } from 'vue'
import MagArchive from './MagArchive.vue'
import AsciiHero from './AsciiHero.vue'
import { useFullPage } from '../composables/useFullPage'
const root = ref<HTMLElement | null>(null)
const { active, enabled, busy, asciiAvailable, navigate } = useFullPage(root)
const pages = ['开场', '学习', '活动', '加入']
const paths = [
  { title: '从想法到作品', href: '/resources/ai-programming/', icon: 'ti-sparkles' },
  { title: 'Winter Swift', href: '/activities/260209-winter-swift/', icon: 'ti-code' },
  { title: 'AI Agent 实战', href: '/activities/251102-AI-Agent/', icon: 'ti-terminal-2' },
  { title: 'Vibe Coding', href: '/activities/251018-vibe-coding/', icon: 'ti-device-mobile' }
]
</script>

<template>
  <div ref="root" class="club-home" :class="{ 'is-paged': enabled, 'is-changing': busy }">
    <div class="club-pages">
      <section id="index" class="club-page club-opening" data-club-page tabindex="-1" aria-label="ASCII 开场">
        <div class="club-page__inner"><AsciiHero :active="!enabled || active === 0" /></div>
      </section>
      <section id="start" class="club-page club-section" data-club-page tabindex="-1" aria-labelledby="club-title">
        <div class="club-page__inner">
          <div class="club-art" aria-hidden="true"><img src="/home-art/learning-poster.png" alt="" width="1672" height="941" decoding="async" /></div>
          <div class="club-section__content" data-page-content>
            <header class="club-section__head"><h1 id="club-title" tabindex="-1">从这里开始</h1><a href="/resources/">全部资源 <i class="ti ti-arrow-up-right" aria-hidden="true" /></a></header>
            <div class="club-paths">
              <a v-for="path in paths" :key="path.href" :href="path.href" class="club-path">
                <i :class="['ti', path.icon]" aria-hidden="true" /><h3>{{ path.title }}</h3><i class="ti ti-arrow-up-right club-path__arrow" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>
      <section id="activities" class="club-page club-section" data-club-page tabindex="-1" aria-labelledby="activity-title">
        <div class="club-page__inner">
          <div class="club-art" aria-hidden="true"><img src="/home-art/activities-poster.png" alt="" width="1672" height="941" loading="lazy" decoding="async" /></div>
          <div class="club-section__content" data-page-content>
            <header class="club-section__head"><h2 id="activity-title" tabindex="-1">最近在做什么</h2><a href="/activities/">全部活动 <i class="ti ti-arrow-up-right" aria-hidden="true" /></a></header>
            <MagArchive source="activities" :limit="3" :show-view-toggle="false" />
          </div>
        </div>
      </section>
      <section id="community" class="club-page club-section club-community" data-club-page tabindex="-1" aria-labelledby="community-title">
        <div class="club-page__inner">
          <div class="club-art" aria-hidden="true"><img src="/home-art/community-poster.png" alt="" width="1672" height="941" loading="lazy" decoding="async" /></div>
          <div class="club-section__content" data-page-content>
            <h2 id="community-title" tabindex="-1">好奇心，<br />是共同的起点。</h2>
            <div class="club-actions"><a class="club-button" href="/join-us/">加入我们 <i class="ti ti-arrow-up-right" aria-hidden="true" /></a><a class="club-about" href="/about-us/">了解社团 <i class="ti ti-arrow-up-right" aria-hidden="true" /></a></div>
          </div>
        </div>
      </section>
    </div>
    <nav v-if="enabled" class="club-pager" aria-label="首页栏目">
      <button type="button" aria-label="上一屏" :disabled="busy || active <= (asciiAvailable ? 0 : 1)" @click="navigate(active - 1)"><i class="ti ti-chevron-up" aria-hidden="true" /></button>
      <button v-for="(page, index) in pages" :key="page" type="button" :aria-label="page" :aria-current="active === index ? 'step' : undefined" :disabled="busy || (index === 0 && !asciiAvailable)" @click="navigate(index)"><span class="club-pager__mark" /></button>
      <button type="button" aria-label="下一屏" :disabled="busy || active === pages.length - 1" @click="navigate(active + 1)"><i class="ti ti-chevron-down" aria-hidden="true" /></button>
    </nav>
    <span v-if="enabled" class="club-page-count" aria-hidden="true">{{ String(active + 1).padStart(2, '0') }} <span>/ 04</span></span>
    <span class="club-sr-only" aria-live="polite">{{ enabled ? pages[active] : '' }}</span>
  </div>
</template>

<style scoped>
.club-home { --page-height: calc(100svh - var(--vp-nav-height, 64px)); position: relative; width: 100%; color: var(--mag-text); }
.club-page { min-height: var(--page-height); scroll-margin-top: var(--vp-nav-height, 64px); }
.club-page__inner { position: relative; display: flex; align-items: center; min-height: var(--page-height); width: 100%; background: var(--vp-c-bg); }
.club-opening .club-page__inner { display: block; }
.club-section__content { position: relative; z-index: 1; width: min(38vw, 520px); margin-left: max(7vw, calc((100vw - 1240px) / 2)); padding: 48px 0; }
.club-section__head { display: flex; align-items: baseline; justify-content: space-between; flex-wrap: wrap; gap: 12px 20px; margin-bottom: 36px; }
.club-section__head :is(h1,h2) { margin: 0; font-size: 22px; font-weight: 500; line-height: 1.5; letter-spacing: -.015em; }
.club-section__head > a, .club-about { display: inline-flex; align-items: center; gap: 10px; font-size: 13px; }
.club-section__head > a:hover, .club-about:hover { color: var(--mag-accent); }
.club-paths { display: grid; }
.club-path { display: flex; align-items: center; gap: 16px; min-height: 72px; padding: 20px 0; border-bottom: var(--mag-rule); transition: border-color .2s; }
.club-path:hover { border-color: var(--mag-hairline-strong); }
.club-path > i { font-size: 20px; color: var(--mag-text-secondary); }
.club-path__arrow { margin-left: auto; transition: transform .4s var(--mag-ease); }
.club-path:hover .club-path__arrow { transform: translate(3px, -3px); }
.club-path h3 { margin: 0; font-size: 16px; font-weight: 500; }
.club-section :deep(.mag-archive) { margin: 0; }
.club-section :deep(.mag-archive__row) { grid-template-columns: minmax(0, 1fr) 20px; gap: 8px 16px; }
.club-section :deep(.mag-archive__date) { grid-column: 1; }
.club-section :deep(.mag-archive__row-main) { grid-column: 1; }
.club-section :deep(.mag-archive__arrow) { grid-column: 2; grid-row: 2; }
.club-art { position: absolute; inset: 0; overflow: hidden; pointer-events: none; isolation: isolate; background: var(--vp-c-bg); }
.club-art img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: 70% center; }
:global(.dark .club-art img) { filter: invert(1) hue-rotate(180deg); mix-blend-mode: screen; }
.club-art::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, var(--vp-c-bg) 0%, var(--vp-c-bg) 22%, color-mix(in srgb, var(--vp-c-bg) 96%, transparent) 36%, color-mix(in srgb, var(--vp-c-bg) 65%, transparent) 49%, color-mix(in srgb, var(--vp-c-bg) 12%, transparent) 69%, transparent 85%); }
.club-community h2 { margin: 0; font-size: 22px; font-weight: 500; line-height: 1.65; letter-spacing: -.02em; }
.club-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 24px; margin-top: 32px; }
.club-button { display: inline-flex; align-items: center; justify-content: center; gap: 20px; min-height: 44px; padding: 11px 16px; border: var(--mag-rule); border-radius: 8px; font-size: 14px; }
.club-button:hover { border-color: var(--mag-hairline-strong); }
.club-button i { font-size: 18px; }
.is-paged { height: var(--page-height); overflow: hidden; touch-action: pan-x pinch-zoom; }
.is-paged .club-pages { position: relative; height: 100%; }
.is-paged .club-page { position: absolute; inset: 0; height: 100%; overflow: hidden; }
.is-paged .club-page__inner { height: 100%; }
.is-paged :deep(.mag-ascii-hero) { touch-action: pan-x pinch-zoom; }
.is-paged .club-section__content { max-height: 100%; overflow-y: auto; scrollbar-width: thin; }
.club-pager { position: absolute; z-index: 5; right: 20px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; align-items: center; padding: 8px 0; border: var(--mag-rule); border-radius: 24px; background: var(--vp-c-bg); }
.club-pager button { display: flex; align-items: center; justify-content: center; width: 40px; height: 36px; color: var(--mag-text-secondary); }
.club-pager button:disabled { opacity: .35; }
.club-pager button[aria-current] { opacity: 1; color: var(--mag-accent); }
.club-pager__mark { display: block; width: 4px; height: 4px; border-radius: 4px; background: currentColor; transition: height .3s var(--mag-ease); }
.club-pager button[aria-current] .club-pager__mark { height: 20px; }
.club-page-count { position: absolute; z-index: 5; bottom: 24px; left: max(7vw, calc((100vw - 1240px) / 2)); font-size: 12px; font-variant-numeric: tabular-nums; color: var(--mag-text-secondary); }
.club-page-count > span { padding-left: 10px; color: var(--mag-text-tertiary); }
.club-sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media (max-width: 960px) {
  .club-section__content { width: 45vw; margin-left: 5vw; }
  .club-pager { right: 12px; }
  .club-art::after { background: linear-gradient(90deg, var(--vp-c-bg) 0%, var(--vp-c-bg) 28%, color-mix(in srgb, var(--vp-c-bg) 94%, transparent) 45%, transparent 100%); }
}
@media (max-width: 700px) {
  .club-section__content { width: calc(100% - 80px); margin-left: 24px; padding: 40px 0 72px; }
  .club-section__head { margin-bottom: 24px; }
  .club-section__head :is(h1,h2) { font-size: 20px; }
  .club-path { min-height: 64px; padding: 18px 0; }
  .club-art img { object-position: 74% center; }
  .club-art::after { background: linear-gradient(90deg, var(--vp-c-bg) 0%, color-mix(in srgb, var(--vp-c-bg) 96%, transparent) 30%, color-mix(in srgb, var(--vp-c-bg) 84%, transparent) 64%, color-mix(in srgb, var(--vp-c-bg) 20%, transparent) 100%); }
  .club-pager { right: 8px; }
  .club-pager button { width: 32px; height: 34px; }
  .club-page-count { left: 24px; bottom: 20px; }
}
@media (max-height: 559px) {
  .club-section__content { padding-block: 48px; }
}
@media print {
  .is-paged, .is-paged .club-pages { height: auto; overflow: visible; }
  .is-paged .club-page { position: relative; height: auto; visibility: visible !important; opacity: 1 !important; transform: none !important; break-inside: avoid; }
  .club-page__inner { transform: none !important; }
  .club-pager, .club-page-count, .club-opening { display: none; }
}
</style>
