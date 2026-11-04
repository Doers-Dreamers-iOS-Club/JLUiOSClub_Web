<template>
  <g class="paper-plane">
    <!-- The keel runs from the lower tail (24,56) to the nose (77,0).
         Opaque wing faces below occlude its hidden portion. -->
    <path d="M32 41L24 56L77 0Z" class="plane-paper" />
    <path d="M32 41L24 56L77 0Z" class="plane-keel" />
    <path d="M0 24L77 0L32 41Z" class="plane-paper" />
    <path d="M0 24L77 0L32 41Z" class="plane-upper" />
    <path d="M32 41L77 0L46 72Z" class="plane-paper" />
    <path d="M32 41L77 0L46 72Z" class="plane-lower" />
    <path d="M0 24L77 0L46 72L32 41ZM32 41L77 0" class="plane-fold" />
    <path d="M12 24L62 9" class="plane-detail" />
  </g>
</template>

<style scoped>
.plane-paper { fill: var(--vp-c-bg); }
.plane-keel { fill: var(--mag-accent); fill-opacity: .32; stroke: var(--mag-accent); stroke-width: 1; stroke-linejoin: round; }
.plane-upper { fill: var(--mag-accent); fill-opacity: .06; }
.plane-lower { fill: var(--mag-accent); fill-opacity: .18; }
.plane-fold { fill: none; stroke: var(--mag-accent); stroke-width: 1.3; stroke-linejoin: round; }
.plane-detail { fill: none; stroke: var(--mag-accent); stroke-opacity: .4; stroke-width: .65; stroke-linecap: round; }
</style>
