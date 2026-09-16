/**
 * 路由进入转场 —— 只做 enter，不做 leave
 * ---------------------------------------------------------------------------
 * VitePress 切换路由时不等待任何动画，before hook 里做淡出会与 DOM 替换
 * 竞争（闪跳）。所以只在新页面挂载后做一次 0.35s 的淡入上滑，
 * 配合 useReveal 的块级揭示，形成「翻页」的节奏。
 *
 * 用法：在 theme 的 setup() 里调用 initRouteEnter()。
 * 样式在 styles/motion.css（html.mag-enter .VPContent）。
 */

const ENTER_CLASS = 'mag-enter'
/** 超时兜底：无论 rAF 是否如期触发，class 都必须被移除 */
const FAILSAFE_MS = 600

export function initRouteEnter(): void {
  if (typeof window === 'undefined') return
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

  const root = document.documentElement
  root.classList.remove(ENTER_CLASS)
  // 强制 reflow 后加 class，让 transition 从隐藏态播到可见态
  void root.offsetWidth
  root.classList.add(ENTER_CLASS)

  const clear = () => root.classList.remove(ENTER_CLASS)
  requestAnimationFrame(() => requestAnimationFrame(clear))
  setTimeout(clear, FAILSAFE_MS)
}
