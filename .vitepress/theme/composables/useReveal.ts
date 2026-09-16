/**
 * 滚动揭示 —— 全站统一的入场动效
 * ---------------------------------------------------------------------------
 * 为什么用选择器扫描而不是 Vue 指令：markdown 生成的 h2 / p / ul 是由
 * markdown-it 渲染出来的原生元素，挂不上指令，只能在挂载后扫描 DOM。
 *
 * 两类目标：
 *   1. `.vp-doc > *`            —— markdown 的顶层区块
 *   2. `[data-mag-stagger] > *` —— 组件自己声明的错落分组（如 MagGrid 的卡片）
 *
 * 渐进增强：隐藏态（.mag-reveal）由本文件添加，CSS 不预先隐藏。
 * JS 挂了或被禁用时页面照常可读。
 */

const REVEAL = 'mag-reveal'
const REVEAL_IN = 'mag-in'
const MARK = 'data-mag-observed'

/** 一批同时进入视口的元素，最多错落几级——再多就显得拖沓 */
const MAX_STAGGER_STEPS = 5

/** 这些标签不参与动效：要么不可见，要么动了会出问题 */
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'TEMPLATE', 'BR', 'HR'])

let observer: IntersectionObserver | null = null

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  )
}

function stagger(el: HTMLElement, step: number): void {
  const capped = Math.min(step, MAX_STAGGER_STEPS)
  el.style.setProperty('--mag-reveal-delay', `${capped * 65}ms`)
}

function collectTargets(root: ParentNode): HTMLElement[] {
  const seen = new Set<HTMLElement>()
  const push = (el: Element) => {
    if (!(el instanceof HTMLElement)) return
    if (SKIP_TAGS.has(el.tagName)) return
    if (el.hasAttribute(MARK)) return
    if (el.classList.contains('mag-no-reveal')) return
    seen.add(el)
  }

  root.querySelectorAll('.vp-doc > *').forEach(push)
  root.querySelectorAll('[data-mag-stagger] > *').forEach(push)
  // 首页刊头与特性卡：首屏被 ASCII logo 独占，它们滚动进入视口才出现
  root.querySelectorAll('.VPHome .VPHero, .VPHome .VPFeature').forEach(push)

  return [...seen]
}

/**
 * 扫描并开始观察当前页面。可重复调用（路由切换时会重新扫描）。
 */
export function initReveal(): void {
  if (typeof window === 'undefined') return

  // 系统要求减弱动效时，什么都不做——内容保持原样，完全可见
  if (prefersReducedMotion()) return

  if (!('IntersectionObserver' in window)) return

  observer ??= new IntersectionObserver(
    (entries) => {
      // 同一批进入视口的元素按文档顺序错落，形成"翻页"的节奏。
      // 单个元素滚入时 batch 只有 1 个，延迟为 0，不会显得迟钝。
      const arrived = entries
        .filter((e) => e.isIntersecting)
        .map((e) => e.target as HTMLElement)
        .sort((a, b) =>
          a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
            ? -1
            : 1
        )

      arrived.forEach((el, i) => {
        stagger(el, i)
        el.classList.add(REVEAL_IN)
        observer?.unobserve(el)
      })
    },
    {
      // 元素露出约 8% 即触发，配合底部负 margin，避免刚冒头就播完动画
      threshold: 0.08,
      rootMargin: '0px 0px -6% 0px'
    }
  )

  for (const el of collectTargets(document)) {
    el.setAttribute(MARK, '')
    el.classList.add(REVEAL)
    observer.observe(el)
  }
}

/** 路由离开 / 组件卸载时释放观察器 */
export function teardownReveal(): void {
  observer?.disconnect()
  observer = null
}
