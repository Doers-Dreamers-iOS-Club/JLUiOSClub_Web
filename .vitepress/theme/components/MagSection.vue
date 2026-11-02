<script setup lang="ts">
defineProps<{ title?: string; icon?: string; n?: string | number }>()
</script>

<template>
  <div class="mag-section">
    <span v-if="n !== undefined" class="mag-section__num" aria-hidden="true">{{ String(n).padStart(2, '0') }}</span>
    <h2 class="mag-section__title"><span v-if="title">{{ title }}</span><slot /></h2>
  </div>
</template>

<style scoped>
.mag-section { display: flex; align-items: baseline; gap: 1rem; margin: 3rem 0 1.25rem; padding-top: 1.25rem; border-top: var(--mag-rule); }
.mag-section__title { margin: 0; padding: 0; border: 0; font-size: 18px; font-weight: 500; line-height: 1.5; }
.mag-section__num { color: var(--mag-text-secondary); font-size: 13px; font-variant-numeric: tabular-nums; }
</style>
