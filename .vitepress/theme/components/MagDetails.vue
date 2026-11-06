<script setup lang="ts">
defineProps<{ summary: string }>()
</script>

<template>
  <details class="mag-details">
    <summary>{{ summary }}</summary>
    <div class="mag-details__body"><slot /></div>
  </details>
</template>

<style scoped>
.mag-details { margin: var(--mag-space-md) 0; padding: var(--mag-space-sm) var(--mag-space-md); border: var(--mag-rule); border-radius: var(--mag-radius-sm); }
.mag-details summary { cursor: pointer; color: var(--mag-text); font-weight: 500; }
.mag-details summary:focus-visible { outline: 2px solid var(--mag-accent); outline-offset: 4px; }
.mag-details__body { padding-top: var(--mag-space-sm); color: var(--mag-text-secondary); }
.mag-details__body :deep(p:last-child) { margin-bottom: 0; }
</style>
