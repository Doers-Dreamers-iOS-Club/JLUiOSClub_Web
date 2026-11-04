<script setup lang="ts">
defineProps<{ kind: 'video' | 'code' | 'mirror' | 'ai' }>()
</script>

<template>
  <svg viewBox="0 0 320 180" fill="none" aria-hidden="true">
    <template v-if="kind === 'video'">
      <rect x="51" y="26" width="218" height="127" rx="8" class="resource-paper" /><path d="M51 49H269M69 132H251" class="resource-rule" /><circle cx="66" cy="38" r="2" class="resource-muted" /><circle cx="74" cy="38" r="2" class="resource-muted" />
      <circle cx="160" cy="87" r="27" class="resource-soft" /><path d="M154 73L174 87L154 101Z" fill="currentColor" /><path d="M69 132H155" stroke="currentColor" stroke-width="2" /><circle cx="155" cy="132" r="4" fill="currentColor" />
    </template>
    <template v-else-if="kind === 'code'">
      <path d="M108 40V135M108 99C108 72 208 98 208 62V40" stroke="currentColor" stroke-width="2" />
      <circle cx="108" cy="40" r="12" class="resource-paper" /><circle cx="108" cy="135" r="12" class="resource-soft" /><circle cx="208" cy="40" r="12" class="resource-soft" />
      <path d="M143 123L133 133L143 143M169 123L179 133L169 143M162 119L151 147" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" /><path d="M228 66H250M228 76H243" class="resource-rule" />
    </template>
    <template v-else-if="kind === 'mirror'">
      <rect x="61" y="48" width="80" height="87" rx="6" class="resource-paper" /><rect x="179" y="48" width="80" height="87" rx="6" class="resource-paper" />
      <path d="M75 67H127M75 82H117M75 97H127M193 67H245M193 82H235M193 97H245" class="resource-rule" />
      <path d="M130 29C159 9 189 19 204 35M196 25L204 35L191 36M191 154C162 174 132 164 117 148M125 158L117 148L130 147" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </template>
    <template v-else>
      <path d="M160 89L73 47M160 89L249 46M160 89L249 137M160 89L73 139" class="resource-rule" />
      <rect x="126" y="54" width="68" height="68" rx="16" class="resource-soft" /><text x="140" y="101" font-size="38" font-family="var(--overview-serif)" fill="currentColor">AI</text>
      <rect x="50" y="28" width="43" height="36" rx="7" class="resource-paper" /><path d="M60 41H82M60 50H74" stroke="currentColor" stroke-width="1.4" />
      <rect x="227" y="28" width="43" height="36" rx="7" class="resource-paper" /><path d="M236 47L242 53L259 38" stroke="currentColor" stroke-width="1.4" />
      <rect x="50" y="120" width="43" height="36" rx="7" class="resource-paper" /><path d="M61 131L69 138L61 145M74 145H83" stroke="currentColor" stroke-width="1.4" />
      <rect x="227" y="120" width="43" height="36" rx="7" class="resource-paper" /><circle cx="248" cy="138" r="9" stroke="currentColor" stroke-width="1.4" />
    </template>
  </svg>
</template>

<style scoped>
.resource-paper { fill: var(--vp-c-bg); stroke: var(--mag-hairline-strong); stroke-width: 1.4; }
.resource-rule { stroke: var(--mag-hairline-strong); stroke-width: 1.3; stroke-linecap: round; }
.resource-soft { fill: var(--mag-accent-soft); stroke: currentColor; stroke-width: 1.1; }
.resource-muted { fill: var(--mag-text-tertiary); }
</style>
