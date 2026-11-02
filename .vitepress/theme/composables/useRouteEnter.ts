/**
 * 路由进入转场 —— 只做 enter，不做 leave
 * ---------------------------------------------------------------------------
 * VitePress 切换路由时不等待任何动画，before hook 里做淡出会与 DOM 替换
 * 竞争（闪跳）。所以只在新页面挂载后做一次 0.35s 的淡入上滑，
 * 配合 useReveal 的块级揭示，形成「翻页」的节奏。
 *
 * 例外：便签卡片触发的撕下转场（composables/useNoteTear.ts）会置一个
 * 一次性标志，这时改用纯淡入（html.mag-enter-tear，没有上滑位移），
 * 并负责摘掉旧页面的淡出 class（html.mag-tear-leave），与撕下动画衔接。
 *
 * 用法：在 theme 的 setup() 里调用 initRouteEnter()。
 * 样式在 styles/motion.css（html.mag-enter / html.mag-enter-tear .VPContent）。
 */

import { consumeTearEnter } from './useNoteTear'

const ENTER_CLASS = 'mag-enter'
const ENTER_TEAR_CLASS = 'mag-enter-tear'
const LEAVE_TEAR_CLASS = 'mag-tear-leave'
/** 超时兜底：无论 rAF 是否如期触发，class 都必须被移除 */
const FAILSAFE_MS = 600

export function initRouteEnter(): void {
  if (typeof window === 'undefined') return
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

  const root = document.documentElement
  const isTear = consumeTearEnter()
  const enterClass = isTear ? ENTER_TEAR_CLASS : ENTER_CLASS

  root.classList.remove(enterClass)
  // 强制 reflow 后加 class，让 transition 从隐藏态播到可见态
  void root.offsetWidth
  root.classList.add(enterClass)
  if (isTear) {
    // 淡化入场期间由 enter class 接管隐藏态，旧页的淡出 class 可以安全摘掉
    root.classList.remove(LEAVE_TEAR_CLASS)
  }

  const clear = () => root.classList.remove(enterClass)
  requestAnimationFrame(() => requestAnimationFrame(clear))
  setTimeout(clear, FAILSAFE_MS)
}
