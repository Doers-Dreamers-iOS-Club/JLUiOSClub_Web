<script setup lang="ts">
/**
 * MagGrid —— 统一的响应式网格
 * 取代原先七套各自为政的网格类：info-grid / project-grid / compare-grid /
 * media-grid / track-grid / resource-grid / roadmap-grid。
 *
 * 根节点带 data-mag-stagger，useReveal 会让子项依次错落入场；
 * 根节点自身标记 mag-no-reveal，避免与子项动画叠加成双重位移。
 */
withDefaults(
  defineProps<{
    /** 桌面端列数，移动端一律退化为单列 */
    cols?: number | string
    /** 图集模式：为插槽里的 <figure> 提供排版（取代原 .media-grid） */
    media?: boolean
  }>(),
  { cols: 3, media: false }
)
</script>

<template>
  <div
    class="mag-grid mag-no-reveal"
    :class="{ 'mag-grid--media': media }"
    data-mag-stagger
    :style="{ '--mag-cols': String(cols) }"
  >
    <slot />
  </div>
</template>

<style scoped>
.mag-grid {
  display: grid;
  grid-template-columns: repeat(var(--mag-cols, 3), minmax(0, 1fr));
  gap: var(--mag-gap-grid);
  margin: var(--mag-space-lg) 0;
}

/* 图集模式：插槽内容带的是父组件 scope，必须 :deep() */
.mag-grid--media :deep(figure) {
  margin: 0;
}

.mag-grid--media :deep(img) {
  width: 100%;
  border: 1px solid var(--mag-hairline);
  border-radius: var(--mag-radius-sm);
  box-shadow: var(--mag-shadow-sm);
}

.mag-grid--media :deep(figcaption) {
  margin-top: 0.35rem;
  color: var(--mag-text-tertiary);
  font-size: var(--mag-fs-small);
  line-height: var(--mag-leading-snug);
  text-align: center;
}

/* 中等宽度先压到两列，避免 4 列直接跳单列造成的落差 */
@media (max-width: 1000px) {
  .mag-grid {
    grid-template-columns: repeat(min(var(--mag-cols, 3), 2), minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .mag-grid {
    grid-template-columns: 1fr;
  }
}
</style>
