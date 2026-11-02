<script setup lang="ts">
/**
 * MagArchive —— 杂志式记录索引：时间线（默认）/ 网格 双视图
 * ---------------------------------------------------------------------------
 * 取代 /activities/ 与 /news/ 原先从 sidebar.ts 渲染的裸 <ul>。
 * 数据来自 createContentLoader，页面无需再手工登记条目。
 *
 * 时间线视图：按年份分组的纵向脊椎，期号（№ 07）由数据层派生，
 * 脊椎上的 accent 进度线随滚动生长（motion-v useScroll scrub）。
 * 网格视图：原卡片流，作为可选切换保留。
 *
 * 动效分工：条目行的入场交给全局 useReveal（本文件给行容器挂
 * data-mag-stagger），motion-v 只负责脊椎 scrub——几十条记录逐个
 * 包 <Motion> 不值得。
 */
import { computed, onMounted, ref, watch } from 'vue'
import { useScroll, useMotionValueEvent } from 'motion-v'
import { useRouter } from 'vitepress'
import { useMotionReady } from '../composables/useMotionReady'
import { useNoteTear } from '../composables/useNoteTear'
import { data as activities } from '../../data/activities.data.mts'
import { data as news } from '../../data/news.data.mts'
import { data as competitions } from '../../data/competitions.data.mts'
import type { RecordEntry } from '../../data/shared'

const props = withDefaults(
  defineProps<{
    source?: 'activities' | 'news' | 'competitions'
    /** 最多显示几条，不填为全部。给出 limit 时强制网格视图并隐藏切换 */
    limit?: number
    /** 把最新一条标为 NEW */
    highlightLatest?: boolean
    /** 默认视图；localStorage 会记住用户之后的选择 */
    view?: 'timeline' | 'grid'
    /** 是否显示「时间线 / 网格」切换 */
    showViewToggle?: boolean
  }>(),
  { source: 'activities', highlightLatest: true, view: 'timeline', showViewToggle: true }
)

const SOURCES = { activities, news, competitions }
const VIEWS = ['timeline', 'grid'] as const

const all = computed<RecordEntry[]>(() => SOURCES[props.source])
const entries = computed(() => (props.limit ? all.value.slice(0, props.limit) : all.value))

/* ---- 视图切换（localStorage 记忆，仅客户端） ------------------------------ */
const STORAGE_KEY = 'mag-archive-view'
/** limit 模式下永远用网格，更省纵向空间 */
const effectiveToggle = computed(() => props.showViewToggle && !props.limit)
const currentView = ref<'timeline' | 'grid'>(props.limit ? 'grid' : props.view)

onMounted(() => {
  if (!effectiveToggle.value) return
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'timeline' || saved === 'grid') currentView.value = saved
})

watch(currentView, (v) => {
  if (effectiveToggle.value) localStorage.setItem(STORAGE_KEY, v)
})

/* ---- 时间线：按年份分组 --------------------------------------------------- */
const groups = computed(() => {
  const map = new Map<number, RecordEntry[]>()
  for (const entry of entries.value) {
    const list = map.get(entry.year) ?? []
    list.push(entry)
    map.set(entry.year, list)
  }
  // Map 按插入序，而 entries 已按时间倒序，所以年份天然从新到旧
  return [...map.entries()].map(([year, list]) => ({ year, list }))
})

const rangeText = computed(() => {
  const years = groups.value.map((g) => g.year).filter((y) => y > 0)
  if (!years.length) return ''
  return `${Math.min(...years)}—${Math.max(...years)}`
})

/* ---- 脊椎滚动进度（scrub） ------------------------------------------------ */
const { reduced } = useMotionReady()
const timelineEl = ref<HTMLElement>()
const spineEl = ref<HTMLElement>()

const { scrollYProgress } = useScroll({
  target: timelineEl,
  offset: ['start 0.75', 'end 0.5']
})

useMotionValueEvent(scrollYProgress, 'change', (v) => {
  if (reduced.value) return
  if (spineEl.value) spineEl.value.style.transform = `scaleY(${v})`
})

/* ---- 封面 ----------------------------------------------------------------- */
/** 无封面时用 frontmatter 的 icon，退而用标题首字，避免出现空洞 */
function glyph(entry: { icon: string; title: string }): string {
  return entry.icon || [...entry.title.trim()][0] || '·'
}

/**
 * 由标题散列出一个稳定色相，让没有配图的封面之间也有区分度。
 * 同一篇文章每次构建得到的颜色一致，不会因为排序变化而跳色。
 */
