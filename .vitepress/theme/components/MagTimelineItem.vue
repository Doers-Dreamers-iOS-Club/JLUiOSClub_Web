<script setup lang="ts">
/** MagTimelineItem —— 时间线节点（取代 .timeline-card + .tag） */
defineProps<{
  tag?: string
  title?: string
}>()
</script>

<template>
  <div class="mag-tl-item">
    <span class="mag-tl-item__dot" aria-hidden="true" />
    <span v-if="tag" class="mag-tl-item__tag">{{ tag }}</span>
    <h4 v-if="title" class="mag-tl-item__title">{{ title }}</h4>
    <div class="mag-tl-item__body"><slot /></div>
  </div>
</template>

<style scoped>
.mag-tl-item {
  position: relative;
  padding: var(--mag-space-sm) 0 var(--mag-space-sm) var(--mag-space-sm);
  color: var(--mag-text-secondary);
  line-height: var(--mag-leading-body);
}

/* 节点用小方块：杂志索引符号的感觉，对齐到 MagTimeline 的竖线上 */
.mag-tl-item__dot {
  position: absolute;
  top: 1.2rem;
  left: calc(-1 * var(--mag-space-lg) + 0.32rem - 3.5px);
  width: 9px;
  height: 9px;
  border: 2px solid var(--vp-c-bg);
  border-radius: 2px;
  background: var(--mag-accent);
}

.mag-tl-item__tag {
  display: inline-block;
  margin-bottom: var(--mag-space-2xs);
  padding: 0.18rem 0.6rem;
  border-radius: var(--mag-radius-pill);
  background: var(--mag-accent-soft);
  color: var(--mag-accent);
  font-size: var(--mag-fs-micro);
  font-weight: 600;
  letter-spacing: var(--mag-tracking-caps);
}

.mag-tl-item__title {
  margin: 0 0 var(--mag-space-2xs);
  border: 0;
  padding: 0;
  color: var(--mag-text);
  font-size: var(--mag-fs-h4);
  font-weight: 650;
  letter-spacing: var(--mag-tracking-title);
}

.mag-tl-item__body :deep(p) {
  margin: 0 0 0.4rem;
}

.mag-tl-item__body :deep(p:last-child) {
  margin-bottom: 0;
}

@media (max-width: 700px) {
  .mag-tl-item__dot {
    left: calc(-1 * var(--mag-space-md) + 0.32rem - 3.5px);
  }
}
</style>
