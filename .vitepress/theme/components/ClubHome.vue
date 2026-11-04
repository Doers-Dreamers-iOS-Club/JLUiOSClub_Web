<script setup lang="ts">
import { defineAsyncComponent, onMounted, onBeforeUnmount, ref } from 'vue'
import { useHomeIntro } from '../composables/useHomeIntro'
const AsciiNarrative = defineAsyncComponent(() => import('./AsciiNarrative.vue'))
import AsciiPoster from './AsciiPoster.vue'
import { data as activities } from '../../data/activities.data.mts'
const AsciiHero = defineAsyncComponent(() => import('./AsciiHero.vue'))
import { useFullPage } from '../composables/useFullPage'
const root = ref<HTMLElement | null>(null)
const { playing } = useHomeIntro(root)
const { active, enabled, busy, asciiAvailable, navigate } = useFullPage(root, playing)
const loadAscii = ref(false)
let paintFrame = 0
onMounted(() => { paintFrame = requestAnimationFrame(() => { paintFrame = requestAnimationFrame(() => { loadAscii.value = true }) }) })
onBeforeUnmount(() => cancelAnimationFrame(paintFrame))
const pages = ['开场', '学习', '活动', '加入']
const opening = ref<InstanceType<typeof AsciiHero> | null>(null)
const asciiReady = ref(false)
const coveringOpening = ref(false)
const captureOpening = () => opening.value?.snapshot() ?? null
const latest = activities.slice(0,3)
const dateParts = (date: string) => ({ year: date.slice(0,4), day: date.slice(5) })
const paths = [
  { title: '从想法到作品', href: '/resources/ai-programming/', icon: 'ti-sparkles' },
  { title: 'Winter Swift', href: '/activities/260209-winter-swift/', icon: 'ti-code' },
  { title: 'AI Agent 实战', href: '/activities/251102-AI-Agent/', icon: 'ti-terminal-2' },
  { title: 'Vibe Coding', href: '/activities/251018-vibe-coding/', icon: 'ti-device-mobile' }
]
</script>