function hue(title: string): number {
  let h = 0
  for (const ch of title) h = (h * 31 + ch.codePointAt(0)!) % 360
  return h
}

/* ---- 网格便签：点击 = 撕下 + 换页 -------------------------------------------
   被点的卡片会被克隆成挂在 body 上的「幽灵」独立播撕下动画（见
   useNoteTear.ts），原元素原地隐藏——旧页淡出、路由切换都不影响幽灵。 */
const router = useRouter()
const { tearTo } = useNoteTear()
/** 正在撕下的条目；非空期间挡住重复点击 */
const tearingUrl = ref('')

function onPick(entry: RecordEntry, e: MouseEvent) {
  // 修饰键 / 非左键：交给浏览器默认行为（新标签打开等）
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  e.preventDefault()
  if (tearingUrl.value) return
  tearingUrl.value = entry.url
  void tearTo(() => router.go(entry.url), e.currentTarget as HTMLElement)
}
</script>

<template>
  <div class="mag-archive mag-no-reveal">
    <!-- 工具行：期数统计 + 视图切换 -->
    <div v-if="entries.length && !limit" class="mag-archive__bar">
      <span class="mag-archive__count">
        共 {{ all.length }} 期<template v-if="rangeText"> · {{ rangeText }}</template>
      </span>
      <div
        v-if="effectiveToggle"
        class="mag-archive__toggle"
        role="tablist"
        aria-label="切换浏览方式"
      >
        <button
          v-for="v in VIEWS"
          :key="v"
          type="button"
          role="tab"
          class="mag-archive__toggle-btn"
          :class="{ 'mag-archive__toggle-btn--active': currentView === v }"
          :aria-selected="currentView === v"
          @click="currentView = v"
        >
          {{ v === 'timeline' ? '时间线' : '网格' }}
        </button>
      </div>
    </div>

    <!-- ================= 时间线视图 ================= -->
    <div
      v-if="currentView === 'timeline'"
      ref="timelineEl"
      class="mag-archive__timeline"
    >
      <span class="mag-archive__spine" aria-hidden="true" />
      <span
        ref="spineEl"
        class="mag-archive__spine-progress"
        :class="{ 'mag-archive__spine-progress--static': reduced }"
        aria-hidden="true"
      />

      <section v-for="group in groups" :key="group.year" class="mag-archive__year">
        <h2 class="mag-archive__year-title">
          <span class="mag-archive__year-node" aria-hidden="true" />
          {{ group.year > 0 ? group.year : '未归档' }}
          <span class="mag-archive__year-count">{{ group.list.length }} 期</span>
        </h2>

        <div class="mag-archive__entries" data-mag-stagger>
          <a
            v-for="entry in group.list"
            :key="entry.url"
            class="mag-archive__row"
            :href="entry.url"
          >
            <span class="mag-archive__node" aria-hidden="true" />

            <div class="mag-archive__row-main">
              <p class="mag-archive__row-meta">
                <span class="mag-archive__issue">№ {{ entry.issue }}</span>
                <span v-if="entry.date" class="mag-archive__date">{{ entry.date }}</span>
                <span
                  v-if="highlightLatest && entry.url === all[0]?.url"
                  class="mag-archive__new"
                  >NEW</span
                >
              </p>
              <h3 class="mag-archive__row-title">{{ entry.title }}</h3>
              <p v-if="entry.summary" class="mag-archive__summary">{{ entry.summary }}</p>
              <div v-if="entry.tags.length" class="mag-archive__tags">
                <span v-for="tag in entry.tags" :key="tag" class="mag-archive__tag">
                  {{ tag }}
                </span>
              </div>
            </div>

            <div
              class="mag-archive__thumb"
              :class="{ 'mag-archive__thumb--generated': !entry.cover }"
              :style="{ '--h': `${hue(entry.title)}deg` }"
            >
              <img
                v-if="entry.cover"
                :src="entry.cover"
                alt=""
                loading="lazy"
                decoding="async"
              />
              <span v-else class="mag-archive__placeholder" aria-hidden="true">
                {{ glyph(entry) }}
              </span>
            </div>
          </a>
        </div>
      </section>
    </div>

    <!-- ================= 网格视图 ================= -->
    <div v-else class="mag-archive__grid" data-mag-stagger>
      <a
        v-for="(entry, i) in entries"
        :key="entry.url"
        class="mag-archive__item"
        :href="entry.url"
        :style="{ '--h': `${hue(entry.title)}deg` }"
        @click="onPick(entry, $event)"
      >
        <!-- 顶部胶带：撕下动画的旋转支点就在这儿 -->
        <span class="mag-archive__tape" aria-hidden="true" />

        <div
          class="mag-archive__cover"
          :class="{ 'mag-archive__cover--generated': !entry.cover }"
        >
          <img
            v-if="entry.cover"
            :src="entry.cover"
            :alt="entry.title"
            loading="lazy"
            decoding="async"
          />
          <span class="mag-archive__placeholder" v-else aria-hidden="true">
            {{ glyph(entry) }}
          </span>
        </div>

        <div class="mag-archive__meta">
          <span class="mag-archive__issue">№ {{ entry.issue }}</span>
          <span v-if="entry.date" class="mag-archive__date">{{ entry.date }}</span>
          <span v-if="highlightLatest && i === 0" class="mag-archive__new">NEW</span>
        </div>

        <h3 class="mag-archive__title">{{ entry.title }}</h3>

        <p v-if="entry.summary" class="mag-archive__summary">{{ entry.summary }}</p>

        <div v-if="entry.tags.length" class="mag-archive__tags">
          <span v-for="tag in entry.tags" :key="tag" class="mag-archive__tag">
            {{ tag }}
          </span>
        </div>
      </a>
    </div>

    <p v-if="!entries.length" class="mag-archive__empty">暂无内容。</p>
  </div>
