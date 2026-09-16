/**
 * 动效基座 —— 全站 motion-v 动画的 SSG 安全开关
 * ---------------------------------------------------------------------------
 * 职责：
 *   1. 客户端挂载标志（SSR / 未水合时为 false）
 *   2. prefers-reduced-motion 响应式监听（motion-v 没有提供对应 composable，
 *      这里自己包一层 matchMedia，与 useReveal 的判断口径一致）
 *
 * 核心约定（所有使用 motion-v 的组件都必须遵守）：
 *   SSR 输出的 HTML 永远是「可见终态」，隐藏态只在水合之后通过
 *   `:initial="animate ? 'hidden' : false"` 启用。
 *   绝对不要把 opacity: 0 之类的隐藏样式写进 SSR 输出——
 *   否则禁用 JS 或水合失败时页面空白。与 useReveal 的渐进增强哲学一致。
 */

import { computed, onMounted, onUnmounted, ref } from 'vue'

function useReducedMotion() {
  const reduced = ref(false)
  let mql: MediaQueryList | null = null
  const update = () => {
    reduced.value = mql?.matches === true
  }

  onMounted(() => {
    mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    update()
    mql.addEventListener?.('change', update)
  })

  onUnmounted(() => {
    mql?.removeEventListener?.('change', update)
    mql = null
  })

  return reduced
}

export function useMotionReady() {
  const ready = ref(false)
  const reduced = useReducedMotion()

  onMounted(() => {
    ready.value = true
  })

  /** animate 为 true 时才播动画：已挂载 且 用户未要求减弱动效 */
  const animate = computed(() => ready.value && !reduced.value)

  return { ready, reduced, animate }
}
