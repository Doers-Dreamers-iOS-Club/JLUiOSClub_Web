<script setup lang="ts">
import PaperPlane from './PaperPlane.vue'
const orbit = { x: 239, y: 216, radius: 68 }
const nodes = [-150, -30, 90].map((degrees, index) => ({
  x: orbit.x + orbit.radius * Math.cos(degrees * Math.PI / 180),
  y: orbit.y + orbit.radius * Math.sin(degrees * Math.PI / 180),
  radius: [13, 10, 16][index]
}))
</script>

<template>
  <svg class="overview-cover-art" viewBox="0 0 480 440" fill="none" aria-hidden="true">
    <path data-cover-line d="M65 353V389H101M396 47H432V83" class="cover-focus" />
    <g transform="rotate(-12 222 229)"><g data-cover-piece>
      <rect x="88" y="84" width="252" height="302" rx="4" class="cover-back" />
    </g></g>
    <g transform="rotate(6 242 210)"><g data-cover-piece>
      <rect x="113" y="48" width="252" height="316" rx="4" class="cover-paper" />
      <path d="M135 94H343" class="cover-rule" />
      <text x="135" y="79" class="cover-label">CLUB JOURNAL</text>
      <path d="M239 116V121M334 216H339M239 311V316M139 216H144" class="cover-ticks" />
      <circle :cx="orbit.x" :cy="orbit.y" r="88" class="cover-orbit-guide" />
      <circle :cx="orbit.x" :cy="orbit.y" r="46" class="cover-orbit-guide cover-orbit-guide--inner" />
      <circle data-cover-line :cx="orbit.x" :cy="orbit.y" :r="orbit.radius" class="cover-orbit" />
      <g v-for="(node, index) in nodes" :key="index" data-cover-peg><circle :cx="node.x" :cy="node.y" :r="node.radius" :class="index === 1 ? 'cover-ink' : 'cover-blue'" /></g>
      <g class="cover-imprint">
        <path d="M135 332H343" class="cover-rule" />
        <text x="135" y="349" class="cover-caption">FIELD NOTES</text>
        <path d="M263 342V350M267 342V350M273 342V350M277 342V350M284 342V350" class="cover-ticks" />
        <text x="343" y="349" text-anchor="end" class="cover-caption">01</text>
      </g>
      <path d="M317 48V116L329 107L341 116V48" class="cover-blue" />
    </g></g>
    <g data-cover-piece><g transform="translate(370 102)"><PaperPlane /></g></g>
  </svg>
</template>

<style scoped>
.cover-paper { fill: var(--vp-c-bg); stroke: var(--mag-hairline-strong); stroke-width: 1.4; }
.cover-back { fill: var(--mag-surface-sunken); stroke: var(--mag-hairline-strong); stroke-width: 1; }
.cover-rule { stroke: var(--mag-hairline-strong); stroke-width: 1.2; }
.cover-label { font: 10px var(--mag-font-display); letter-spacing: 1.2px; fill: var(--mag-text-secondary); }
.cover-blue { fill: var(--mag-accent); }
.cover-ink { fill: var(--mag-text); }
.cover-orbit { stroke: var(--mag-accent); stroke-width: 1.6; }
.cover-orbit-guide { stroke: var(--mag-accent); stroke-opacity: .24; stroke-width: 1; }
.cover-orbit-guide--inner { stroke-opacity: .14; }
.cover-focus { stroke: var(--mag-accent); stroke-opacity: .7; stroke-width: 1.4; stroke-linecap: square; stroke-linejoin: round; }
.cover-ticks { stroke: var(--mag-accent); stroke-opacity: .4; stroke-width: .8; }
.cover-caption { font: 7px var(--mag-font-display); letter-spacing: 1.1px; fill: var(--mag-text-tertiary); }
</style>