</template>

<style scoped>
.mag-archive {
  margin: var(--mag-space-lg) 0;
}

/* ---- 工具行 ------------------------------------------------------------- */
.mag-archive__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--mag-space-md);
  margin-bottom: var(--mag-space-lg);
  padding-bottom: var(--mag-space-sm);
  border-bottom: var(--mag-rule);
}

.mag-archive__count {
  color: var(--mag-text-tertiary);
  font-size: var(--mag-fs-micro);
  letter-spacing: var(--mag-tracking-eyebrow);
}

.mag-archive__toggle {
  display: inline-flex;
  padding: 2px;
  border: 1px solid var(--mag-hairline);
  border-radius: var(--mag-radius-pill);
  background: var(--mag-surface);
}

.mag-archive__toggle-btn {
  padding: 0.2rem 0.8rem;
  border: 0;
  border-radius: var(--mag-radius-pill);
  background: transparent;
  color: var(--mag-text-secondary);
  font-size: var(--mag-fs-micro);
  letter-spacing: var(--mag-tracking-caps);
  cursor: pointer;
  transition:
    background var(--mag-duration-fast) var(--mag-ease),
    color var(--mag-duration-fast) var(--mag-ease);
}

.mag-archive__toggle-btn--active {
  background: var(--mag-text);
  color: var(--vp-c-bg);
}

/* ---- 时间线 -------------------------------------------------------------- */
.mag-archive__timeline {
  position: relative;
  padding-left: 1.6rem;
}

/* 脊椎：底色细线 + accent 进度线（随滚动生长） */
.mag-archive__spine,
.mag-archive__spine-progress {
  position: absolute;
  top: 1.2rem;
  bottom: 0.5rem;
  left: 0.3rem;
  width: 2px;
}

.mag-archive__spine {
  background: var(--mag-hairline);
}

.mag-archive__spine-progress {
  background: var(--mag-accent);
  transform: scaleY(0);
  transform-origin: top;
}

/* reduced-motion：不播 scrub，整条进度线静态显示 */
.mag-archive__spine-progress--static {
  transform: scaleY(1);
}

.mag-archive__year {
  margin-bottom: var(--mag-space-xl);
}

