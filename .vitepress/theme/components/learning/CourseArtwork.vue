<script setup lang="ts">
withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })
</script>
<template>
  <figure class="course-art mag-no-reveal" :class="{ 'course-art--compact': compact }">
    <svg viewBox="0 0 800 420" role="img" aria-label="从想法到作品：一张需求便签、一份代码和可以试玩的贪吃蛇，用线连接成一次创作过程">
      <rect width="800" height="420" rx="16" class="art-bg" />
      <path d="M242 222 C288 222 264 124 314 124 M488 124 C553 124 483 243 546 243" fill="none" class="art-line" stroke-width="2" stroke-dasharray="5 6" />
      <path d="m307 118 8 6-8 6m230 113 9 6-9 6" fill="none" class="art-line" stroke-width="2" />
      <g transform="translate(55 112)">
        <rect width="192" height="210" rx="4" class="art-paper" stroke="currentColor" stroke-opacity=".18" />
        <text x="22" y="42" class="art-small">01 / 想法</text>
        <text x="22" y="84" class="art-title">我想做一个</text><text x="22" y="116" class="art-title">自己的小游戏。</text>
        <path d="M22 149h112m-112 16h144m-144 16h86" class="art-line" stroke-width="2" opacity=".3" />
      </g>
      <g transform="translate(307 68)">
        <rect width="197" height="250" rx="10" class="art-panel" stroke="currentColor" stroke-opacity=".18" />
        <path d="M0 34h197" stroke="currentColor" stroke-opacity=".15" />
        <circle cx="15" cy="17" r="3" fill="currentColor" opacity=".3" /><circle cx="27" cy="17" r="3" fill="currentColor" opacity=".2" /><circle cx="39" cy="17" r="3" fill="currentColor" opacity=".1" />
        <text x="19" y="67" class="art-small">02 / 动手</text>
        <text x="19" y="104" class="art-code">idea = {</text><text x="32" y="131" class="art-code">start,</text><text x="32" y="158" class="art-code">move,</text><text x="32" y="185" class="art-code">tryAgain</text><text x="19" y="212" class="art-code">}</text>
      </g>
      <g transform="translate(548 115)">
        <rect width="200" height="213" rx="10" class="art-panel" stroke="currentColor" stroke-opacity=".18" />
        <text x="18" y="31" class="art-small">03 / 作品</text>
        <rect x="18" y="48" width="164" height="120" rx="6" class="art-bg" />
        <path d="M48 128h42V86h44" fill="none" class="art-snake" stroke-width="16" stroke-linejoin="round" stroke-linecap="round" />
        <circle cx="135" cy="84" r="2" class="art-eye" /><rect x="148" y="128" width="10" height="10" rx="2" class="art-food" />
        <text x="18" y="194" class="art-small">做出来，再改好一点。</text>
      </g>
      <text x="400" y="385" text-anchor="middle" class="art-small" letter-spacing="3">想法 · 行动 · 观察 · 再试一次</text>
    </svg>
  </figure>
</template>
<style scoped>
.course-art { margin: 2rem 0; color: var(--mag-text); }
.course-art svg { display: block; width: 100%; height: auto; }
.art-bg { fill: var(--mag-surface-sunken); }.art-panel { fill: var(--mag-surface); }.art-paper { fill: var(--mag-accent-soft); }.art-line { stroke: var(--mag-accent); }.art-snake { stroke: var(--mag-accent); }.art-food { fill: var(--mag-warn); }.art-eye { fill: var(--mag-surface); }
.art-small { font: 12px var(--mag-font-display); fill: var(--mag-text-secondary); }.art-title { font: 20px var(--mag-font-display); fill: var(--mag-text); }.art-code { font: 19px var(--mag-font-mono); fill: var(--mag-accent); }
.course-art figcaption { text-align: center; color: var(--mag-text-secondary); font-size: 14px; margin-top: .7rem; }
.course-art--compact { margin: 1rem 0 2rem; }
@media (max-width: 600px) { .course-art figcaption { font-size: 14px; } }
</style>
