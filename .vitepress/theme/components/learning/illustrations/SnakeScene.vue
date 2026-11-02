<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{ position?: number; score?: number; label?: string; food?: boolean }>(), { position: 0, score: 0, label: '贪吃蛇示意画面', food: true })
const route = [...Array.from({ length: 9 }, (_, i) => [i, 0]), ...Array.from({ length: 4 }, (_, i) => [8, i + 1]), ...Array.from({ length: 8 }, (_, i) => [7 - i, 4]), ...Array.from({ length: 3 }, (_, i) => [0, 3 - i])]
const segments = computed(() => Array.from({ length: 4 }, (_, i) => route[((props.position - i) % route.length + route.length) % route.length]))
</script>
<template>
  <svg class="lab-snake" viewBox="0 0 320 220" role="img" :aria-label="`${label}，位置 ${position}，分数 ${score}`">
    <rect x="1" y="1" width="318" height="218" rx="10" fill="var(--lab-paper, var(--mag-surface))" stroke="var(--mag-hairline-strong)" />
    <path d="M1 32h318" stroke="var(--mag-hairline)" /><circle cx="14" cy="17" r="3" fill="var(--mag-text-tertiary)" /><circle cx="25" cy="17" r="3" fill="var(--mag-hairline-strong)" />
    <text v-if="food" x="306" y="21" text-anchor="end" font-size="12" fill="var(--mag-text-secondary)">{{ score }} 分</text>
    <rect x="22" y="48" width="276" height="148" rx="5" fill="var(--mag-surface-sunken)" />
    <path d="M48 64H272V176H48Z" stroke="var(--mag-hairline-strong)" stroke-dasharray="3 5" fill="none" />
    <rect v-for="(xy,i) in segments" :key="i" :x="38 + xy[0]*28" :y="54+xy[1]*28" width="20" height="20" rx="5" fill="var(--mag-accent)" :opacity="1-i*.18" />
    <circle :cx="50+segments[0][0]*28" :cy="62+segments[0][1]*28" r="2" fill="var(--mag-surface)" />
    <rect v-if="food" x="152" y="112" width="12" height="12" rx="3" fill="var(--mag-warn)" />
    <slot />
  </svg>
</template>