<template>
  <div ref="root" class="club-home" :class="{ 'is-intro': playing, 'is-paged': enabled, 'is-changing': busy, 'has-ascii-canvas': asciiReady && enabled, 'is-ascii-transition': coveringOpening }">
    <div class="club-pages">
      <section id="index" class="club-page club-opening" data-club-page tabindex="-1" aria-label="ASCII 开场">
        <div class="club-page__inner">
          <AsciiHero v-if="loadAscii" ref="opening" :active="!playing && (!enabled || active === 0)" />
          <p class="club-opening__poem" lang="en"><span class="club-opening__i">I</span> <span class="club-opening__dwell"><span>dwell</span> <span>in</span></span> <span class="club-opening__possibility">Possibilit<span class="club-opening__final-y">y</span></span></p>
        </div>
      </section>
      <section id="start" class="club-page club-section club-learning" data-club-page tabindex="-1" aria-labelledby="club-title">
        <div class="club-page__inner">
          <div class="club-section__content" data-page-content>
            <header class="club-section__head"><h1 id="club-title" tabindex="-1"><span class="club-copy-mask"><span data-page-copy>从这里开始</span></span></h1><a href="/resources/" data-page-copy>全部资源 <i class="ti ti-arrow-up-right" aria-hidden="true" /></a></header>
            <AsciiPoster :scene="1" />
            <div class="club-paths">
              <a v-for="(path,index) in paths" :key="path.href" :href="path.href" class="club-path" data-page-copy>
                <span class="club-path__number">0{{ index+1 }}</span><h3>{{ path.title }}</h3><i class="ti ti-arrow-up-right club-path__arrow" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>
      <section id="activities" class="club-page club-section club-activities" data-club-page tabindex="-1" aria-labelledby="activity-title">
        <div class="club-page__inner">
          <div class="club-section__content" data-page-content>
            <header class="club-section__head"><h2 id="activity-title" tabindex="-1"><span class="club-copy-mask"><span data-page-copy>最近在做什么</span></span></h2><a href="/activities/" data-page-copy>全部活动 <i class="ti ti-arrow-up-right" aria-hidden="true" /></a></header>
            <div class="club-making"><AsciiPoster :scene="2" /><div class="club-making__records">
            <a v-if="latest[0]" :href="latest[0].url" class="club-latest">
              <time class="club-latest__date" :datetime="latest[0].date.replaceAll('.', '-')"><span data-page-copy>{{ dateParts(latest[0].date).year }}</span><span data-page-copy>{{ dateParts(latest[0].date).day }}</span></time>
              <div class="club-latest__title"><span class="club-latest__label" data-page-copy><span />最近一次</span><h3 data-page-copy>{{ latest[0].title }}</h3><i data-page-copy class="ti ti-arrow-up-right" aria-hidden="true" /></div>
            </a>
            <div class="club-activity-history">
              <a v-for="entry in latest.slice(1)" :key="entry.url" :href="entry.url" class="club-activity-row" data-page-copy><time :datetime="entry.date.replaceAll('.', '-')">{{ entry.date }}</time><h3>{{ entry.title }}</h3><i class="ti ti-arrow-up-right" aria-hidden="true" /></a>
            </div>
            </div></div>
          </div>
        </div>
      </section>
      <section id="community" class="club-page club-section club-community" data-club-page tabindex="-1" aria-labelledby="community-title">
        <div class="club-page__inner">
          <div class="club-section__content" data-page-content>
            <AsciiPoster :scene="3" />
            <h2 id="community-title" tabindex="-1"><span class="club-copy-mask"><span data-page-copy>好奇心，</span></span><span class="club-copy-mask"><span data-page-copy>是共同的起点。</span></span></h2>
            <div class="club-actions"><a class="club-button" data-page-copy href="/join-us/">加入我们 <i class="ti ti-arrow-up-right" aria-hidden="true" /></a><a class="club-about" data-page-copy href="/about-us/">了解社团 <i class="ti ti-arrow-up-right" aria-hidden="true" /></a></div>
          </div>
        </div>
      </section>
    </div>
    <AsciiNarrative v-if="loadAscii && !playing" :page="active" :paged="enabled" :opening="captureOpening" @ready="asciiReady = $event" @covering="coveringOpening = $event" />
    <nav v-if="enabled" class="club-pager" aria-label="首页栏目">
      <button type="button" aria-label="上一屏" :disabled="playing || busy || active <= (asciiAvailable ? 0 : 1)" @click="navigate(active - 1)"><i class="ti ti-chevron-up" aria-hidden="true" /></button>
      <button v-for="(page, index) in pages" :key="page" type="button" :aria-label="page" :aria-current="active === index ? 'step' : undefined" :disabled="playing || busy || (index === 0 && !asciiAvailable)" @click="navigate(index)"><span class="club-pager__label" aria-hidden="true">{{ page }}</span><span class="club-pager__mark" aria-hidden="true" /></button>
      <button type="button" aria-label="下一屏" :disabled="playing || busy || active === pages.length - 1" @click="navigate(active + 1)"><i class="ti ti-chevron-down" aria-hidden="true" /></button>
    </nav>
    <span class="club-sr-only" aria-live="polite">{{ enabled ? pages[active] : '' }}</span>
  </div>
</template>

