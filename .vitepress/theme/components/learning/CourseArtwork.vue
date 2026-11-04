<script setup lang="ts">
import { ref } from 'vue'
import { useCourseArtworkMotion } from '../../composables/useCourseArtworkMotion'
const artwork = ref<HTMLElement | null>(null)
useCourseArtworkMotion(artwork)
withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })
</script>
<template>
  <figure ref="artwork" class="course-art mag-no-reveal" :class="{ 'course-art--compact': compact }" aria-label="从想法到贪吃蛇：画出草稿，与代码协作，做成游戏">
    <div class="art-stage" data-motion-state="waiting">
      <svg viewBox="0 0 340 320" role="img" aria-label="想法：纸上的贪吃蛇草图">
        <ellipse cx="160" cy="276" rx="109" ry="12" class="art-shadow" />
        <g transform="rotate(-7 170 158)">
          <path d="M65 44H231L270 83V264H65Z" class="art-paper art-edge" />
          <path d="M231 44V83H270" class="art-fold art-edge" />
          <path d="M88 73h43M88 80h27" class="art-quiet" />
          <rect x="88" y="102" width="158" height="119" rx="2" class="art-sketch-frame" />
          <path d="M104 197l46-1 1-45 48 1 1-26 25 1" class="art-sketch" />
          <path d="M105 202l48-1 3-44 45 1 4-27 20 1" class="art-sketch art-sketch--light" />
          <circle cx="222" cy="126" r="2" class="art-ink" />
          <path d="M110 123v12m-6-6h12M218 185l7 7m0-7-7 7" class="art-quiet" />
          <path d="M88 241h65m10 0h29" class="art-quiet" />
          <path d="M213 238l5 5 12-13" class="art-blue-line" />
        </g>
        <g class="art-pen-motion"><g transform="rotate(28 271 204)">
          <path d="M266 117h11v140l-5.5 17-5.5-17Z" class="art-pencil art-edge" />
          <path d="M266 257h11m-5.5-127v124" class="art-pencil-line" />
          <path d="M269 267l3 8 3-8" class="art-ink" />
          <path d="M266 117v-7a5.5 5.5 0 0 1 11 0v7" class="art-fold art-edge" />
        </g>
        </g>
        <path d="M37 99l-9-5m15-5-2-11M293 58l7-8" class="art-quiet" />
      </svg>
      <span class="art-stage__label"><i>01</i> 想法</span>
    </div>
    <svg class="art-connector" viewBox="0 0 80 80" aria-hidden="true"><path d="M4 51C29 51 35 27 70 27m-8-7 8 7-8 7" /></svg>
    <div class="art-stage" data-motion-state="waiting">
      <svg viewBox="0 0 340 320" role="img" aria-label="代码：把草图写成可以运行的程序">
        <ellipse cx="170" cy="276" rx="117" ry="12" class="art-shadow" />
        <rect x="48" y="42" width="247" height="224" rx="8" class="art-paper art-edge" />
        <path d="M48 78H295" class="art-quiet" />
        <circle cx="66" cy="60" r="3" class="art-muted" /><circle cx="78" cy="60" r="3" class="art-muted" /><circle cx="90" cy="60" r="3" class="art-muted" />
        <path d="M260 56h17m-17 7h10M84 96v146" class="art-quiet" />
        <g class="art-code-numbers"><text x="65" y="116">1</text><text x="65" y="142">2</text><text x="65" y="168">3</text><text x="65" y="194">4</text><text x="65" y="220">5</text></g>
        <g class="art-code"><text x="99" y="116">game = {</text><text x="116" y="142">snake,</text><text x="116" y="168">move,</text><text x="116" y="194">play</text><text x="99" y="220">}</text></g>
        <path d="M170 182v16" class="art-blue-line art-caret" />
        <g class="art-play"><rect x="232" y="226" width="71" height="45" rx="6" class="art-blue" />
        <path d="M261 238l17 10-17 10Z" class="art-white" />
        </g>
        <path d="M285 261l4 30 7-9 11-1Z" class="art-cursor" />
      </svg>
      <span class="art-stage__label"><i>02</i> 代码</span>
    </div>
    <svg class="art-connector" viewBox="0 0 80 80" aria-hidden="true"><path d="M4 27C29 27 35 51 70 51m-8-7 8 7-8 7" /></svg>
    <div class="art-stage" data-motion-state="waiting">
      <svg viewBox="0 0 340 320" role="img" aria-label="作品：完成的蓝色贪吃蛇游戏">
        <ellipse cx="173" cy="276" rx="124" ry="12" class="art-shadow" />
        <g transform="rotate(3 170 158)">
          <rect x="33" y="43" width="275" height="224" rx="8" class="art-paper art-edge" />
          <path d="M33 78H308" class="art-quiet" />
          <path d="M53 56v9m5-9v9" class="art-blue-line" />
          <circle cx="276" cy="61" r="3" class="art-blue" /><circle cx="288" cy="61" r="3" class="art-muted" />
          <rect x="45" y="90" width="251" height="165" rx="3" class="art-board" />
          <path v-for="n in 8" :key="'v'+n" :d="`M${45+n*28} 90v165`" class="art-grid" />
          <path v-for="n in 5" :key="'h'+n" :d="`M45 ${90+n*28}h251`" class="art-grid" />
          <path d="M76 221H123Q135 221 135 209V171Q135 159 147 159H207Q219 159 219 147V132Q219 120 231 120H257" class="art-snake-shadow" />
          <path d="M76 216H123Q135 216 135 204V166Q135 154 147 154H207Q219 154 219 142V127Q219 115 231 115H257" class="art-snake" />
          <circle cx="257" cy="111" r="2.5" class="art-white art-snake-eye" />
          <g class="art-apple"><path d="M82 123c-12-9-19 5-13 13 4 6 8 8 13 6 5 2 9 0 13-6 6-8-1-22-13-13Z" class="art-food" />
          <path d="M82 121q0-9 8-10" class="art-food-stem" /></g>
        </g>
        <path d="M294 23v12m-6-6h12M21 220l-7 4" class="art-blue-line" />
      </svg>
      <span class="art-stage__label"><i>03</i> 作品</span>
    </div>
  </figure>
