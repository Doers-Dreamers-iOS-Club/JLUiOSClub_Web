import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { gsap } from 'gsap'

/** A single cover-to-article page turn, followed by ordinary document scrolling. */
export function useCourseCover(root: Ref<HTMLElement | null>) {
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
    let timeline: gsap.core.Timeline | undefined
    let entrance: gsap.core.Timeline | undefined
    let busy = false, destination = 0, focusAfter = false
    let lastWheel = 0, wheelTotal = 0, wheelUsed = false
    let previousScroll = scrollY, lastInput = 0, inputDirection = 0
    let touch: { x: number; y: number; direction: number; used: boolean } | undefined
    let refreshFrame = 0
    const navHeight = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--vp-nav-height')) || 64
    const boundary = () => journal.getBoundingClientRect().top + scrollY + body.offsetTop - navHeight()
    const fullCover = () => innerHeight >= 560 && cover.offsetHeight <= innerHeight - navHeight() + 8
    // Catch a gesture that crosses the boundary, not only an exact pixel match.
    const directionAt = (delta = 0) => scrollY <= 2 ? 1 : scrollY <= boundary() + Math.max(3, Math.abs(delta)) ? -1 : 0
    const blocked = (target: EventTarget | null) => target instanceof Element && !!target.closest('input,textarea,select,[contenteditable="true"],.VPNav,[role="dialog"]')
    const playEntrance = (delay = 0) => {
      entrance?.revert()
      delete journal.dataset.coverEntrance
      if (reduced.matches || document.hidden) return
      journal.dataset.coverEntrance = 'playing'
      entrance = gsap.timeline({ delay, defaults: { ease: 'power3.out' }, onComplete: () => { delete journal.dataset.coverEntrance } })
      entrance.fromTo(cover.querySelectorAll('h1 > span, .journal-cover__english > span'),
        { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .075, clearProps: 'transform,opacity' }, 0)
        .fromTo(cover.querySelectorAll('.journal-start, .journal-cover__links'),
          { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .06, clearProps: 'transform,opacity' }, .22)
        .fromTo(cover.querySelector('.journal-cover__asterisk'),
          { rotation: -25, scale: .85, opacity: 0 }, { rotation: 0, scale: 1, opacity: 1, duration: .9, clearProps: 'transform,opacity' }, .1)
    }
    const clearPanels = () => {
      gsap.set([...panels, ...inners], { clearProps: 'transform,opacity,visibility,willChange,zIndex' })
      panels.forEach(panel => { panel.inert = false })
      delete journal.dataset.coverTransition
      busy = false
    }
    const refresh = () => {
      cancelAnimationFrame(refreshFrame)
      refreshFrame = requestAnimationFrame(() => journal.dispatchEvent(new Event('course-cover-settled')))
    }
    const finish = () => {
      timeline?.kill(); timeline = undefined
      clearPanels()
      previousScroll = destination ? boundary() : 0
      window.scrollTo({ top: previousScroll, behavior: 'instant' })
      if (focusAfter) (destination ? body : cover.querySelector<HTMLElement>('h1'))?.focus({ preventScroll: true })
      refresh()
    }
    const go = (next: number, focus = false) => {
      if (busy) return
      destination = next; focusAfter = focus
      if (next) { entrance?.revert(); delete journal.dataset.coverEntrance }
      if (reduced.matches || !fullCover()) { finish(); if (!next) playEntrance(); return }
      busy = true
      if (touch) touch.used = true
      // A large wheel delta or touch inertia may cross the top of the article.
      // Align before the browser paints, then use the same continuous reveal.
      previousScroll = next ? 0 : boundary()
      window.scrollTo({ top: previousScroll, behavior: 'instant' })
      journal.dataset.coverTransition = next ? 'entering-content' : 'entering-cover'
      if (!next) playEntrance(.16)
      const direction = next ? 1 : -1
      const old = panels[1 - next], incoming = panels[next]
      const oldInner = inners[1 - next], incomingInner = inners[next]
      old.inert = true
      gsap.set([...panels, ...inners], { willChange: 'transform' })
      gsap.set(old, { zIndex: 1 })
      // Temporarily align both panels in the same viewport. At completion the
      // real document scroll replaces the visual offset in the same frame.
      gsap.set(incoming, { y: direction * -body.offsetTop, xPercent: direction * 100, zIndex: 2 })
      gsap.set(incomingInner, { xPercent: direction * -100 })
      timeline = gsap.timeline({ defaults: { duration: innerWidth <= 640 ? .62 : .85, ease: 'power2.inOut' }, onComplete: finish })
      timeline.to(old, { xPercent: direction * -100 }, 0)
        .to(oldInner, { xPercent: direction * 100 }, 0)
        .to(incoming, { xPercent: 0 }, 0)
        .to(incomingInner, { xPercent: 0 }, 0)
    }
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || blocked(event.target) || !fullCover()) return
      const now = performance.now()
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1)
      lastInput = now; inputDirection = Math.sign(delta)
      if (now - lastWheel > 180) { wheelTotal = 0; wheelUsed = false }
      lastWheel = now
      if (busy || wheelUsed) { event.preventDefault(); return }
      const direction = directionAt(delta)
      if (!direction || Math.sign(event.deltaY) !== direction) return
      event.preventDefault()
      if (document.documentElement.dataset.routeTransition) return
      if (Math.sign(delta) !== Math.sign(wheelTotal)) wheelTotal = 0
      wheelTotal += delta
      if (Math.abs(wheelTotal) < 36) return
      wheelUsed = true; go(direction > 0 ? 1 : 0)
    }
    const key = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || blocked(event.target) || !fullCover()) return
      if (event.target instanceof Element && event.target.closest('button')) return
      const direction = ['ArrowDown', 'PageDown', ' '].includes(event.key) && !event.shiftKey ? 1 : ['ArrowUp', 'PageUp'].includes(event.key) || (event.key === ' ' && event.shiftKey) ? -1 : 0
      const distance = event.key.startsWith('Arrow') ? 40 : innerHeight * .9
      if (!direction || (!busy && direction !== directionAt(direction * distance))) return
      event.preventDefault()
      if (!busy) go(direction > 0 ? 1 : 0, true)
    }
    const start = (event: TouchEvent) => {
      touch = event.touches.length === 1 && !blocked(event.target) ? { x: event.touches[0].clientX, y: event.touches[0].clientY, direction: directionAt(), used: false } : undefined
    }
    const move = (event: TouchEvent) => {
      if (!touch || event.touches.length !== 1 || !fullCover()) return
      const dx = touch.x - event.touches[0].clientX, dy = touch.y - event.touches[0].clientY
      if (Math.abs(dx) > Math.abs(dy)) return
      lastInput = performance.now(); inputDirection = Math.sign(dy)
      if (busy || touch.used) { event.preventDefault(); return }
      if (!touch.direction || Math.sign(dy) !== touch.direction) return
      if (Math.abs(dy) > 12) event.preventDefault()
      if (Math.abs(dy) < 50) return
      touch.used = true; go(dy > 0 ? 1 : 0)
    }
    const end = () => { touch = undefined }
    const scroll = () => {
      const current = scrollY, previous = previousScroll
      previousScroll = current
      if (busy || reduced.matches || !fullCover()) return
      if (inputDirection < 0 && performance.now() - lastInput < 1000 && previous >= boundary() - 3 && current < boundary() - 3) {
        wheelUsed = true
        go(0)
      } else if (current <= 2 && previous > 2) playEntrance()
    }
    const button = journal.querySelector<HTMLAnchorElement>('.journal-cover__next')!
    const click = (event: MouseEvent) => {
      if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
      event.preventDefault(); go(1, true)
    }
    const resize = () => { if (busy) finish(); else refresh() }
    const preference = () => { if (busy) finish(); entrance?.revert(); delete journal.dataset.coverEntrance }
    const visibility = () => { if (document.hidden) { if (busy) finish(); entrance?.progress(1) } }
    journal.addEventListener('wheel', wheel, { passive: false })
    journal.addEventListener('touchstart', start, { passive: true })
    journal.addEventListener('touchmove', move, { passive: false })
    journal.addEventListener('touchend', end)
    journal.addEventListener('touchcancel', end)
    button.addEventListener('click', click)
    window.addEventListener('keydown', key)
    window.addEventListener('scroll', scroll, { passive: true })
    window.addEventListener('resize', resize)
    reduced.addEventListener('change', preference)
    document.addEventListener('visibilitychange', visibility)
    if (scrollY < boundary()) playEntrance()
    dispose = () => {
      timeline?.kill(); clearPanels(); cancelAnimationFrame(refreshFrame)
      entrance?.revert(); delete journal.dataset.coverEntrance
      journal.removeEventListener('wheel', wheel)
      journal.removeEventListener('touchstart', start)
      journal.removeEventListener('touchmove', move)
      journal.removeEventListener('touchend', end)
      journal.removeEventListener('touchcancel', end)
      button.removeEventListener('click', click)
      window.removeEventListener('keydown', key)
      window.removeEventListener('scroll', scroll)
      window.removeEventListener('resize', resize)
      reduced.removeEventListener('change', preference)
      document.removeEventListener('visibilitychange', visibility)
    }
  })
}
