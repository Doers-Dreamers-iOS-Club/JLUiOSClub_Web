<script setup lang="ts">
/**
 * MagHero —— 杂志刊头（取代原先各页复制的 .vibe-banner）
 * 通栏规则线 + 大量留白，不再做成卡片。
 *
 * 首屏入场编排（motion-v）：eyebrow → 标题逐字（溢出遮蔽上滑）
 * → subtitle → date。遵守 useMotionReady 约定：SSR 永远输出可见终态，
 * 隐藏态只在水合后且用户未开 reduced-motion 时启用。
 */
import { computed } from 'vue'
import { Motion } from 'motion-v'
import { useMotionReady } from '../composables/useMotionReady'

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    /** 标题上方的小标签，如「培训主线」「活动记录」 */
    eyebrow?: string
    /** 期号，如「03」，传入后 eyebrow 行渲染为「№ 03 · 活动记录」 */
    issue?: string | number
    date?: string
    /** 关掉首屏入场动画 */
    entrance?: boolean
  }>(),
  { entrance: true }
)

const { animate: canAnimate } = useMotionReady()

/** 为 true 时才播放入场：已挂载、未开 reduced-motion、页面未关动画 */
const play = computed(() => canAnimate.value && props.entrance)

/** 与 --mag-ease 一致的缓动 */
const EASE = [0.22, 0.61, 0.36, 1] as const

/**
 * 标题切分：CJK 按字、拉丁按词，空格原样保留。
 * 用 Intl.Segmenter 按字素切，避免 emoji（如 ❄️）被拆成两半。
 */
interface TitlePiece {
  text: string
  /** 非空白片段的序号，用于计算错落延迟 */
  index: number
  space: boolean
}

const titlePieces = computed<TitlePiece[]>(() => {
  if (!props.title) return []
  const segmenter =
    typeof Intl !== 'undefined' && 'Segmenter' in Intl
      ? new Intl.Segmenter('zh', { granularity: 'grapheme' })
      : null

  const pieces: TitlePiece[] = []
  let index = 0
  for (const seg of props.title.split(/(\s+)/)) {
    if (!seg) continue
    if (/^\s+$/.test(seg)) {
      pieces.push({ text: ' ', index: -1, space: true })
      continue
    }
    // 纯 ASCII 段整体作为一个词，否则按字素逐字
    const units = /^[\x21-\x7e]+$/.test(seg)
      ? [seg]
      : segmenter
        ? [...segmenter.segment(seg)].map((s) => s.segment)
        : [...seg]
    for (const text of units) pieces.push({ text, index: index++, space: false })
  }
  return pieces
})

/** 标题逐字动画的延迟与时长 */
const charDelay = (i: number) => 0.18 + i * 0.03
const charTransition = (i: number) => ({
  duration: 0.65,
  ease: EASE,
  delay: charDelay(i)
})
const subtitleDelay = computed(() =>
  titlePieces.value.length ? charDelay(titlePieces.value.length - 1) + 0.25 : 0.3
)
</script>

<template>
  <header class="mag-hero mag-no-reveal">
    <div class="mag-hero__inner">
      <Motion
        v-if="eyebrow || issue !== undefined"
        as="p"
        class="mag-hero__eyebrow"
        :initial="play ? { opacity: 0, y: 12, filter: 'blur(4px)' } : false"
        :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
        :transition="{ duration: 0.5, ease: EASE }"
      >
        <span v-if="issue !== undefined" class="mag-hero__issue"
          >№ {{ issue }}</span
        >
        <span v-if="issue !== undefined && eyebrow" aria-hidden="true"> · </span
        >{{ eyebrow }}
      </Motion>

      <h1 v-if="title" class="mag-hero__title" :aria-label="title">
        <template v-for="(piece, i) in titlePieces" :key="i">
          <span v-if="piece.space">{{ piece.text }}</span>
          <span v-else class="mag-hero__char" aria-hidden="true">
            <Motion
              as="span"
              class="mag-hero__char-inner"
              :initial="play ? { y: '110%' } : false"
              :animate="{ y: '0%' }"
              :transition="charTransition(piece.index)"
              >{{ piece.text }}</Motion
            >
          </span>
        </template>
      </h1>
      <slot name="title" />

      <Motion
        v-if="subtitle"
        as="p"
        class="mag-hero__subtitle"
        :initial="play ? { opacity: 0, y: 14 } : false"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.55, ease: EASE, delay: subtitleDelay }"
        >{{ subtitle }}</Motion
      >

      <Motion
        v-if="date"
        as="p"
        class="mag-hero__date"
        :initial="play ? { opacity: 0, y: 10 } : false"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, ease: EASE, delay: subtitleDelay + 0.12 }"
      >
        <time>{{ date }}</time>
      </Motion>

      <div v-if="$slots.default" class="mag-hero__body">
        <slot />
      </div>
    </div>
  </header>
</template>

<style scoped>
/* 杂志刊头：顶部双线、底部细线，中间靠留白撑起版面 */
.mag-hero {
  position: relative;
  overflow: hidden;
  margin: var(--mag-space-lg) 0 var(--mag-space-xl);
  padding: clamp(2.6rem, 6vw, 4.5rem) clamp(0.4rem, 2vw, 1.2rem)
    clamp(2.2rem, 5vw, 3.4rem);
  border-top: var(--mag-rule-double);
  border-bottom: var(--mag-rule);
  isolation: isolate;
}

.mag-hero__inner {
  position: relative;
  z-index: 1;
}

.mag-hero__eyebrow {
  margin: 0 0 var(--mag-space-md);
  color: var(--mag-accent);
  font-size: var(--mag-fs-micro);
  font-weight: 600;
  letter-spacing: var(--mag-tracking-eyebrow);
  text-transform: uppercase;
}

.mag-hero__issue {
  font-variant-numeric: tabular-nums;
  letter-spacing: var(--mag-tracking-num);
}

.mag-hero__title {
  margin: 0;
  border: 0;
  padding: 0;
  color: var(--mag-text);
  font-family: var(--mag-font-serif);
  font-size: var(--mag-fs-display);
  font-weight: 700;
  letter-spacing: var(--mag-tracking-serif);
  line-height: var(--mag-leading-tight);
}

/* 逐字入场：外层裁切，内层从下方滑入 */
.mag-hero__char {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
}

.mag-hero__char-inner {
  display: inline-block;
  will-change: transform;
}

.mag-hero__subtitle {
  margin: var(--mag-space-md) 0 0;
  max-width: 46rem;
  color: var(--mag-text-secondary);
  font-size: clamp(1rem, 1.6vw, 1.15rem);
  line-height: var(--mag-leading-body);
}

.mag-hero__date {
  margin: var(--mag-space-md) 0 0;
  color: var(--mag-text-tertiary);
  font-size: var(--mag-fs-small);
  letter-spacing: var(--mag-tracking-caps);
}

.mag-hero__body {
  margin-top: var(--mag-space-md);
  color: var(--mag-text-secondary);
  line-height: var(--mag-leading-body);
}
</style>