.mag-archive__year-title {
  position: relative;
  display: flex;
  align-items: baseline;
  gap: var(--mag-space-sm);
  margin: 0 0 var(--mag-space-sm);
  border: 0;
  padding: 0 0 var(--mag-space-xs);
  color: var(--mag-text);
  font-family: var(--mag-font-serif);
  font-size: var(--mag-fs-year);
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

/* 年份节点：压在脊椎上的大方块 */
.mag-archive__year-node {
  position: absolute;
  top: 0.55em;
  left: calc(-1.6rem + 0.3rem - 5px);
  width: 12px;
  height: 12px;
  border: 2px solid var(--vp-c-bg);
  border-radius: 2px;
  background: var(--mag-accent);
}

.mag-archive__year-count {
  color: var(--mag-text-tertiary);
  font-family: var(--mag-font-display);
  font-size: var(--mag-fs-micro);
  font-weight: 400;
  letter-spacing: var(--mag-tracking-eyebrow);
}

.mag-archive__entries {
  display: flex;
  flex-direction: column;
}

/* 条目行：正文 + 缩略图 */
.mag-archive__row {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 9rem;
  gap: var(--mag-space-md);
  align-items: center;
  padding: var(--mag-space-md) 0;
  border-bottom: var(--mag-rule);
  color: inherit;
  text-decoration: none;
}

.mag-archive__row:last-child {
  border-bottom: 0;
}

.mag-archive__node {
  position: absolute;
  top: calc(var(--mag-space-md) + 0.45em);
  left: calc(-1.6rem + 0.3rem - 3.5px);
  width: 9px;
  height: 9px;
  border: 2px solid var(--vp-c-bg);
  border-radius: 2px;
  background: var(--mag-hairline-strong);
  transition: background var(--mag-duration-fast) var(--mag-ease);
}

.mag-archive__row:hover .mag-archive__node {
  background: var(--mag-accent);
}

.mag-archive__row-meta {
  display: flex;
  align-items: center;
  gap: var(--mag-space-xs);
  margin: 0 0 var(--mag-space-2xs);
}

.mag-archive__issue {
  color: var(--mag-accent);
  font-family: var(--mag-font-mono);
  font-size: var(--mag-fs-micro);
  letter-spacing: var(--mag-tracking-num);
}

.mag-archive__row-title {
  margin: 0 0 var(--mag-space-2xs);
  border: 0;
  padding: 0;
  color: var(--mag-text);
  font-family: var(--mag-font-serif);
  font-size: var(--mag-fs-h3);
  font-weight: 700;
  letter-spacing: var(--mag-tracking-serif);
  line-height: var(--mag-leading-snug);
  transition: color var(--mag-duration-fast) var(--mag-ease);
}

.mag-archive__row:hover .mag-archive__row-title {
  color: var(--mag-accent);
}

.mag-archive__thumb {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  border: 1px solid var(--mag-hairline);
  border-radius: var(--mag-radius-sm);
  background: var(--mag-surface-sunken);
}

.mag-archive__thumb--generated {
  border: 0;
  background: linear-gradient(
    140deg,
    hsl(var(--h, 210deg) 70% 92%),
    hsl(calc(var(--h, 210deg) + 40deg) 65% 84%)
  );
}

.dark .mag-archive__thumb--generated {
  background: linear-gradient(
    140deg,
    hsl(var(--h, 210deg) 32% 22%),
    hsl(calc(var(--h, 210deg) + 40deg) 30% 16%)
  );
}

.mag-archive__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--mag-duration) var(--mag-ease);
}

.mag-archive__row:hover .mag-archive__thumb img {
  transform: scale(1.04);
}

.mag-archive__thumb .mag-archive__placeholder {
  font-size: 1.9rem;
}

/* ---- 网格视图（便签墙） ------------------------------------------------------
   每张卡片是一张真正的便利贴：彩色纸面（--h 由标题散列，每张颜色稳定）、
   顶部一截胶带、静止时右下角翘起、各张错落倾斜；
   有封面的条目封面是贴上去的照片（白边、微歪），
   无封面的条目把字形直接写在纸面上。
   点击的撕下动画是全局类 .mag-note--tearing（见 motion.css）。 */
.mag-archive__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--mag-gap-grid);
  /* 胶带探出贴纸顶缘，网格上方留一点空间 */
  padding-top: 10px;
}

.mag-archive__item {
  /* 静止时翘起的角尺寸；hover 时加大 */
  --mag-peel: 10px;
  /* 静止倾斜角，由 nth-child 错落地赋小角度 */
  --mag-note-tilt: 0deg;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: var(--mag-space-md);
  border: 0;
  border-radius: 4px;
  /* 纸面：顶光微亮的彩色便签 + 胶条压在纸面上的暗部 */
  background:
    linear-gradient(180deg, rgba(0, 0, 0, 0.035), transparent 14%),
    linear-gradient(
      168deg,
      hsl(var(--h, 55deg) 92% 93%),
      hsl(var(--h, 55deg) 88% 88.5%)
    );
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.07),
    0 10px 22px rgba(0, 0, 0, 0.1);
  color: inherit;
  text-decoration: none;
  /* 注意：这里不写 transform。网格项会带 .mag-reveal 播入场动画，
     基础 transform 会抢掉 reveal 的位移；静止倾斜由下方 .mag-in 规则补上 */
  transition:
    transform 0.38s cubic-bezier(0.34, 1.3, 0.64, 1),
    box-shadow var(--mag-duration-fast) var(--mag-ease);
}

