<script setup lang="ts">
defineProps<{ kind: 'model' | 'python' | 'panorama' | 'workshop' | 'agent' }>()
</script>
<template>
  <svg class="course-spot" viewBox="0 0 360 164" aria-hidden="true">
    <g v-if="kind === 'model'">
      <path d="M111 83h128" class="spot-wire" /><path d="M217 78l6 5-6 5" class="spot-accent-line" />
      <rect x="53" y="43" width="62" height="80" rx="5" class="spot-paper" />
      <path d="M65 59h38m-38 13h25m-25 13h38m-38 13h20" class="spot-line" />
      <rect x="157" y="72" width="24" height="22" rx="3" class="spot-tint" />
      <path d="M164 83h10" class="spot-accent-line" />
      <circle cx="269" cy="83" r="37" class="spot-tint" />
      <path d="M269 58v50m-25-25h50m-43-18 36 36m-36 0 36-36" class="spot-accent-line" />
      <circle cx="269" cy="83" r="12" class="spot-solid" />
    </g>
    <g v-else-if="kind === 'python'">
      <rect x="68" y="26" width="224" height="113" rx="5" class="spot-paper" /><path d="M68 51H292" class="spot-line" />
      <circle v-for="n in 3" :key="n" :cx="73+n*11" cy="39" r="2" class="spot-dot" />
      <path d="M95 71l8 7-8 7m18-7h21m-21 19h80m-80 12h47" class="spot-accent-line" />
      <path d="M240 65h-6v15q0 7-7 7 7 0 7 7v15h6m20-44h6v15q0 7 7 7-7 0-7 7v15h-6" class="spot-line" />
      <path d="M174 101v12" class="spot-accent-line" />
    </g>
    <g v-else-if="kind === 'panorama'">
      <ellipse cx="180" cy="83" rx="98" ry="42" class="spot-wire" transform="rotate(-24 180 83)" />
      <ellipse cx="180" cy="83" rx="98" ry="42" class="spot-wire" transform="rotate(24 180 83)" />
      <circle cx="180" cy="83" r="30" class="spot-tint" /><circle cx="180" cy="83" r="12" class="spot-solid" />
      <circle cx="92" cy="58" r="7" class="spot-paper" /><circle cx="268" cy="108" r="7" class="spot-solid" /><circle cx="244" cy="33" r="5" class="spot-paper" />
    </g>
    <g v-else-if="kind === 'workshop'">
      <g transform="rotate(-7 141 80)"><rect x="86" y="34" width="119" height="93" rx="3" class="spot-paper" /><path d="M98 49h41m-41 12h25" class="spot-line" /><rect x="98" y="76" width="36" height="36" rx="2" class="spot-tint" /><path d="M145 81h45m-45 14h30m-30 14h39" class="spot-line" /></g>
      <g transform="rotate(7 236 85)"><rect x="205" y="24" width="62" height="117" rx="9" class="spot-paper" /><path d="M226 32h20" class="spot-line" /><rect x="214" y="47" width="44" height="42" rx="3" class="spot-tint" /><circle cx="236" cy="68" r="10" class="spot-solid" /><path d="M215 102h40m-40 10h25m-1 19h16" class="spot-line" /></g>
    </g>
    <g v-else>
      <path d="M134 75h83m-8-5 6 5-6 5" class="spot-wire" />
      <path d="M68 42h71a5 5 0 0 1 5 5v49a5 5 0 0 1-5 5h-42l-14 12v-12H68a5 5 0 0 1-5-5V47a5 5 0 0 1 5-5Z" class="spot-paper" />
      <circle v-for="n in 3" :key="n" :cx="73+n*15" cy="72" r="3" class="spot-solid" />
      <rect x="219" y="38" width="75" height="88" rx="5" class="spot-paper" />
      <path d="M235 59l3 3 6-7m-9 25 3 3 6-7m-9 25 3 3 6-7" class="spot-accent-line" /><path d="M253 59h25m-25 21h25m-25 21h18" class="spot-line" />
    </g>
  </svg>
</template>
<style scoped>
.course-spot { display: block; width: 100%; height: auto; }
.spot-paper { fill: var(--mag-surface); stroke: var(--mag-hairline-strong); stroke-width: 1.4; }
.spot-line { fill: none; stroke: var(--mag-hairline-strong); stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
.spot-wire { fill: none; stroke: var(--mag-accent); stroke-width: 1; opacity: .45; }
.spot-accent-line { fill: none; stroke: var(--mag-accent); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.spot-tint { fill: var(--mag-accent-soft); }.spot-solid { fill: var(--mag-accent); }.spot-dot { fill: var(--mag-text-tertiary); }
</style>
