import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { gsap } from 'gsap'
import { addCourseLiquidFill } from './courseLiquidFill'

/** Two real page states: a cover, then an article whose native scroll starts at zero. */
export function useCourseCover(root: Ref<HTMLElement | null>, options: {
  contentId?: string
  coverId?: string
  animateEntrance?: (timeline: gsap.core.Timeline, cover: HTMLElement) => void
} = {}) {
  const contentId = options.contentId || 'course-content'
  const coverHash = '#' + (options.coverId || 'course-cover')
  let dispose = () => {}
  onBeforeUnmount(() => dispose())
  onMounted(() => {
    const journal = root.value
    const cover = journal?.querySelector<HTMLElement>('.journal-cover')
    const body = journal?.querySelector<HTMLElement>('.journal-body')
    if (!journal || !cover || !body) return
    const panels = [cover, body]
    const inners = panels.map(panel => panel.firstElementChild as HTMLElement)
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let timeline: gsap.core.Timeline | undefined, entrance: gsap.core.Timeline | undefined
    let page = location.hash && location.hash !== coverHash ? 1 : 0
    let enabled = false, busy = false, focusAfter = false
    let previousScroll = scrollY, lastWheel = 0, wheelTotal = 0, lockedDirection = 0
    let refreshFrame = 0, armFrame = 0, armed = false
    const arm = (alignContent = false) => {
      armed = false; cancelAnimationFrame(armFrame)
      armFrame = requestAnimationFrame(() => {
        armFrame = requestAnimationFrame(() => {
          // A native hash jump may have measured the SSR body below the cover.
          // Cancel that old smooth-scroll destination once the two panels settle;
          // keep explicit history scroll positions and deeper section anchors.
          if (alignContent && enabled && page === 1 && location.hash === '#' + contentId && !history.state?.scrollPosition) {
            window.scrollTo({ top: 0, behavior: 'instant' })
          }
          previousScroll = scrollY; armed = true
        })
      })
    }
    let touch: { x: number; y: number; used: boolean } | undefined
    const navHeight = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--vp-nav-height')) || 64
    const fits = () => innerHeight >= 560 && cover.offsetHeight <= innerHeight - navHeight() + 8
    const blocked = (target: EventTarget | null) =>
      !!document.querySelector('.VPNavScreen.open,.VPLocalSearchBox,.DocSearch-Modal') ||
      target instanceof Element && !!target.closest('input,textarea,select,[contenteditable="true"],.VPNav,[role="dialog"]')
    const nestedScroll = (target: EventTarget | null, delta: number) => {
      let element = target instanceof Element ? target : null
      while (element && element !== document.body && element !== document.documentElement) {
        if (element instanceof HTMLElement && /(auto|scroll)/.test(getComputedStyle(element).overflowY) && element.scrollHeight > element.clientHeight + 1) {
          if (delta > 0 ? element.scrollTop + element.clientHeight < element.scrollHeight - 1 : element.scrollTop > 0) return true
        }
        element = element.parentElement
      }
      return false
    }
    const refresh = () => {
      cancelAnimationFrame(refreshFrame)
      refreshFrame = requestAnimationFrame(() => journal.dispatchEvent(new Event('course-cover-settled')))
    }
    const playEntrance = (delay = 0) => {
      entrance?.revert()
      delete journal.dataset.coverEntrance
      if (reduced.matches || document.hidden) return
      journal.dataset.coverEntrance = 'playing'
      entrance = gsap.timeline({ delay, defaults: { ease: 'power3.out' }, onComplete: () => { delete journal.dataset.coverEntrance } })
      if (options.animateEntrance) { options.animateEntrance(entrance, cover); return }
      entrance.fromTo(cover.querySelector('.journal-masthead__rule'),
        { scaleX: 0, willChange: 'transform' }, { scaleX: 1, duration: 1, ease: 'power2.inOut', clearProps: 'transform,willChange' }, 0)
        .fromTo(cover.querySelectorAll('.journal-title-line > span'),
          { yPercent: 110, rotation: 3, opacity: .2 }, { yPercent: 0, rotation: 0, opacity: 1, duration: .95, stagger: .12, clearProps: 'transform,opacity' }, .08)
        .fromTo(cover.querySelectorAll('.journal-word--hello .journal-glyph'),
          { yPercent: 115, rotationX: -65, rotation: 5, opacity: 0 },
          { yPercent: 0, rotationX: 0, rotation: 0, opacity: 1, duration: 1, stagger: .055, clearProps: 'transform,opacity' }, .14)
        .fromTo(cover.querySelectorAll('.journal-word--world .journal-glyph'),
          { yPercent: 105, rotation: 1.5, opacity: 0, willChange: 'transform,opacity' },
          { yPercent: 0, rotation: 0, opacity: 1, duration: 1.05, stagger: .045, clearProps: 'transform,opacity,willChange' }, .22)
        .fromTo(cover.querySelectorAll('.journal-start, .journal-cover__links, .journal-cover__next'),
          { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .65, stagger: .08, clearProps: 'transform,opacity' }, .4)
        .fromTo(cover.querySelector('.journal-cover__asterisk'),
          { rotation: -110, scale: .5, opacity: 0 }, { rotation: 0, scale: 1, opacity: 1, duration: 1.05, clearProps: 'transform,opacity' }, .32)
      addCourseLiquidFill(entrance, cover)
    }
    const updateState = () => {
      if (enabled) journal.dataset.coursePage = page ? 'content' : 'cover'
      else delete journal.dataset.coursePage
      panels.forEach((panel, index) => { panel.inert = enabled && index !== page })
    }
    const clearPanels = () => {
      gsap.set([...panels, ...inners], { clearProps: 'transform,opacity,visibility,willChange,zIndex' })
      delete journal.dataset.coverTransition
      updateState()
    }
    const rememberPage = () => {
      const url = new URL(location.href)
      url.hash = page ? contentId : ''
      history.replaceState(history.state, '', url)
    }
    const finish = () => {
      timeline?.kill(); timeline = undefined
      clearPanels()
      previousScroll = 0
      window.scrollTo({ top: 0, behavior: 'instant' })
      busy = false
      if (focusAfter) (page ? body : cover.querySelector<HTMLElement>('h1'))?.focus({ preventScroll: true })
      refresh()
    }
    const go = (next: number, focus = false, remember = true) => {
      if (busy || enabled && page === next) return
      focusAfter = focus
      if (!enabled) {
        body.scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth', block: 'start' })
        return
      }
      const previous = page
      busy = true; page = next; previousScroll = 0
      if (touch) touch.used = true
      if (remember) rememberPage()
      window.scrollTo({ top: 0, behavior: 'instant' })
      updateState()
      if (next) { entrance?.revert(); delete journal.dataset.coverEntrance }
      else playEntrance(.16)
      if (reduced.matches) { finish(); return }
      journal.dataset.coverTransition = next ? 'entering-content' : 'entering-cover'
      const direction = next ? 1 : -1
      gsap.set([...panels, ...inners], { willChange: 'transform' })
      gsap.set(panels[previous], { autoAlpha: 1, zIndex: 1 })
      gsap.set(panels[next], { autoAlpha: 1, xPercent: direction * 100, zIndex: 2 })
      gsap.set(inners[next], { xPercent: direction * -100 })
      timeline = gsap.timeline({ defaults: { duration: innerWidth <= 640 ? .62 : .85, ease: 'power2.inOut' }, onComplete: finish })
      timeline.to(panels[previous], { xPercent: direction * -100 }, 0)
        .to(inners[previous], { xPercent: direction * 100 }, 0)
        .to(panels[next], { xPercent: 0 }, 0)
        .to(inners[next], { xPercent: 0 }, 0)
    }
    const wheel = (event: WheelEvent) => {
      if (!enabled || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || blocked(event.target) || nestedScroll(event.target, event.deltaY)) return
      const now = performance.now()
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1)
      const direction = Math.sign(delta)
      // Momentum may continue after a turn. A deliberate reversal is a new gesture.
      if (now - lastWheel > 160 || direction !== lockedDirection) lockedDirection = 0
      if (now - lastWheel > 450 || Math.sign(wheelTotal) !== direction) wheelTotal = 0
      lastWheel = now
      if (busy) { event.preventDefault(); return }
      // Once the article is shown, continued downward input is ordinary scroll,
      // even during the same gesture. The SVG never owns or blocks navigation.
      if (page === 1 && direction > 0) { lockedDirection = 0; wheelTotal = 0; return }
      if (lockedDirection === direction) { event.preventDefault(); return }
      if (page === 1 && scrollY > 1) { wheelTotal = 0; return }
      if (page === 0 && direction < 0 || page === 1 && direction > 0) return
      event.preventDefault()
      if (document.documentElement.dataset.routeTransition) return
      wheelTotal += delta
      if (Math.abs(wheelTotal) < (page ? 18 : 32)) return
      lockedDirection = direction; wheelTotal = 0
      go(page ? 0 : 1)
    }
    const scroll = () => {
      const current = Math.max(0, scrollY), previous = previousScroll
      previousScroll = current
      if (!enabled || !armed || busy || blocked(document.activeElement)) return
      // The article really starts at scrollY=0. No predicted offsets, time window,
      // pointer-position dependency, or chance of switching before the top.
      if (page === 1 && previous > 1 && current <= 1) {
        lockedDirection = -1
        go(0)
      }
    }
    const key = (event: KeyboardEvent) => {
      if (!enabled || event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || blocked(event.target)) return
      if (event.target instanceof Element && event.target.closest('button')) return
      const direction = ['ArrowDown', 'PageDown', ' '].includes(event.key) && !event.shiftKey ? 1 : ['ArrowUp', 'PageUp'].includes(event.key) || event.key === ' ' && event.shiftKey ? -1 : 0
      if (!direction || !busy && (page === 1 && scrollY > 1 || direction !== (page ? -1 : 1))) return
      event.preventDefault()
      if (!busy) go(page ? 0 : 1, true)
    }
    const start = (event: TouchEvent) => {
      touch = event.touches.length === 1 && !blocked(event.target) ? { x: event.touches[0].clientX, y: event.touches[0].clientY, used: false } : undefined
    }
    const move = (event: TouchEvent) => {
      if (!enabled || !touch || event.touches.length !== 1) return
      const dx = touch.x - event.touches[0].clientX, dy = touch.y - event.touches[0].clientY
      if (Math.abs(dx) > Math.abs(dy) || nestedScroll(event.target, dy)) return
      if (busy || touch.used) { event.preventDefault(); return }
      if (page === 1 && scrollY > 1 || Math.sign(dy) !== (page ? -1 : 1)) return
      if (Math.abs(dy) > 12) event.preventDefault()
      if (Math.abs(dy) >= 44) go(page ? 0 : 1)
    }
    const end = () => { touch = undefined }
    const button = journal.querySelector<HTMLAnchorElement>('.journal-cover__next')!
    const click = (event: MouseEvent) => {
      if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
      event.preventDefault(); go(1, true)
    }
    const resize = () => {
      if (busy) finish()
      const shouldEnable = fits()
      if (enabled !== shouldEnable) {
        const oldY = scrollY
        if (shouldEnable) page = location.hash || oldY >= cover.offsetHeight ? 1 : 0
        enabled = shouldEnable; updateState()
        previousScroll = page ? Math.max(0, oldY + (enabled ? -cover.offsetHeight : cover.offsetHeight)) : 0
        window.scrollTo({ top: previousScroll, behavior: 'instant' })
      }
      refresh()
    }
    const hash = () => {
      arm(true)
      const next = location.hash && location.hash !== coverHash ? 1 : 0
      if (enabled && next !== page) go(next, false, false)
    }
    const preference = () => { if (busy) finish(); entrance?.revert(); delete journal.dataset.coverEntrance }
    const visibility = () => { if (document.hidden) { if (busy) finish(); entrance?.progress(1) } }
    enabled = fits(); updateState()
    arm(true)
    // Listen on the viewport so a trackpad over the page margins behaves identically.
    window.addEventListener('wheel', wheel, { passive: false })
    window.addEventListener('touchstart', start, { passive: true })
    window.addEventListener('touchmove', move, { passive: false })
    window.addEventListener('touchend', end)
    window.addEventListener('touchcancel', end)
    window.addEventListener('scroll', scroll, { passive: true })
    window.addEventListener('keydown', key)
    window.addEventListener('resize', resize)
    window.addEventListener('hashchange', hash)
    button.addEventListener('click', click)
    reduced.addEventListener('change', preference)
    document.addEventListener('visibilitychange', visibility)
    if (!page) playEntrance()
    dispose = () => {
      timeline?.kill(); entrance?.revert(); cancelAnimationFrame(refreshFrame); cancelAnimationFrame(armFrame)
      enabled = false; clearPanels(); delete journal.dataset.coverEntrance
      window.removeEventListener('wheel', wheel)
      window.removeEventListener('touchstart', start)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('touchend', end)
      window.removeEventListener('touchcancel', end)
      window.removeEventListener('scroll', scroll)
      window.removeEventListener('keydown', key)
      window.removeEventListener('resize', resize)
      window.removeEventListener('hashchange', hash)
      button.removeEventListener('click', click)
      reduced.removeEventListener('change', preference)
      document.removeEventListener('visibilitychange', visibility)
    }
  })
}