.mag-archive__item:nth-child(odd) {
  --mag-note-tilt: -1deg;
}

.mag-archive__item:nth-child(even) {
  --mag-note-tilt: 0.8deg;
}

/* 揭示结束（.mag-in）后 motion.css 会把 transform 归零，这里恢复便签的静止倾斜。
   注意要写在 :hover 之前，让 hover 规则赢下同优先级竞争 */
.mag-archive__item.mag-in {
  transform: rotate(var(--mag-note-tilt));
}

/* 减弱动效时 reveal 不启用，便签直接以静止倾斜呈现 */
@media (prefers-reduced-motion: reduce) {
  .mag-archive__item {
    transform: rotate(var(--mag-note-tilt));
  }
}

/* 顶部胶带：半透，透出纸面颜色；偶数张贴纸胶带换个角度 */
.mag-archive__tape {
  position: absolute;
  top: -9px;
  left: 50%;
  z-index: 3;
  width: 74px;
  height: 22px;
  transform: translateX(-50%) rotate(-1.6deg);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.62),
    rgba(255, 255, 255, 0.38)
  );
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.mag-archive__item:nth-child(even) .mag-archive__tape {
  transform: translateX(-50%) rotate(1.3deg);
}

/* 掀开的角（下半）：纸被掀起后露出的页面底色 + 折痕在纸面上的投影 */
.mag-archive__item::before {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 2;
  width: var(--mag-peel);
  height: var(--mag-peel);
  border-bottom-right-radius: 4px;
  background:
    linear-gradient(315deg, transparent 50%, rgba(0, 0, 0, 0.15) 51%, transparent 64%),
    linear-gradient(315deg, var(--vp-c-bg) 50%, transparent 50.5%);
  transition:
    width 0.4s cubic-bezier(0.34, 1.45, 0.64, 1),
    height 0.4s cubic-bezier(0.34, 1.45, 0.64, 1);
}

/* 掀开的角（上半）：翻折过来的纸张背面三角——用贴纸自己的色相，比纸面更浅 */
.mag-archive__item::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 2;
  width: var(--mag-peel);
  height: var(--mag-peel);
  border-bottom-right-radius: 4px;
  background: linear-gradient(
    315deg,
    transparent 50%,
    hsl(var(--h, 55deg) 88% 95%) 50.5%,
    hsl(var(--h, 55deg) 82% 90%) 100%
  );
  filter: drop-shadow(-2px -2px 3px rgba(0, 0, 0, 0.12));
  transition:
    width 0.4s cubic-bezier(0.34, 1.45, 0.64, 1),
    height 0.4s cubic-bezier(0.34, 1.45, 0.64, 1);
}

/* hover：贴纸回正、抬起，角掀得更大（回弹式缓动，像被轻轻抠起） */
.mag-archive__item:hover {
  --mag-peel: 34px;
  transform: rotate(0deg) translateY(-5px);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.08),
    0 18px 34px rgba(0, 0, 0, 0.14);
}

/* 有封面的条目：封面是贴在便签上的照片——白边、微歪 */
.mag-archive__cover {
  display: block;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  margin: 0 0 var(--mag-space-sm);
  padding: 5px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.14);
  transform: rotate(-0.7deg);
  transition: transform 0.38s cubic-bezier(0.34, 1.3, 0.64, 1);
}

/* 无封面的条目：不要色块，字形直接写在纸面上 */
.mag-archive__cover--generated {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: transparent;
  box-shadow: none;
  transform: none;
}

.mag-archive__item:hover .mag-archive__cover {
  transform: rotate(0deg);
}

.mag-archive__cover img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mag-archive__placeholder {
  color: hsl(var(--h, 210deg) 55% 32%);
  font-size: 2.6rem;
  font-weight: 700;
  line-height: 1;
  transition: transform var(--mag-duration) var(--mag-ease);
}

/* 写在便签上的字形：用贴纸色相的深色，带一点纸面高光 */
.mag-archive__cover--generated .mag-archive__placeholder {
  color: hsl(var(--h, 55deg) 45% 38%);
  font-size: 2.5rem;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.45);
}

