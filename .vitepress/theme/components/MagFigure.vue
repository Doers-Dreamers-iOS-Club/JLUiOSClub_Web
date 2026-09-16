<script setup lang="ts">
/**
 * MagFigure —— 配图（取代 .image-container）
 *
 * 两种用法：
 *   1. 相对路径的站内图片 —— 必须把 <img> 放进插槽：
 *        <MagFigure caption="图 1">
 *          <img src="./imgs/2.png" alt="..." />
 *        </MagFigure>
 *      因为 VitePress 只会重写 markdown 里 <img src> 的路径。写成 :src prop 的话，
 *      它只是一个普通字符串，Vite 根本不会把这张图算作资源，构建产物里会缺图。
 *   2. /public 下的绝对路径 —— 可以直接用 src prop，无需 Vite 处理。
 *
 * 内部保持朴素的 <img>：theme/index.ts 里 medium-zoom 会选中
 * 正文区所有图片（轮播除外）启用点击放大。
 */
defineProps<{
  /** 仅用于 /public 下的绝对路径；站内相对路径请用插槽 */
  src?: string
  alt?: string
  caption?: string
  /** 覆盖最大高度，如 '24rem' */
  maxHeight?: string
  /** 去掉边框 / 阴影 / 圆角（logo、截图拼版等不需要装裱的图） */
  plain?: boolean
}>()
</script>

<template>
  <figure
    class="mag-figure"
    :class="{ 'mag-figure--plain': plain }"
    :style="maxHeight ? { '--mag-fig-max': maxHeight } : undefined"
  >
    <img
      v-if="src"
      class="mag-figure__img"
      :src="src"
      :alt="alt || caption || ''"
      loading="lazy"
      decoding="async"
    />
    <slot />
    <figcaption v-if="caption" class="mag-figure__caption">
      {{ caption }}
    </figcaption>
  </figure>
</template>

<style scoped>
.mag-figure {
  margin: var(--mag-space-lg) 0;
  text-align: center;
}

/* 同时作用于 prop 形式的图和插槽里的图（插槽内容要 :deep 才选得中） */
.mag-figure__img,
.mag-figure :deep(img) {
  max-width: 100%;
  max-height: var(--mag-fig-max, 22rem);
  border: 1px solid var(--mag-hairline);
  border-radius: var(--mag-radius-sm);
  box-shadow: var(--mag-shadow-sm);
  cursor: zoom-in;
  transition: box-shadow var(--mag-duration-fast) var(--mag-ease);
}

.mag-figure__img:hover,
.mag-figure :deep(img:hover) {
  box-shadow: var(--mag-shadow-md);
}

/* plain：不装裱的图（logo、UI 截图拼版） */
.mag-figure--plain .mag-figure__img,
.mag-figure--plain :deep(img) {
  border: 0;
  border-radius: 0;
  box-shadow: none;
}

/* 杂志图注：宽字距小字居中 */
.mag-figure__caption,
.mag-figure :deep(em) {
  display: block;
  margin-top: var(--mag-space-xs);
  color: var(--mag-text-tertiary);
  font-size: var(--mag-fs-micro);
  font-style: normal;
  letter-spacing: var(--mag-tracking-caps);
}
</style>
