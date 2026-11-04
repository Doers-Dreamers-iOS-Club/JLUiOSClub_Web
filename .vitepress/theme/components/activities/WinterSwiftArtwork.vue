<script setup lang="ts">
import { ref } from 'vue'
import { useOverviewArtworkMotion } from './overviewMotion'
const figure = ref<HTMLElement | null>(null)
useOverviewArtworkMotion(figure)
const colors = ['var(--mag-accent)', '#d68b63', '#b9a5cc', '#8eaaa2']
const guesses = [[1, 0, 3, 2], [0, 1, 3, 2], [0, 1, 2, 3]]
</script>

<template>
  <figure ref="figure" class="swift-artwork" data-art-state="waiting">
    <svg viewBox="0 0 1000 500" fill="none" role="img" aria-labelledby="swift-art-title swift-art-desc">
      <title id="swift-art-title">从 SwiftUI 界面到 CodeBreaker</title>
      <desc id="swift-art-desc">中央的 CodeBreaker 游戏逐行填入彩色棋子，反馈钉从部分匹配变成全部匹配。背后的界面草图和右侧的状态模型展示游戏的组成。</desc>
      <ellipse cx="526" cy="456" rx="232" ry="14" class="swift-shadow" />
      <g class="swift-side" transform="rotate(-5 292 247)">
        <g data-art-reveal>
          <rect x="115" y="113" width="345" height="258" rx="10" class="swift-paper" />
          <path d="M115 146H460" class="swift-rule" />
          <circle cx="132" cy="129" r="3" class="swift-muted" /><circle cx="143" cy="129" r="3" class="swift-muted" /><circle cx="154" cy="129" r="3" class="swift-muted" />
          <text x="183" y="133" class="swift-small">SwiftUI</text>
          <path d="M146 175H235M146 187H204" class="swift-rule" />
          <rect x="144" y="208" width="227" height="58" rx="6" class="swift-soft" />
          <g v-for="i in 4" :key="i" data-art-pop><circle :cx="145 + i * 43" cy="237" r="13" stroke="var(--mag-accent)" stroke-width="1.3" stroke-dasharray="3 3" /></g>
          <path data-art-draw d="M143 283H258M143 296H214" class="swift-blue-line" />
          <text x="144" y="345" class="swift-serif">A view, composed.</text>
        </g>
      </g>
      <path data-art-draw d="M250 399C297 443 360 436 405 406M767 357C764 395 695 426 646 409" class="swift-connection" />
      <g data-art-reveal>
        <rect x="414" y="25" width="226" height="422" rx="33" class="swift-phone-shadow" />
        <rect x="407" y="19" width="226" height="422" rx="33" class="swift-phone" />
        <rect x="417" y="29" width="206" height="402" rx="26" class="swift-paper" />
        <rect x="486" y="38" width="68" height="14" rx="7" class="swift-ink" />
        <text x="436" y="88" class="swift-app-title">CodeBreaker</text>
        <path d="M436 103H604" class="swift-rule" />
        <g v-for="i in 4" :key="i"><circle :cx="430 + i * 34" cy="133" r="10" class="swift-slot" /><path :d="`M${427 + i * 34} 130l6 6m0 -6l-6 6`" class="swift-rule" /></g>
        <path d="M436 157H604" class="swift-rule" />
        <g v-for="(row, r) in guesses" :key="r" data-art-row>
          <rect x="433" :y="173 + r * 53" width="174" height="43" rx="9" :class="r === 2 ? 'swift-win-row' : 'swift-slot'" />
          <circle v-for="(color, c) in row" :key="c" :cx="450 + c * 32" :cy="194 + r * 53" r="10" :fill="colors[color]" />
          <g v-for="i in 4" :key="i"><circle :cx="581 + ((i - 1) % 2) * 10" :cy="189 + r * 53 + Math.floor((i - 1) / 2) * 10" r="3" :class="r === 2 || r === 1 && i <= 2 ? 'swift-ink' : 'swift-white-peg'" /></g>
        </g>
        <g data-art-finish><rect x="435" y="341" width="170" height="35" rx="17.5" class="swift-blue" /><path d="M490 358L495 363L504 353" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><text x="514" y="363" class="swift-success">Solved</text></g>
        <path d="M490 416H550" class="swift-home-indicator" />
      </g>
      <g class="swift-side">
        <g data-art-reveal>
          <text x="711" y="83" class="swift-serif">State</text>
          <g v-for="(color, i) in colors" :key="color" data-art-pop><circle :cx="712 + (i % 2) * 44" :cy="113 + Math.floor(i / 2) * 44" r="14" :fill="color" /></g>
        </g>
        <g transform="rotate(7 771 278)"><g data-art-reveal>
          <rect x="690" y="218" width="170" height="113" rx="8" class="swift-paper" />
          <text x="711" y="246" class="swift-small">MATCH</text><path d="M711 257H839" class="swift-rule" />
          <g data-art-finish><circle v-for="i in 4" :key="i" :cx="708 + i * 26" cy="283" r="7" class="swift-blue" /></g>
          <path data-art-draw d="M714 308H805" class="swift-blue-line" />
        </g></g>
        <path data-art-draw d="M675 285H651M661 279L651 285L661 291" class="swift-blue-line" />
      </g>
      <g data-art-finish><path d="M357 73V93M347 83H367M686 421V435M679 428H693" class="swift-blue-line" /><text x="170" y="431" class="swift-tiny swift-side">VIEW + STATE → PLAY</text></g>
    </svg>
  </figure>
</template>

<style scoped>
.swift-artwork { margin: 0; padding: 20px 0 12px; border-bottom: var(--mag-rule); overflow: hidden; }
svg { display: block; width: 100%; height: auto; }
.swift-paper { fill: var(--vp-c-bg); stroke: var(--mag-hairline-strong); stroke-width: 1.4; }
.swift-phone { fill: var(--mag-surface-sunken); stroke: var(--mag-text); stroke-width: 1.3; }
.swift-phone-shadow { fill: var(--mag-accent-soft); }
.swift-rule { stroke: var(--mag-hairline-strong); stroke-width: 1.3; stroke-linecap: round; }
.swift-blue-line { stroke: var(--mag-accent); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.swift-connection { stroke: var(--mag-accent); stroke-width: 1.2; stroke-opacity: .45; }
.swift-soft, .swift-win-row { fill: var(--mag-accent-soft); }
.swift-win-row { stroke: var(--mag-accent); stroke-width: .6; }
.swift-slot { fill: var(--mag-surface-sunken); }
.swift-white-peg { fill: var(--vp-c-bg); stroke: var(--mag-text-secondary); stroke-width: .8; }
.swift-ink { fill: var(--mag-text); }
.swift-muted { fill: var(--mag-text-tertiary); }
.swift-blue { fill: var(--mag-accent); }
.swift-shadow { fill: var(--mag-text); opacity: .025; }
.swift-small { font: 11px var(--mag-font-display); letter-spacing: .8px; fill: var(--mag-text-secondary); }
.swift-tiny { font: 9px var(--mag-font-display); letter-spacing: 1.2px; fill: var(--mag-text-tertiary); }
.swift-serif { font: 25px var(--overview-serif); fill: var(--mag-accent); }
.swift-app-title { font: 18px var(--mag-font-display); font-weight: 500; fill: var(--mag-text); }
.swift-success { font: 12px var(--mag-font-display); fill: white; }
.swift-home-indicator { stroke: var(--mag-text); stroke-width: 4; stroke-linecap: round; }
@media (max-width: 640px) { svg { width: 155%; max-width: none; margin-left: -29%; } }
</style>
