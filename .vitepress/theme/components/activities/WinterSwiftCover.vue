<script setup lang="ts">
const colors = ['var(--mag-accent)', '#d68b63', '#b9a5cc', '#8eaaa2']
</script>

<template>
  <svg class="overview-cover-art" viewBox="0 0 480 440" fill="none" aria-hidden="true">
    <g transform="rotate(8 243 231)"><g data-cover-piece>
      <rect x="123" y="103" width="248" height="280" rx="22" class="cover-shadow" />
    </g></g>
    <g transform="rotate(-5 238 220)"><g data-cover-piece>
      <rect x="109" y="79" width="248" height="280" rx="20" class="cover-board" />
      <path d="M132 127H334" class="cover-rule" /><text x="132" y="108" class="cover-label">SWIFTUI</text>
      <g v-for="row in 3" :key="row">
        <rect x="128" :y="141 + (row - 1) * 57" width="210" height="43" rx="10" class="cover-row" />
        <circle v-for="col in 4" :key="col" :cx="111 + col * 43" :cy="162 + (row - 1) * 57" r="12" class="cover-slot" />
      </g>
      <g v-for="(color, i) in colors" :key="color" data-cover-peg><circle :cx="154 + i * 43" cy="276" r="12" :fill="color" /></g>
    </g></g>
    <g data-cover-piece>
      <rect x="60" y="317" width="113" height="68" rx="12" class="cover-card" />
      <text x="75" y="338" class="cover-small">MATCH</text>
      <g v-for="i in 4" :key="i" data-cover-peg><circle :cx="60 + i * 23" cy="361" r="6" fill="var(--mag-accent)" /></g>
    </g>
    <g data-cover-piece><circle cx="361" cy="89" r="31" class="cover-badge" /><path data-cover-line d="M347 89L357 99L376 78" class="cover-check" /></g>
  </svg>
</template>

<style scoped>
.cover-board { fill: var(--vp-c-bg); stroke: var(--mag-text-secondary); stroke-width: 1.3; }
.cover-shadow { fill: var(--mag-accent-soft); }
.cover-card { fill: var(--vp-c-bg); stroke: var(--mag-hairline-strong); stroke-width: 1.3; }
.cover-row { fill: var(--mag-surface-sunken); }
.cover-slot { fill: var(--mag-hairline); }
.cover-rule { stroke: var(--mag-hairline-strong); stroke-width: 1.2; }
.cover-label { font: 12px var(--mag-font-display); letter-spacing: 2px; fill: var(--mag-text); }
.cover-small { font: 8px var(--mag-font-display); letter-spacing: 1px; fill: var(--mag-text-secondary); }
.cover-badge { fill: var(--mag-accent); }
.cover-check { stroke: white; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
</style>
