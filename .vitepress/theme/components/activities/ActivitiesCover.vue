<template>
  <svg class="overview-cover-art" viewBox="0 0 480 440" fill="none" aria-hidden="true">
    <g transform="rotate(-12 222 229)"><g data-cover-piece>
      <rect x="88" y="84" width="252" height="302" rx="4" class="cover-back" />
      <path d="M108 105H213M108 118H165" class="cover-rule" />
    </g></g>
    <g transform="rotate(6 242 210)"><g data-cover-piece>
      <rect x="113" y="48" width="252" height="316" rx="4" class="cover-paper" />
      <path d="M135 94H343M135 318H343" class="cover-rule" />
      <text x="135" y="79" class="cover-label">CLUB JOURNAL</text><text x="324" y="79" class="cover-label">01</text>
      <circle cx="239" cy="206" r="76" class="cover-orbit" />
      <circle cx="239" cy="206" r="48" class="cover-orbit" />
      <path data-cover-line d="M162 206H316M239 129V283" class="cover-cross" />
      <g data-cover-peg><circle cx="189" cy="160" r="13" class="cover-blue" /></g>
      <g data-cover-peg><circle cx="286" cy="165" r="10" class="cover-ink" /></g>
      <g data-cover-peg><circle cx="239" cy="260" r="16" class="cover-blue" /></g>
      <path data-cover-line d="M189 160Q248 130 286 165Q293 233 239 260Q186 242 189 160Z" class="cover-link" />
      <path d="M135 338H181M286 338H343" class="cover-rule" />
      <path d="M317 48V116L329 107L341 116V48" class="cover-blue" />
    </g></g>
    <path data-cover-line d="M59 312C33 259 62 192 116 187M329 318C407 303 437 219 401 156" class="cover-flight" />
    <g data-cover-piece><path d="M344 90L436 139L395 150L376 184Z" class="cover-plane" /><path d="M344 90L395 150L376 184M395 150L399 172L384 161" class="cover-fold" /></g>
    <g data-cover-piece><path d="M74 74V94M64 84H84M388 346V364M379 355H397" class="cover-fold" /><circle cx="86" cy="359" r="4" class="cover-blue" /></g>
  </svg>
</template>

<style scoped>
.cover-paper { fill: var(--vp-c-bg); stroke: var(--mag-hairline-strong); stroke-width: 1.4; }
.cover-back { fill: var(--mag-surface-sunken); stroke: var(--mag-hairline-strong); stroke-width: 1; }
.cover-rule { stroke: var(--mag-hairline-strong); stroke-width: 1.2; }
.cover-label { font: 10px var(--mag-font-display); letter-spacing: 1.2px; fill: var(--mag-text-secondary); }
.cover-orbit { stroke: var(--mag-accent); stroke-opacity: .22; stroke-width: 1; }
.cover-cross { stroke: var(--mag-accent); stroke-opacity: .18; stroke-width: 1; }
.cover-blue { fill: var(--mag-accent); }
.cover-ink { fill: var(--mag-text); }
.cover-link { stroke: var(--mag-accent); stroke-width: 1.6; }
.cover-flight { stroke: var(--mag-accent); stroke-opacity: .5; stroke-width: 1.2; }
.cover-plane { fill: var(--mag-accent-soft); stroke: var(--mag-accent); stroke-width: 1.6; stroke-linejoin: round; }
.cover-fold { stroke: var(--mag-accent); stroke-width: 1.6; stroke-linejoin: round; stroke-linecap: round; }
</style>
