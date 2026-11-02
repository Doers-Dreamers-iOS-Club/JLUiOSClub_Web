<script setup lang="ts">
/**
 * MagNote —— 提示 / 强调块
 * 取代 .highlight-box 与 .tip-box。
 */
withDefaults(
  defineProps<{
    type?: 'highlight' | 'tip' | 'warn'
    title?: string
    icon?: string
  }>(),
  { type: 'highlight' }
)
</script>

<template>
  <div class="mag-note" :class="`mag-note--${type}`">
    <p v-if="title" class="mag-note__title">
      <span v-if="icon" class="mag-note__icon">{{ icon }}</span>{{ title }}
    </p>
    <div class="mag-note__body"><slot /></div>
  </div>
</template>

<style scoped>
.mag-note {
  margin: var(--mag-space-lg) 0;
  padding: var(--mag-space-md);
  border: 1px solid var(--mag-hairline);
  border-radius: var(--mag-radius-sm);
  background: var(--mag-surface);
  color: var(--mag-text-secondary);
  line-height: var(--mag-leading-body);
}

.mag-note--highlight {
  border-left: 3px solid var(--mag-hairline-strong);
  background: var(--mag-surface-sunken);
}

.mag-note--tip {
  border-left: 3px solid var(--mag-accent);
  background: var(--mag-accent-soft);
}

.mag-note--warn {
  border-left: 3px solid var(--mag-warn);
  background: var(--mag-warn-soft);
}

.mag-note__title {
  margin: 0 0 var(--mag-space-xs);
  color: var(--mag-text);
  font-size: var(--mag-fs-body);
  font-weight: 500;
  letter-spacing: var(--mag-tracking-title);
}

.mag-note__icon {
  margin-right: 0.4rem;
}

.mag-note__body :deep(p) {
  margin: 0 0 0.5rem;
}

.mag-note__body :deep(p:last-child) {
  margin-bottom: 0;
}

.mag-note__body :deep(ul) {
  margin: 0.4rem 0 0;
  padding-left: 1.2rem;
}

.mag-note__body :deep(a) {
  color: var(--mag-accent);
  word-break: break-all;
}

.mag-note__body :deep(strong) {
  color: var(--mag-text);
  font-weight: 500;
}
</style>
