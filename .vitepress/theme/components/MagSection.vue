<script setup lang="ts">
/** MagSection —— 杂志栏目标题（取代 .section-header） */
defineProps<{
  title?: string
  icon?: string
  /** 栏目编号，如 1 或 '01'，渲染为「01 /」前缀 */
  n?: string | number
}>()
</script>

<template>
  <div class="mag-section">
    <h2 class="mag-section__title">
      <span v-if="n !== undefined" class="mag-section__num"
        >{{ String(n).padStart(2, '0') }}<i aria-hidden="true">/</i></span
      >
      <span v-if="icon" class="mag-section__icon">{{ icon }}</span>
      <span v-if="title">{{ title }}</span>
      <slot />
    </h2>
  </div>
</template>

<style scoped>
/* 杂志栏目：accent 短粗线 + 通栏细线的组合 */
.mag-section {
  position: relative;
  margin: var(--mag-space-2xl) 0 var(--mag-space-lg);
  padding-bottom: var(--mag-space-sm);
  border-bottom: var(--mag-rule-strong);
}

.mag-section::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 3.2rem;
  height: 3px;
  background: var(--mag-accent);
}

.mag-section__title {
  display: flex;
  align-items: baseline;
  gap: var(--mag-space-sm);
  margin: 0;
  border: 0;
  padding: 0;
  color: var(--mag-text);
  font-family: var(--mag-font-serif);
  font-size: var(--mag-fs-h2);
  font-weight: 700;
  letter-spacing: var(--mag-tracking-serif);
}

.mag-section__num {
  color: var(--mag-accent);
  font-family: var(--mag-font-mono);
  font-size: 0.62em;
  font-weight: 500;
  letter-spacing: var(--mag-tracking-num);
}

.mag-section__num i {
  margin-left: 0.15em;
  font-style: normal;
  opacity: 0.45;
}

.mag-section__icon {
  font-size: 1.1em;
  line-height: 1;
}
</style>
