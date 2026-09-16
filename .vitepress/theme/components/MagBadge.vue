<script setup lang="ts">
/** MagBadge —— 行内胶囊标签（取代 .badge-pill / .tag / .badge-row 的子项） */
withDefaults(
  defineProps<{
    type?: 'default' | 'accent' | 'warn'
    text?: string
  }>(),
  { type: 'default' }
)
</script>

<template>
  <span class="mag-badge" :class="`mag-badge--${type}`">
    <template v-if="text">{{ text }}</template>
    <slot />
  </span>
</template>

<style scoped>
.mag-badge {
  display: inline-block;
  margin: 0 0.25rem 0.35rem 0;
  padding: 0.32rem 0.7rem;
  border: 1px solid var(--mag-hairline);
  border-radius: var(--mag-radius-pill);
  background: var(--mag-surface);
  color: var(--mag-text-secondary);
  font-size: var(--mag-fs-small);
  line-height: 1.4;
  white-space: nowrap;
}

.mag-badge--accent {
  border-color: var(--mag-accent-border);
  background: var(--mag-accent-soft);
  color: var(--mag-accent);
}

.mag-badge--warn {
  border-color: var(--mag-warn-border);
  background: var(--mag-warn-soft);
  color: var(--mag-warn);
}
</style>
