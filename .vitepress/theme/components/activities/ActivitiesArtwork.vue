<script setup lang="ts">
import { ref, useId } from 'vue'
import PaperPlane from './PaperPlane.vue'
import { useOverviewArtworkMotion } from './overviewMotion'
const id = useId()
const figure = ref<HTMLElement | null>(null)
useOverviewArtworkMotion(figure)
</script>

<template>
  <figure ref="figure" class="activities-artwork" data-art-state="waiting">
    <svg viewBox="0 0 1000 460" fill="none" role="img" :aria-labelledby="`${id}-title ${id}-desc`">
      <title :id="`${id}-title`">社团的活动编辑台</title>
      <desc :id="`${id}-desc`">一本展开的活动手册，左页是相聚分享，右页是代码与作品，周围散落着设备体验、活动日期和灵感便笺。</desc>
      <ellipse cx="504" cy="387" rx="324" ry="18" class="art-shadow" />
      <circle cx="516" cy="222" r="184" class="art-orbit" />
      <path data-art-draw d="M132 282C136 391 276 421 391 392M700 72C816 45 926 139 881 235" class="art-trail" />
      <g data-art-reveal>
        <path d="M241 95Q366 56 500 100Q626 56 757 95V368Q626 334 500 376Q366 334 241 368Z" class="art-paper" />
        <path d="M253 108Q374 74 500 113Q625 74 745 108V355Q624 323 500 363Q376 323 253 355Z" class="art-page" />
        <path d="M500 100V376M253 355L245 363M745 355L752 363" class="art-rule" />
        <text x="280" y="134" class="art-small">JLU iOS CLUB</text><text x="707" y="134" class="art-small">01</text>
        <path d="M280 148H464M536 148H718" class="art-rule" />
        <g transform="translate(0 -18)">
        <g data-art-reveal>
          <rect x="292" y="177" width="156" height="88" rx="4" class="art-board" />
          <path d="M370 266V286M346 287H394" class="art-rule" />
          <path data-art-draw d="M315 237L339 218L359 229L383 200L422 186" class="art-blue-line" />
          <circle cx="339" cy="218" r="4" class="art-blue" /><circle cx="383" cy="200" r="4" class="art-blue" />
        </g>
        <g data-art-pop><circle cx="312" cy="297" r="11" class="art-ink" /><path d="M293 331V322C293 306 331 306 331 322V331" class="art-board" /></g>
        <g data-art-pop><circle cx="370" cy="303" r="11" class="art-blue" /><path d="M351 337V328C351 312 389 312 389 328V337" class="art-blue-soft" /></g>
        <g data-art-pop><circle cx="428" cy="297" r="11" class="art-ink" /><path d="M409 331V322C409 306 447 306 447 322V331" class="art-board" /></g>
        <g data-art-reveal>
          <rect x="539" y="172" width="179" height="119" rx="6" class="art-board" />
          <path d="M539 191H718" class="art-rule" /><circle cx="551" cy="182" r="2" class="art-muted" /><circle cx="560" cy="182" r="2" class="art-muted" /><circle cx="569" cy="182" r="2" class="art-muted" />
          <path data-art-draw d="M578 212L565 226L578 240M607 211L594 241M622 212L635 226L622 240" class="art-blue-line" />
          <path d="M563 259H606M563 269H645" class="art-rule" />
          <rect x="660" y="210" width="38" height="61" rx="7" class="art-paper" /><rect x="667" y="220" width="24" height="25" rx="4" class="art-blue-soft" />
          <path data-art-draw d="M673 233L678 238L686 228" class="art-blue-line" />
        </g>
        <path data-art-draw d="M541 312H661M541 324H626" class="art-writing" />
        <text x="540" y="350" class="art-serif">Made together.</text>
        </g>
      </g>
      <g class="art-peripheral" transform="translate(82 87) rotate(-10 65 72)">
        <g data-art-reveal>
          <rect width="130" height="144" rx="6" class="art-paper" /><path d="M0 34H130" class="art-rule" />
          <path d="M28 -7V10M101 -7V10" class="art-blue-line" />
          <text x="18" y="23" class="art-small">CLUB DAY</text>
          <text x="22" y="101" class="art-date">24</text>
          <path d="M21 121H62M74 121H108" class="art-rule" />
          <circle data-art-pop cx="100" cy="82" r="16" class="art-blue-soft" /><path data-art-draw d="M92 82L98 88L108 75" class="art-blue-line" />
        </g>
      </g>
      <g class="art-peripheral" transform="translate(792 235) rotate(9 70 54)">
        <g data-art-reveal><path d="M6 15Q70 -5 134 15V100H6Z" class="art-paper" /><path d="M18 22Q70 5 122 22" class="art-rule" />
          <path d="M28 40C28 28 112 28 112 40L108 62C104 76 88 72 79 62C74 56 66 56 61 62C52 72 36 76 32 62Z" class="art-board" />
          <path d="M43 41C54 37 86 37 97 41" class="art-blue-line" /><text x="30" y="89" class="art-small">TRY SOMETHING.</text>
        </g>
      </g>
      <g data-art-reveal class="art-peripheral">
        <g transform="translate(800 82)"><PaperPlane /></g>
        <path d="M182 310L218 271L225 278L189 317L178 322Z" class="art-blue" /><path d="M178 322L182 310L189 317Z" class="art-ink" />
      </g>
      <g data-art-finish><path d="M784 184V204M774 194H794M205 52V64M199 58H211" class="art-blue-line" /><circle cx="735" cy="399" r="4" class="art-blue" /></g>
    </svg>
  </figure>
</template>

<style scoped>
.activities-artwork { margin: 0; overflow: hidden; padding: 15px 0 12px; border-bottom: var(--mag-rule); }
svg { display: block; width: 100%; height: auto; }
.art-paper { fill: var(--vp-c-bg); stroke: var(--mag-hairline-strong); stroke-width: 1.5; }
.art-page { fill: var(--vp-c-bg); }
.art-board { fill: var(--mag-surface-sunken); stroke: var(--mag-hairline-strong); stroke-width: 1.3; }
.art-rule { stroke: var(--mag-hairline-strong); stroke-width: 1.4; stroke-linecap: round; }
.art-blue-line { stroke: var(--mag-accent); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.art-blue { fill: var(--mag-accent); }
.art-blue-soft { fill: var(--mag-accent-soft); stroke: var(--mag-accent); stroke-width: 1.2; }
.art-muted { fill: var(--mag-text-tertiary); }
.art-ink { fill: var(--mag-text); }
.art-small { font-family: var(--mag-font-display); font-size: 9px; letter-spacing: .7px; fill: var(--mag-text-secondary); }
.art-serif { font-family: 'Club Instrument Serif', Georgia, serif; font-size: 23px; fill: var(--mag-accent); }
.art-date { font-family: 'Club Instrument Serif', Georgia, serif; font-size: 64px; fill: var(--mag-accent); }
.art-writing { stroke: var(--mag-text-tertiary); stroke-width: 2; stroke-linecap: round; }
.art-orbit { stroke: var(--mag-accent); stroke-opacity: .08; stroke-width: 1; }
.art-trail { stroke: var(--mag-accent); stroke-opacity: .35; stroke-width: 1; }
.art-shadow { fill: var(--mag-text); opacity: .025; }
@media (max-width: 640px) { svg { width: 155%; max-width: none; margin-left: -27.5%; } .art-peripheral { opacity: .6; } }
</style>
