<template>
  <svg class="overview-cover-art" viewBox="0 0 480 440" fill="none" aria-hidden="true">
    <g transform="rotate(-12 222 229)"><g data-cover-piece>
      <rect x="88" y="84" width="252" height="302" rx="4" class="cover-back" />
    </g></g>
    <g transform="rotate(6 242 210)"><g data-cover-piece>
      <rect x="113" y="48" width="252" height="316" rx="4" class="cover-paper" />
      <path d="M135 94H343" class="cover-rule" />
      <text x="135" y="79" class="cover-label">CLUB JOURNAL</text>
      <path data-cover-line d="M189 160Q248 130 286 165Q293 233 239 260Q186 242 189 160Z" class="cover-link" />
      <g data-cover-peg><circle cx="189" cy="160" r="13" class="cover-blue" /></g>
      <g data-cover-peg><circle cx="286" cy="165" r="10" class="cover-ink" /></g>
      <g data-cover-peg><circle cx="239" cy="260" r="16" class="cover-blue" /></g>
      <path d="M317 48V116L329 107L341 116V48" class="cover-blue" />
    </g></g>
  </svg>
</template>

<style scoped>
.cover-paper { fill: var(--vp-c-bg); stroke: var(--mag-hairline-strong); stroke-width: 1.4; }
.cover-back { fill: var(--mag-surface-sunken); stroke: var(--mag-hairline-strong); stroke-width: 1; }
.cover-rule { stroke: var(--mag-hairline-strong); stroke-width: 1.2; }
.cover-label { font: 10px var(--mag-font-display); letter-spacing: 1.2px; fill: var(--mag-text-secondary); }
.cover-blue { fill: var(--mag-accent); }
.cover-ink { fill: var(--mag-text); }
.cover-link { stroke: var(--mag-accent); stroke-width: 1.6; }
</style>
