<script setup lang="ts">
/**
 * MagCard —— 统一卡片
 * 取代原先六套卡片类：info-card / project-card / compare-card /
 * resource-card / track-card / roadmap-card。
 *
 * 注意：插槽内容带的是父组件的 scope id，本组件的 scoped 样式管不到，
 * 所以对插槽里的 ul / p / a 一律用 :deep() 选择。
 */
defineProps<{
  icon?: string
  title?: string
  /** 右上角小标签，如「Step 0」「培训主线」 */
  tag?: string
  /** 给出后整张卡片可点击 */
  href?: string
  /** 紧凑版，用于 roadmap 这类密集网格 */
  compact?: boolean
}>()
</script>

<template>
  <component
    :is="href ? 'a' : 'div'"
    :href="href"
    :target="href?.startsWith('http') ? '_blank' : undefined"
    :rel="href?.startsWith('http') ? 'noreferrer' : undefined"
    class="mag-card"
    :class="{ 'mag-card--compact': compact, 'mag-card--link': href }"
  >
    <span v-if="tag" class="mag-card__tag">{{ tag }}</span>
    <div v-if="icon" class="mag-card__icon">{{ icon }}</div>
    <h3 v-if="title" class="mag-card__title">{{ title }}</h3>
    <div class="mag-card__body"><slot /></div>
  </component>
</template>

<style scoped>
.mag-card {
  position: relative;
  display: block;
  padding: var(--mag-space-md);
  border: 1px solid var(--mag-hairline);
  border-radius: var(--mag-radius-sm);
  background: var(--mag-surface);
  box-shadow: var(--mag-shadow-sm);
  color: inherit;
  text-decoration: none;
  transition:
    box-shadow var(--mag-duration-fast) var(--mag-ease),
    border-color var(--mag-duration-fast) var(--mag-ease);
}

/* hover 从「上浮」改为「顶部 accent 线划入」，更编辑感 */
.mag-card::before {
  content: '';
  position: absolute;
  top: -1px;
  left: var(--mag-space-md);
  right: var(--mag-space-md);
  height: 2px;
  background: var(--mag-accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--mag-duration) var(--mag-ease);
}

.mag-card:hover {
  border-color: var(--mag-hairline-strong);
  box-shadow: var(--mag-shadow-md);
}

.mag-card:hover::before {
  transform: scaleX(1);
}

.mag-card--compact {
  padding: var(--mag-space-sm);
}

.mag-card__tag {
  display: inline-block;
  margin-bottom: var(--mag-space-xs);
  padding: 0.2rem 0.6rem;
  border-radius: var(--mag-radius-pill);
  background: var(--mag-accent-soft);
  color: var(--mag-accent);
  font-size: var(--mag-fs-micro);
  font-weight: 600;
  letter-spacing: var(--mag-tracking-caps);
}

.mag-card__icon {
  margin-bottom: var(--mag-space-xs);
  font-size: 1.7rem;
  line-height: 1;
}

.mag-card__title {
  margin: 0 0 var(--mag-space-xs);
  border: 0;
  padding: 0;
  color: var(--mag-text);
  font-size: var(--mag-fs-h4);
  font-weight: 650;
  letter-spacing: var(--mag-tracking-title);
}

.mag-card__body {
  color: var(--mag-text-secondary);
  font-size: var(--mag-fs-body);
  line-height: var(--mag-leading-body);
}

/* 插槽内容 —— 必须 :deep()，否则选不中。
   迁移后的页面把图标/标题作为插槽内容传入（<span class="mag-icon">、<h3>），
   这里统一给它们上样式，效果与 icon / title props 一致。 */
.mag-card__body :deep(.mag-icon) {
  display: block;
  margin-bottom: var(--mag-space-xs);
  font-size: 1.7rem;
  line-height: 1;
}

.mag-card__body :deep(h3),
.mag-card__body :deep(h4) {
  margin: 0 0 var(--mag-space-xs);
  border: 0;
  padding: 0;
  color: var(--mag-text);
  font-size: var(--mag-fs-h4);
  font-weight: 650;
  letter-spacing: var(--mag-tracking-title);
}

.mag-card__body :deep(p) {
  margin: 0 0 0.5rem;
}

.mag-card__body :deep(p:last-child) {
  margin-bottom: 0;
}

.mag-card__body :deep(ul) {
  margin: 0.5rem 0 0;
  padding-left: 1.2rem;
}

.mag-card__body :deep(a) {
  color: var(--mag-accent);
  font-weight: 500;
}

.mag-card--link:hover .mag-card__title {
  color: var(--mag-accent);
}
</style>
