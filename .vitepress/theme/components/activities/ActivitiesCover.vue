<script setup lang="ts">
const orbit = { x: 239, y: 216, radius: 68 }
const nodes = [-150, -30, 90].map((degrees, index) => ({
  x: orbit.x + orbit.radius * Math.cos(degrees * Math.PI / 180),
  y: orbit.y + orbit.radius * Math.sin(degrees * Math.PI / 180),
  radius: [13, 10, 16][index]
}))
</script>

<template>
  <svg class="overview-cover-art" viewBox="0 0 480 440" fill="none" aria-hidden="true">
    <!-- The flight stays behind the paper, clear of the central orbit. -->
    <path data-cover-line d="M76 336C26 277 39 183 94 145M348 351C426 339 459 268 439 214C430 192 415 181 395 173" class="cover-flight" />
    <g transform="rotate(-12 222 229)"><g data-cover-piece>
      <rect x="88" y="84" width="252" height="302" rx="4" class="cover-back" />
    </g></g>
    <g transform="rotate(6 242 210)"><g data-cover-piece>
      <rect x="113" y="48" width="252" height="316" rx="4" class="cover-paper" />
      <path d="M135 94H343" class="cover-rule" />
      <text x="135" y="79" class="cover-label">CLUB JOURNAL</text>
      <circle :cx="orbit.x" :cy="orbit.y" r="88" class="cover-orbit-guide" />
      <circle :cx="orbit.x" :cy="orbit.y" r="46" class="cover-orbit-guide cover-orbit-guide--inner" />
      <circle data-cover-line :cx="orbit.x" :cy="orbit.y" :r="orbit.radius" class="cover-orbit" />
      <g v-for="(node, index) in nodes" :key="index" data-cover-peg><circle :cx="node.x" :cy="node.y" :r="node.radius" :class="index === 1 ? 'cover-ink' : 'cover-blue'" /></g>
      <path d="M317 48V116L329 107L341 116V48" class="cover-blue" />
    </g></g>
    <g data-cover-piece>
      <path d="M374 104L443 130L406 147L394 176Z" class="cover-plane" />
      <path d="M374 104L406 147L394 176" class="cover-fold" />
    </g>
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
.cover-flight { stroke: var(--mag-accent); stroke-opacity: .5; stroke-width: 1.2; stroke-linecap: round; }
.cover-plane { fill: var(--mag-accent-soft); stroke: var(--mag-accent); stroke-width: 1.6; stroke-linejoin: round; }
.cover-fold { stroke: var(--mag-accent); stroke-width: 1.3; stroke-linejoin: round; }
</style>