.dark .mag-archive__cover--generated .mag-archive__placeholder {
  color: hsl(var(--h, 55deg) 55% 76%);
  text-shadow: none;
}

.dark .mag-archive__placeholder {
  color: hsl(var(--h, 210deg) 60% 82%);
}

.mag-archive__item:hover .mag-archive__placeholder {
  transform: scale(1.08);
}

/* ---- 便签的暗色模式与纸上配色 --------------------------------------------- */
.dark .mag-archive__item {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent 14%),
    linear-gradient(
      168deg,
      hsl(var(--h, 55deg) 30% 24%),
      hsl(var(--h, 55deg) 28% 19%)
    );
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.4),
    0 10px 22px rgba(0, 0, 0, 0.5);
}

.dark .mag-archive__item:hover {
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.45),
    0 18px 34px rgba(0, 0, 0, 0.55);
}

.dark .mag-archive__tape {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.16),
    rgba(255, 255, 255, 0.09)
  );
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.dark .mag-archive__item::after {
  background: linear-gradient(
    315deg,
    transparent 50%,
    hsl(var(--h, 55deg) 28% 31%) 50.5%,
    hsl(var(--h, 55deg) 25% 25%) 100%
  );
}

/* 期号与标签用贴纸自己的色相，像用同色的笔写在便签上 */
.mag-archive__item .mag-archive__issue {
  color: hsl(var(--h, 55deg) 48% 32%);
}

.dark .mag-archive__item .mag-archive__issue {
  color: hsl(var(--h, 55deg) 62% 72%);
}

.mag-archive__item .mag-archive__tag {
  background: rgba(255, 255, 255, 0.45);
  color: hsl(var(--h, 55deg) 40% 30%);
}

.dark .mag-archive__item .mag-archive__tag {
  background: rgba(255, 255, 255, 0.09);
  color: hsl(var(--h, 55deg) 45% 75%);
}

.mag-archive__meta {
  display: flex;
  align-items: center;
  gap: var(--mag-space-xs);
  margin-bottom: var(--mag-space-2xs);
}

.mag-archive__date {
  color: var(--mag-text-tertiary);
  font-size: var(--mag-fs-micro);
  letter-spacing: var(--mag-tracking-caps);
  font-variant-numeric: tabular-nums;
}

.mag-archive__new {
  padding: 0.1rem 0.45rem;
  border-radius: var(--mag-radius-pill);
  background: var(--mag-accent);
  color: #fff;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: var(--mag-tracking-caps);
}

.mag-archive__title {
  margin: 0 0 var(--mag-space-2xs);
  border: 0;
  padding: 0;
  color: var(--mag-text);
  font-family: var(--mag-font-serif);
  font-size: var(--mag-fs-h4);
  font-weight: 700;
  letter-spacing: var(--mag-tracking-serif);
  line-height: var(--mag-leading-snug);
}

.mag-archive__item:hover .mag-archive__title {
  color: var(--mag-accent);
}

/* ---- 共用 ------------------------------------------------------------------ */
.mag-archive__summary {
  margin: 0;
  color: var(--mag-text-secondary);
  font-size: var(--mag-fs-small);
  line-height: var(--mag-leading-snug);
  /* 摘要长度不一，截断以保持版面整齐 */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.mag-archive__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: var(--mag-space-sm);
}

.mag-archive__item .mag-archive__tags {
  margin-top: auto;
  padding-top: var(--mag-space-sm);
}

.mag-archive__tag {
  padding: 0.16rem 0.5rem;
  border-radius: var(--mag-radius-pill);
  background: var(--mag-accent-soft);
  color: var(--mag-accent);
  font-size: var(--mag-fs-micro);
}

.mag-archive__empty {
  color: var(--mag-text-tertiary);
}

/* ---- 响应式 ---------------------------------------------------------------- */
@media (max-width: 1000px) {
  .mag-archive__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .mag-archive__grid {
    grid-template-columns: 1fr;
  }

  .mag-archive__timeline {
    padding-left: 1.2rem;
  }

  .mag-archive__spine,
  .mag-archive__spine-progress {
    left: 0.15rem;
  }

  .mag-archive__year-node {
    left: calc(-1.2rem + 0.15rem - 5px);
  }

  .mag-archive__node {
    left: calc(-1.2rem + 0.15rem - 3.5px);
  }

  .mag-archive__row {
    grid-template-columns: minmax(0, 1fr) 5.5rem;
    gap: var(--mag-space-sm);
  }
}
</style>
