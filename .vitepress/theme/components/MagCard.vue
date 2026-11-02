<script setup lang="ts">
/**
 * MagCard —— 统一卡片
 * 取代原先六套卡片类：info-card / project-card / compare-card /
 * resource-card / track-card / roadmap-card。
 *
 * 便签语言：hover 时右下角掀起（与 MagArchive 网格项一致）；
 * href 为站内链接时，点击播「撕下 + 淡化」转场（useNoteTear）。
 *
 * 注意：插槽内容带的是父组件的 scope id，本组件的 scoped 样式管不到，
 * 所以对插槽里的 ul / p / a 一律用 :deep() 选择。
 */
import { ref } from 'vue'
import { useRouter } from 'vitepress'
import { useNoteTear } from '../composables/useNoteTear'

const props = defineProps<{
  icon?: string
  title?: string
  /** 右上角小标签，如「Step 0」「培训主线」 */
  tag?: string
  /** 给出后整张卡片可点击 */
  href?: string
  /** 紧凑版，用于 roadmap 这类密集网格 */
  compact?: boolean
}>()

const router = useRouter()
const { tearTo } = useNoteTear()
/** 正在播撕下动画；true 期间挡住重复点击 */
const tearing = ref(false)

function onPick(e: MouseEvent) {
  const href = props.href
  // 外链与修饰键/非左键点击：交给浏览器默认行为
  if (!href || href.startsWith('http')) return
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  e.preventDefault()
  if (tearing.value) return
  tearing.value = true
  // 卡片被克隆成幽灵独立播撕下动画（见 useNoteTear.ts）
  void tearTo(() => router.go(href), e.currentTarget as HTMLElement)
}
</script>

<template>
  <component
    :is="href ? 'a' : 'div'"
    :href="href"
    :target="href?.startsWith('http') ? '_blank' : undefined"
    :rel="href?.startsWith('http') ? 'noreferrer' : undefined"
    class="mag-card"
    :class="{
      'mag-card--compact': compact,
      'mag-card--link': href
    }"
    @click="onPick"
  >
    <span v-if="tag" class="mag-card__tag">{{ tag }}</span>
    <div v-if="icon" class="mag-card__icon">{{ icon }}</div>
    <h3 v-if="title" class="mag-card__title">{{ title }}</h3>
    <div class="mag-card__body"><slot /></div>
  </component>
</template>

<style scoped>
.mag-card {
  /* 静止时翘起的角尺寸：不可点击的卡片不翘角（翘角是可交互的暗示） */
  --mag-peel: 0px;
  position: relative;
  display: block;
  overflow: hidden;
  padding: var(--mag-space-md);
  border: 1px solid var(--mag-hairline);
  border-radius: var(--mag-radius-sm);
  background: var(--mag-surface);
  box-shadow: var(--mag-shadow-sm);
  color: inherit;
  text-decoration: none;
  transition:
    transform 0.38s cubic-bezier(0.34, 1.3, 0.64, 1),
    box-shadow var(--mag-duration-fast) var(--mag-ease),
    border-color var(--mag-duration-fast) var(--mag-ease);
}

/* hover = 全站便签语言：右下角掀起 + 轻微抬起。
   两个伪元素分工与 MagArchive 网格项一致：
   ::before = 掀起后露出的页面底色 + 折痕投影；::after = 纸张背面三角 */
.mag-card::before {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 2;
  width: var(--mag-peel);
  height: var(--mag-peel);
  border-bottom-right-radius: var(--mag-radius-sm);
  background:
    linear-gradient(315deg, transparent 50%, rgba(0, 0, 0, 0.14) 51%, transparent 64%),
    linear-gradient(315deg, var(--vp-c-bg) 50%, transparent 50.5%);
  transition:
    width 0.4s cubic-bezier(0.34, 1.45, 0.64, 1),
    height 0.4s cubic-bezier(0.34, 1.45, 0.64, 1);
}

.mag-card::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 2;
  width: var(--mag-peel);
  height: var(--mag-peel);
  border-bottom-right-radius: var(--mag-radius-sm);
  background: linear-gradient(
    315deg,
    transparent 50%,
    var(--mag-note-back) 50.5%,
    color-mix(in srgb, var(--mag-note-back), #000 9%) 100%
  );
  filter: drop-shadow(-2px -2px 3px rgba(0, 0, 0, 0.1));
  transition:
    width 0.4s cubic-bezier(0.34, 1.45, 0.64, 1),
    height 0.4s cubic-bezier(0.34, 1.45, 0.64, 1);
}

.mag-card--link {
  --mag-peel: 8px;
}

.mag-card--link:hover {
  --mag-peel: 26px;
  transform: translateY(-4px);
  border-color: var(--mag-hairline-strong);
  box-shadow: var(--mag-shadow-md);
}

.mag-card--compact {
  padding: var(--mag-space-sm);
}

.mag-card--compact.mag-card--link {
  --mag-peel: 6px;
}

.mag-card--compact.mag-card--link:hover {
  --mag-peel: 20px;
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