<style scoped>
@font-face { font-family: 'Club Instrument Serif'; src: url('/fonts/instrument-serif/instrument-serif-latin.woff2') format('woff2'); font-style: normal; font-weight: 400; font-display: swap; }
.club-home { --page-height: calc(100svh - var(--vp-nav-height, 64px)); position: relative; width: 100%; color: var(--mag-text); }
.club-page { min-height: var(--page-height); scroll-margin-top: var(--vp-nav-height, 64px); }
.club-page__inner { position: relative; display: flex; align-items: center; min-height: var(--page-height); width: 100%; background: var(--vp-c-bg); }
.club-opening .club-page__inner { display: block; }
.club-opening__poem {
  --poem-height: calc(var(--page-height) * .87);
  --poem-title-size: min(24vw,480px);
  --poem-upper-room: calc(var(--poem-height) - var(--poem-title-size) * .84);
  --poem-i-size: min(calc(var(--poem-title-size) * .95),calc(var(--poem-upper-room) / 1.231));
  --poem-middle-size: min(calc(var(--poem-i-size) * .75),calc((var(--poem-upper-room) - var(--poem-i-size) * .72) / .73));
  position: absolute; z-index: 0; inset: 5% auto 8% 5vw; width: max-content; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-start; margin: 0; font-family: 'Club Instrument Serif', var(--mag-font-serif); font-weight: 400; font-synthesis: none; line-height: .88; letter-spacing: -.025em; pointer-events: none;
}
.club-opening__poem > span { display: block; flex: none; }
.club-opening__i { font-size: var(--poem-i-size); line-height: .72; }
.club-opening__dwell { font-size: var(--poem-middle-size); line-height: .76; margin-bottom: calc(var(--poem-middle-size) * -.03 - var(--poem-title-size) * .04); white-space: nowrap; }
.club-opening__poem > .club-opening__dwell { display: flex; align-self: stretch; justify-content: space-between; gap: .25em; }
.club-opening__dwell > span:last-child { letter-spacing: 0; }
.club-opening__possibility { font-size: var(--poem-title-size); letter-spacing: -.025em; }
.club-opening__final-y { display: inline-block; margin-left: .035em; letter-spacing: 0; }
@supports (-webkit-text-stroke: 1px currentColor) {
  .club-opening__possibility { -webkit-text-stroke: 1px var(--mag-text); -webkit-text-fill-color: transparent; }
}
@media (forced-colors: active) {
  .club-opening__possibility { -webkit-text-stroke: 0; -webkit-text-fill-color: currentColor; }
}
@media (max-width: 960px) and (orientation: portrait) {
  .club-opening__poem { --poem-title-size: 24vw; --poem-i-size: 19.2vw; --poem-middle-size: 12vw; inset: 5% auto 12% 20px; }
}
@media (max-height: 700px) and (orientation: landscape) {
  .club-opening__poem { --poem-title-size: min(24vw,39svh); }
}
.club-section__content { position: relative; width: min(1120px, 82vw); margin-inline: auto; padding: 48px 0 64px; }
.club-copy-mask { display: block; overflow: hidden; padding-block: .08em; margin-block: -.08em; }
.club-copy-mask > span { display: block; }
.is-changing [data-page-copy] { transition: none !important; }
.club-section__head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 32px; }
.club-section__head :is(h1,h2) { margin: 0; font-size: 22px; font-weight: 500; line-height: 1.5; letter-spacing: -.015em; }
.club-section__head > a, .club-about { display: inline-flex; align-items: center; gap: 10px; font-size: 13px; color: var(--mag-text-secondary); }
.club-section__head > a:hover, .club-about:hover { color: var(--mag-accent); }
.club-learning__main { display: grid; grid-template-columns: 1fr 1fr; align-items: center; min-height: 310px; margin-bottom: 36px; }
.club-path { color: var(--mag-text); }
.club-path__number { font-family: var(--mag-font-mono); font-size: 12px; color: var(--mag-text-secondary); }
.club-path h3 { margin: 0; font-size: 16px; font-weight: 500; line-height: 1.6; }
.club-path--lead { display: grid; justify-items: start; gap: 22px; width: fit-content; padding-block: 24px; }
.club-path--lead h3 { font-size: 22px; }
.club-path__open { display: grid; place-items: center; width: 44px; height: 44px; border: var(--mag-rule); border-radius: 50%; font-size: 20px; transition: color .2s, border-color .2s; }
.club-path--lead:hover .club-path__open { color: var(--mag-accent); border-color: var(--mag-accent-border); }
.club-paths { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 32px; }
.club-paths .club-path { display: grid; grid-template-columns: 1fr 20px; gap: 20px 12px; border-top: var(--mag-rule); padding-top: 20px; padding-bottom: 16px; }
.club-paths .club-path__number { grid-column: 1/-1; }
.club-path__arrow { color: var(--mag-text-secondary); font-size: 20px; align-self: center; transition: transform .35s var(--mag-ease); }
.club-path:hover .club-path__arrow { transform: translate(3px,-3px); color: var(--mag-accent); }
.club-path:hover h3 { color: var(--mag-accent); }
.club-latest { display: grid; grid-template-columns: 1fr 1.1fr; gap: 48px; align-items: center; padding: 48px 0 52px; border-bottom: var(--mag-rule); color: var(--mag-text); }
.club-latest__date { display: flex; flex-direction: column; align-items: flex-start; font-family: var(--mag-font-mono); font-variant-numeric: tabular-nums; }
.club-latest__date > span:first-child { color: var(--mag-text-secondary); font-size: 14px; margin-left: 5px; }
.club-latest__date > span:last-child { font-size: clamp(56px,8vw,110px); font-weight: 400; line-height: 1.3; letter-spacing: -.075em; }
.club-latest__title { display: grid; grid-template-columns: 1fr 30px; gap: 18px 24px; align-items: center; }
.club-latest__label { display: flex; gap: 8px; align-items: center; grid-column: 1/-1; color: var(--mag-text-secondary); font-size: 12px; }
.club-latest__label > span { width: 5px; height: 5px; background: var(--mag-accent); border-radius: 50%; }
.club-latest h3 { font-size: 22px; font-weight: 500; line-height: 1.6; margin: 0; }
.club-latest__title > i { color: var(--mag-accent); font-size: 26px; transition: transform .35s var(--mag-ease); }
.club-latest:hover .club-latest__title > i { transform: translate(3px,-3px); }
.club-latest:hover h3 { color: var(--mag-accent); }
.club-activity-history { width: 70%; margin-left: auto; margin-top: 30px; }
.club-activity-row { display: grid; grid-template-columns: 90px 1fr 20px; align-items: baseline; gap: 20px; border-bottom: var(--mag-rule); padding: 22px 0; color: var(--mag-text); }
.club-activity-row time { font-size: 12px; color: var(--mag-text-secondary); font-variant-numeric: tabular-nums; }
.club-activity-row h3 { margin: 0; font-size: 16px; font-weight: 400; line-height: 1.7; }
.club-activity-row > i { color: var(--mag-text-secondary); }
.club-activity-row:hover h3,.club-activity-row:hover > i { color: var(--mag-accent); }
.club-community .club-section__content { text-align: center; }
.club-community h2 { margin: 12px 0 0; font-size: 22px; font-weight: 500; line-height: 1.65; letter-spacing: -.02em; }
.club-actions { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 28px; margin-top: 32px; }
.club-button { display: inline-flex; align-items: center; justify-content: center; gap: 20px; min-height: 44px; padding: 11px 16px; border: var(--mag-rule); border-radius: 8px; font-size: 14px; }
.club-button:hover { border-color: var(--mag-accent-border); color: var(--mag-accent); }
.club-button i { font-size: 18px; }
.is-paged { height: var(--page-height); overflow: hidden; touch-action: pan-x pinch-zoom; }
.is-paged .club-pages { position: relative; height: 100%; }
.is-paged .club-page { position: absolute; inset: 0; height: 100%; overflow: hidden; }
.is-paged .club-page__inner { height: 100%; }
.is-paged :deep(.mag-ascii-hero) { touch-action: pan-x pinch-zoom; }
.is-paged .club-section__content { max-height: 100%; overflow-y: auto; scrollbar-width: thin; }
.club-pager { position: absolute; z-index: 5; right: 20px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; align-items: center; padding: 8px 0; border: var(--mag-rule); border-radius: 24px; background: var(--vp-c-bg); }
.club-pager button { position: relative; display: flex; align-items: center; justify-content: center; width: 40px; height: 36px; color: var(--mag-text-secondary); transition: color .25s var(--mag-ease); }
.club-pager button:disabled { opacity: .35; }
.club-pager button[aria-current] { opacity: 1; color: var(--mag-accent); }
.club-pager__mark { display: block; width: 4px; height: 4px; border-radius: 4px; background: currentColor; transition: height .3s var(--mag-ease), transform .3s var(--mag-ease); }
.club-pager button[aria-current] .club-pager__mark { height: 20px; }
.club-pager__label { position: absolute; right: calc(100% + 18px); padding: 4px 8px; font-size: 13px; line-height: 1.5; white-space: nowrap; color: var(--mag-text); background: var(--vp-c-bg); opacity: 0; transform: translateX(8px); pointer-events: none; transition: opacity .25s var(--mag-ease), transform .35s var(--mag-ease); }
.club-pager button:has(.club-pager__mark)::after { content: ''; position: absolute; top: calc(50% - .5px); right: calc(50% + 5px); width: 24px; height: 1px; background: currentColor; transform: scaleX(0); transform-origin: right; transition: transform .35s var(--mag-ease); }
.club-pager button > i { transition: transform .3s var(--mag-ease); }
.club-pager button:focus-visible { color: var(--mag-accent); outline: 1px solid var(--mag-accent); outline-offset: 2px; border-radius: 6px; }
.club-pager button:focus-visible .club-pager__label { opacity: 1; transform: translateX(0); }
.club-pager button:focus-visible::after { transform: scaleX(1); }
@media (hover: hover) {
  .club-pager button:not(:disabled):hover { color: var(--mag-accent); }
  .club-pager button:not(:disabled):hover .club-pager__label { opacity: 1; transform: translateX(0); }
  .club-pager button:not(:disabled):hover::after { transform: scaleX(1); }
  .club-pager button:not(:disabled):hover .club-pager__mark { transform: scale(1.35); }
  .club-pager button:first-child:not(:disabled):hover > i { transform: translateY(-3px); }
  .club-pager button:last-child:not(:disabled):hover > i { transform: translateY(3px); }
}
@media (prefers-reduced-motion: reduce) {
  .club-pager button, .club-pager__mark, .club-pager__label, .club-pager button::after, .club-pager button > i { transition: none; }
}
.club-sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media (max-width: 960px) {
  .club-section__content { width: calc(100% - 140px); margin-left: 48px; }
  .club-paths { gap: 24px; }
  .club-activity-history { width: 85%; }
  .club-pager { right: 12px; }
}
@media (max-width: 700px) {
  .club-section__content { width: calc(100% - 80px); margin-left: 24px; padding: 28px 0 60px; }
  .club-section__head { margin-bottom: 20px; flex-wrap: wrap; gap: 8px 16px; }
  .club-section__head :is(h1,h2) { font-size: 20px; }
  .club-section__head > a { font-size: 12px; }
  .club-learning__main { grid-template-columns: 1fr; min-height: 0; margin-bottom: 16px; position: relative; }
  .club-learning__main :deep(.home-geometry) { grid-row: 1; max-width: 200px; }
  .club-path--lead { grid-template-columns: 22px 1fr 36px; align-items: center; gap: 12px; width: 100%; padding-block: 16px; }
  .club-path--lead h3 { font-size: 18px; }
  .club-path__open { width: 36px; height: 36px; font-size: 18px; }
  .club-paths { grid-template-columns: 1fr; gap: 0; }
  .club-paths .club-path { grid-template-columns: 22px 1fr 20px; gap: 12px; align-items: center; padding-block: 18px; }
  .club-paths .club-path__number { grid-column: auto; }
  .club-paths h3 { font-size: 15px; }
  .club-latest { grid-template-columns: 1fr; gap: 24px; padding: 20px 0 28px; }
  .club-latest__date > span:last-child { font-size: clamp(64px,16vw,100px); }
  .club-latest__title { gap: 12px; }
  .club-latest h3 { font-size: 18px; }
  .club-latest__title > i { font-size: 22px; }
  .club-activity-history { width: 100%; margin-top: 12px; }
  .club-activity-row { grid-template-columns: 1fr 20px; gap: 8px 16px; padding: 18px 0; }
  .club-activity-row time { grid-column: 1/-1; }
  .club-activity-row h3 { font-size: 14px; }
  .club-community h2 { margin-top: 0; }
  .club-actions { flex-direction: column; gap: 24px; margin-top: 28px; }
  .club-pager { right: 8px; }
  .club-pager button { width: 32px; height: 34px; }
}
@media (max-height: 740px) and (min-width: 701px) {
  .club-section__content { padding-block: 32px 48px; }
  .club-learning__main { min-height: 0; margin-bottom: 20px; }
  .club-learning__main :deep(.home-geometry) { max-width: 290px; }
  .club-latest { padding-block: 24px 32px; }
  .club-activity-history { margin-top: 12px; }
  .club-community :deep(.home-geometry) { max-width: 200px; }
}
@media (max-height: 559px) {
  .club-section__content { padding-block: 48px; }
}
@media print {
  .is-paged, .is-paged .club-pages { height: auto; overflow: visible; }
  .is-paged .club-page { position: relative; height: auto; visibility: visible !important; opacity: 1 !important; transform: none !important; break-inside: avoid; }
  .club-page__inner { transform: none !important; }
  .club-pager, .club-opening { display: none; }
}