</template>
<style scoped>
.course-art { display: grid; grid-template-columns: 1fr 46px 1fr 46px 1fr; align-items: center; margin: 10px 0 0; padding: 28px 0 30px; border-top: var(--mag-rule); border-bottom: var(--mag-rule); color: var(--mag-text); }
.art-stage { min-width: 0; }
.art-stage > svg { display: block; width: 100%; height: auto; overflow: visible; }
.art-stage__label { display: flex; align-items: baseline; justify-content: center; gap: 12px; margin-top: 2px; font-size: 13px; }
.art-stage__label i { font: 25px 'Club Instrument Serif', Georgia, serif; color: var(--mag-accent); }
.art-connector { width: 100%; margin-top: -40px; fill: none; stroke: var(--mag-accent); stroke-width: 1.25; opacity: .6; }
.art-paper { fill: var(--mag-surface); }.art-edge { stroke: var(--mag-hairline-strong); stroke-width: 1.25; stroke-linejoin: round; }
.art-shadow { fill: var(--mag-text); opacity: .035; }.art-fold, .art-board { fill: var(--mag-surface-sunken); }
.art-muted { fill: var(--mag-text-tertiary); opacity: .45; }.art-ink { fill: var(--mag-text); }.art-blue { fill: var(--mag-accent); }.art-white { fill: var(--mag-on-accent); }
.art-quiet { fill: none; stroke: var(--mag-hairline-strong); stroke-width: 1.25; stroke-linecap: round; }
.art-sketch-frame { fill: none; stroke: var(--mag-hairline-strong); stroke-width: 1; stroke-dasharray: 3 4; }
.art-sketch { fill: none; stroke: var(--mag-accent); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }.art-sketch--light { stroke-width: 1; opacity: .4; }
.art-pencil { fill: var(--mag-accent); }.art-pencil-line { fill: none; stroke: var(--mag-on-accent); stroke-opacity: .45; stroke-width: 1; }
.art-blue-line { fill: none; stroke: var(--mag-accent); stroke-width: 1.6; stroke-linecap: round; }
.art-code { font: 17px var(--mag-font-mono); fill: var(--mag-accent); }.art-code-numbers { font: 11px var(--mag-font-mono); fill: var(--mag-text-tertiary); }
.art-cursor { fill: var(--mag-text); stroke: var(--mag-surface); stroke-width: 2; stroke-linejoin: round; }
.art-grid { fill: none; stroke: var(--mag-accent); stroke-width: .5; opacity: .12; }
.art-snake, .art-snake-shadow { fill: none; stroke: var(--mag-accent); stroke-width: 19; stroke-linecap: round; }.art-snake-shadow { opacity: .12; stroke-width: 22; }
.art-food { fill: #d87751; }.art-food-stem { fill: none; stroke: #a86246; stroke-width: 2; stroke-linecap: round; }
.course-art--compact { margin: 1rem 0 2rem; }
@media (max-width: 640px) {
  .course-art { grid-template-columns: 1fr; padding: 20px 0 30px; }
  .art-stage { width: min(100%, 290px); justify-self: center; }
  .art-connector { width: 36px; height: 36px; justify-self: center; margin: 12px 0 0; transform: rotate(90deg); }
  .art-stage__label { margin-top: -7px; }
}
</style>
