/**
 * 撕下转场编排 —— 「便利贴撕下来，下面的页面自然换成新页」
 * ---------------------------------------------------------------------------
 * 便签卡片（MagArchive 网格项 / MagCard）被点击时：
 *   1. 把被点的卡片克隆成一个 fixed 定位的「幽灵便签」挂在 <body> 上、
 *      原元素原地隐藏——幽灵从此独立于页面 DOM 存活；
 *   2. 幽灵播完整的撕下动画（.mag-note--tearing，见 motion.css）：
 *      拽住翘起的角向下撕 → 胶带脱胶回弹 → 甩出；
 *   3. 撕到脱胶时，页面上除便签外的一切整体淡出（html.mag-tear-leave），
 *      随即切路由——旧 DOM 销毁，但幽灵便签在 body 上继续飞；
 *   4. 新页面纯淡入（html.mag-enter-tear，useRouteEnter 分流），
 *      幽灵在新页面上方飞完最后一段才消散——换页显得是自然显现的。
 *
 * 时长常量与 motion.css 里的 keyframes / transition 一一对应，
 * 改一边要同步改另一边。
 */

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  )
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

/** 撕下动画总时长（0.75s），幽灵便签的存活时间 */
const TEAR_MS = 750
/** 旧页其余部分开始淡出的时机：撕到「脱胶回弹」（38% ≈ 285ms）附近 */
const LEAVE_START_MS = 260
/** 旧页淡出时长（与 html.mag-tear-leave 的 transition 同步） */
const LEAVE_FADE_MS = 300
/** 兜底：animationend 没触发时也必须回收幽灵、摘掉淡出 class */
const GHOST_FAILSAFE_MS = TEAR_MS + 400

let busy = false
let tearEnterPending = false

/**
 * 把源元素克隆成挂在 body 上的 fixed 幽灵，并原地隐藏源元素。
 * 幽灵带着 scoped 属性选择器和内联 --h，样式与原元素一致；
 * 之后路由切换销毁旧 DOM 也影响不到它。
 */
function makeGhost(source: HTMLElement): HTMLElement {
  const rect = source.getBoundingClientRect()
  const ghost = source.cloneNode(true) as HTMLElement
  ghost.classList.add('mag-note--tearing')
  Object.assign(ghost.style, {
    position: 'fixed',
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    margin: '0',
    zIndex: '400',
    pointerEvents: 'none'
  })
  document.body.appendChild(ghost)
  source.style.visibility = 'hidden'
  return ghost
}

export function useNoteTear() {
  /**
   * 完整的「撕下 → 换页」跳转。go 通常是 () => router.go(url)，
   * source 是被点的卡片元素（幽灵从它克隆）。
   * 用户要求减弱动效、或上一次撕下还没播完时，直接跳转。
   */
  async function tearTo(
    go: () => void | Promise<void>,
    source?: HTMLElement
  ): Promise<void> {
    if (prefersReducedMotion() || busy || !source) {
      await go()
      return
    }
    busy = true
    const root = document.documentElement
    const ghost = makeGhost(source)

    // 幽灵播完主撕下动画即回收；animationend 也会因伪元素动画触发，
    // 必须按 animationName 过滤。另设兜底定时器。
    const retire = () => {
      ghost.remove()
      if (source.isConnected) source.style.visibility = ''
      root.classList.remove('mag-tear-leave')
    }
    ghost.addEventListener('animationend', (e) => {
      if (e.animationName === 'mag-note-tear') retire()
    })
    setTimeout(retire, GHOST_FAILSAFE_MS)

    try {
      await sleep(LEAVE_START_MS)
      root.classList.add('mag-tear-leave')
      await sleep(LEAVE_FADE_MS)
      // 告诉 useRouteEnter：下一页用淡化入场
      tearEnterPending = true
      await go()
    } finally {
      busy = false
    }
  }

  return { tearTo }
}

/**
 * useRouteEnter 专用：取走「下一页淡化入场」标志（一次性）。
 * 返回 true 表示这次路由进入是撕下转场的下半场。
 */
export function consumeTearEnter(): boolean {
  const pending = tearEnterPending
  tearEnterPending = false
  return pending
}