.club-learning .club-section__content { overflow: visible; }
.club-learning :deep(.ascii-slot) { width: 100vw; height: min(440px,32vw,calc(100svh - 400px)); margin: 12px 0 44px calc(50% - 50vw); }
.club-making { display: grid; grid-template-columns: .9fr 1.1fr; gap: 64px; align-items: center; }
.club-making :deep(.ascii-slot) { height: 440px; }
.club-making__records { min-width: 0; }
.club-latest { grid-template-columns: 1fr; gap: 24px; padding: 16px 0 28px; }
.club-latest__date > span:last-child { font-size: 64px; }
.club-latest h3 { font-size: 20px; }
.club-activity-history { width: 100%; margin-top: 8px; }
.club-activity-row { grid-template-columns: 1fr 20px; gap: 8px 16px; padding: 18px 0; }
.club-activity-row time { grid-column: 1/-1; }
.club-activity-row h3 { font-size: 14px; }
.club-community :deep(.ascii-slot) { height: 350px; max-width: 510px; margin: 0 auto 24px; }
.has-ascii-canvas :deep(.ascii-poster) { visibility: hidden; }
.is-ascii-transition :deep(.mag-ascii-hero__canvas) { visibility: hidden; transition: none; }
@media(max-width:960px) and (min-width:701px) { .club-learning :deep(.ascii-slot) { margin-left: -48px; } }
@media(max-width:700px) {
 .club-learning :deep(.ascii-slot) { height: clamp(100px,32vw,180px); margin: 12px 0 24px -24px; }
 .club-paths { grid-template-columns: 1fr; gap: 0; }
 .club-making { grid-template-columns: 1fr; gap: 12px; }
 .club-making :deep(.ascii-slot) { height: 170px; }
 .club-latest { grid-template-columns: 95px minmax(0,1fr); gap: 16px; padding: 12px 0 20px; }
 .club-latest__date > span:last-child { font-size: 32px; }
 .club-latest__date > span:first-child { font-size: 12px; margin-left: 0; }
 .club-latest h3 { font-size: 16px; }
 .club-latest__title { grid-template-columns: 1fr; gap: 8px; }
 .club-latest__title > i { display: none; }
 .club-community :deep(.ascii-slot) { height: clamp(210px,34svh,280px); }
}
@media(max-height:740px) and (min-width:701px) {
 .club-learning :deep(.ascii-slot) { height: min(230px,calc(100svh - 330px)); margin-bottom: 28px; }
 .club-making :deep(.ascii-slot) { height: 300px; }
 .club-community :deep(.ascii-slot) { height: 200px; }
}
@media print { .has-ascii-canvas :deep(.ascii-poster) { visibility: visible; } }
@media(max-height:559px) { .club-learning :deep(.ascii-slot) { height: min(32vw,350px); } }
</style>

<style>
.club-intro { position: fixed; inset: 0; z-index: 25; overflow: hidden; pointer-events: none; color: var(--mag-text); font-family: 'Club Instrument Serif', serif; font-weight: 400; }
.club-intro__source { position: absolute; top: 48%; left: 50%; transform: translate(-50%,-50%); display: flex; gap: .22em; line-height: 1; white-space: nowrap; letter-spacing: -.025em; }
.club-intro__echo { display: block; }
.club-intro__echo > span { display: inline-block; }
.club-home.is-intro { --intro-hero-opacity: 0; }
.is-intro .club-opening__poem { visibility: hidden; }
.is-intro .mag-ascii-hero { opacity: var(--intro-hero-opacity); pointer-events: none; }
.is-intro .club-pager { opacity: var(--intro-hero-opacity); pointer-events: none; }
</style>
