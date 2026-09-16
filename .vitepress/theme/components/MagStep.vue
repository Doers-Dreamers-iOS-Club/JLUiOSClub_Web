<script setup lang="ts">
/**
 * MagStep —— 编号步骤
 * 取代 .step-container + .step-header + .step-number 三件套。
 */
import { computed, useSlots } from 'vue'

const props = defineProps<{
  /** 步骤序号 */
  n?: number | string
  title?: string
}>()

const slots = useSlots()

/** 无编号也无标题时退化为普通内容块（原 .step-container 的另一种用法） */
const hasHeader = computed(() => props.n !== undefined || !!props.title || !!slots.header)
</script>

<template>
  <div class="mag-step">
    <div v-if="hasHeader" class="mag-step__header">
      <span v-if="n !== undefined" class="mag-step__number">{{ n }}</span>
      <h4 v-if="title" class="mag-step__title">{{ title }}</h4>
      <slot name="header" />
    </div>
    <div
      v-if="$slots.default"
      class="mag-step__body"
      :class="{ 'mag-step__body--indent': hasHeader }"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.mag-step {
  margin: var(--mag-space-md) 0;
  padding: var(--mag-space-md);
  border: 1px solid var(--mag-hairline);
  border-left: 3px solid var(--mag-accent);
  border-radius: var(--mag-radius-sm);
  background: var(--mag-surface);
  transition: box-shadow var(--mag-duration-fast) var(--mag-ease);
}

.mag-step:hover {
  box-shadow: var(--mag-shadow-sm);
}

.mag-step__header {
  display: flex;
  align-items: center;
  gap: var(--mag-space-sm);
}

.mag-step__number {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: var(--mag-radius-pill);
  background: var(--mag-accent);
  color: #fff;
  font-size: var(--mag-fs-small);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.mag-step__title {
  margin: 0;
  border: 0;
  padding: 0;
  color: var(--mag-text);
  font-size: var(--mag-fs-h4);
  font-weight: 650;
  letter-spacing: var(--mag-tracking-title);
}

.mag-step__body {
  color: var(--mag-text-secondary);
  line-height: var(--mag-leading-body);
}

/* 有编号时正文缩进对齐到标题；无编号时占满，等同一个普通内容块 */
.mag-step__body--indent {
  margin-top: var(--mag-space-xs);
  padding-left: calc(1.75rem + var(--mag-space-sm));
}

.mag-step__body :deep(p) {
  margin: 0 0 0.5rem;
}

.mag-step__body :deep(p:last-child) {
  margin-bottom: 0;
}

.mag-step__body :deep(ul) {
  margin: 0.5rem 0 0;
  padding-left: 1.2rem;
}

/* 讲义里常在步骤内嵌代码块与图片 */
.mag-step__body :deep(pre) {
  margin: 0.6rem 0;
}

.mag-step__body :deep(h4) {
  margin: 0.6rem 0 0.3rem;
  color: var(--mag-text);
}

@media (max-width: 700px) {
  .mag-step__body--indent {
    padding-left: 0;
  }
}
</style>
