import { nextTick, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { gsap } from 'gsap'

export function useFullPage(root: Ref<HTMLElement | null>) {
  const active = ref(0)
  const enabled = ref(false)
  const busy = ref(false)
  const asciiAvailable = ref(true)
  let media: ReturnType<typeof gsap.matchMedia> | undefined
  let changePage = (_index: number, _focus = false, _instant = false) => {}

  onMounted(() => {
    const host = root.value
    if (!host) return
    const pages = Array.from(host.querySelectorAll<HTMLElement>('[data-club-page]'))
    const ids = pages.map(page => page.id)
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fromHash = () => {
      const hash = location.hash.slice(1)
      return ids.indexOf(hash === 'club-title' ? 'start' : hash)
    }
    const initial = fromHash()
    if (initial >= 0) active.value = initial
    media = gsap.matchMedia()
    media.add('(min-height: 560px)', context => {
      enabled.value = true
      let alive = true
      let alignmentFrame = 0
      nextTick(() => {
        if (!alive) return
        alignmentFrame = requestAnimationFrame(() => {
          alignmentFrame = requestAnimationFrame(() => { if (alive) window.scrollTo({ top: 0, behavior: 'instant' }) })
        })
      })
      let timeline: gsap.core.Timeline | undefined
      let lastWheel = 0
      let wheelTotal = 0
      let wheelUsed = false
      let touch: { x: number; y: number; used: boolean } | undefined
      const inners = pages.map(page => page.querySelector<HTMLElement>('.club-page__inner')!)
      const contents = pages.flatMap(page => Array.from(page.querySelectorAll<HTMLElement>('[data-page-content]')))
      const images = pages.flatMap(page => Array.from(page.querySelectorAll<HTMLElement>('.club-art img')))
      const poemLines = Array.from(host.querySelectorAll<HTMLElement>('.club-opening__poem > span'))
      const minimum = () => asciiAvailable.value ? 0 : 1
      const updateHash = () => history.replaceState(history.state, '', `#${ids[active.value]}`)
      const settle = () => {
        timeline?.kill()
        pages.forEach((page, index) => {
          gsap.set(page, { xPercent: 0, autoAlpha: index === active.value ? 1 : 0, clearProps: 'willChange,zIndex' })
          page.inert = index !== active.value
          page.setAttribute('aria-hidden', String(index !== active.value))
        })
        gsap.set(inners, { clearProps: 'transform,willChange' })
        gsap.set([...contents, ...images], { clearProps: 'transform,opacity,visibility' })
        gsap.set(poemLines, { clearProps: 'transform,opacity,visibility,willChange' })
        busy.value = false
      }
      context.add('settle', settle)
      context.settle()
      const go = (requested: number, focus = false, instant = false) => {
        const next = Math.max(minimum(), Math.min(pages.length - 1, requested))
        if (busy.value && !instant) return
        if (next === active.value) { window.scrollTo({ top: 0, behavior: 'instant' }); return }
        context.settle()
        const previous = active.value
        const direction = Math.sign(next - previous)
        const oldPage = pages[previous]
        const newPage = pages[next]
        const shouldFocus = focus || oldPage.contains(document.activeElement)
        active.value = next
        window.scrollTo({ top: 0, behavior: 'instant' })
        updateHash()
        if (document.activeElement instanceof HTMLElement && oldPage.contains(document.activeElement)) document.activeElement.blur()
        oldPage.inert = true
        oldPage.setAttribute('aria-hidden', 'true')
        newPage.inert = false
        newPage.setAttribute('aria-hidden', 'false')
        const finish = () => {
          context.settle()
          if (shouldFocus) (newPage.querySelector<HTMLElement>('h1,h2') || newPage).focus({ preventScroll: true })
        }
        if (instant || motion.matches) { finish(); return }
        busy.value = true
        const duration = window.innerWidth <= 700 ? .6 : .9
        gsap.set([oldPage, newPage, inners[previous], inners[next]], { willChange: 'transform' })
        gsap.set(oldPage, { zIndex: 1 })
        gsap.set(newPage, { autoAlpha: 1, xPercent: direction * 100, zIndex: 2 })
        gsap.set(inners[next], { xPercent: direction * -100 })
        timeline = gsap.timeline({ defaults: { duration, ease: 'power2.inOut' }, onComplete: finish })
        timeline.to(oldPage, { xPercent: direction * -100 }, 0)
          .to(inners[previous], { xPercent: direction * 100 }, 0)
          .to(newPage, { xPercent: 0 }, 0)
          .to(inners[next], { xPercent: 0 }, 0)
        if (previous === 0 || next === 0) gsap.set(poemLines, { willChange: 'transform,opacity' })
        if (previous === 0) timeline.to(poemLines, {
          yPercent: -18, x: -24, autoAlpha: 0, duration: duration * .48,
          stagger: duration * .065, ease: 'power2.in'
        }, 0)
        if (next === 0) timeline.fromTo(poemLines,
          { yPercent: 24, x: 18, autoAlpha: 0 },
          { yPercent: 0, x: 0, autoAlpha: 1, duration: duration * .62, stagger: duration * .08, ease: 'power3.out' },
          duration * .2
        )
        const content = newPage.querySelector<HTMLElement>('[data-page-content]')
        const image = newPage.querySelector<HTMLElement>('.club-art img')
        if (content) timeline.fromTo(content, { y: direction * 18, opacity: 0 }, { y: 0, opacity: 1, duration: .45, ease: 'power3.out' }, duration * .55)
        if (image) timeline.fromTo(image, { scale: 1.025 }, { scale: 1, duration: duration + .15, ease: 'power2.out' }, 0)
      }
      context.add('go', go)
      changePage = (index, focus = false, instant = false) => context.go(index, focus, instant)
      const scrollable = (target: EventTarget | null, direction: number) => {
        let node = target instanceof HTMLElement ? target : null
        while (node && node !== host) {
          const overflow = getComputedStyle(node).overflowY
          if (/(auto|scroll)/.test(overflow) && node.scrollHeight > node.clientHeight + 1) {
            if (direction > 0 ? node.scrollTop + node.clientHeight < node.scrollHeight - 2 : node.scrollTop > 1) return true
          }
          node = node.parentElement
        }
        return false
      }
      const wheel = (event: WheelEvent) => {
        if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || scrollable(event.target, event.deltaY)) return
        if (!busy.value && window.scrollY > 1) return
        const now = performance.now()
        if (now - lastWheel > 180) { wheelTotal = 0; wheelUsed = false }
        lastWheel = now
        if (!busy.value && !wheelUsed && active.value === pages.length - 1 && event.deltaY > 0) return
        event.preventDefault()
        if (busy.value || wheelUsed) return
        const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1)
        if (Math.sign(delta) !== Math.sign(wheelTotal)) wheelTotal = 0
        wheelTotal += delta
        if (Math.abs(wheelTotal) < 36) return
        wheelUsed = true
        changePage(active.value + Math.sign(wheelTotal))
      }
      const key = (event: KeyboardEvent) => {
        if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return
        const target = event.target as HTMLElement
        if (target.closest('input,textarea,select,button,a,[contenteditable="true"],.VPNav,[role="dialog"]') || document.querySelector('.VPNavScreen.open,.VPLocalSearchBox,.DocSearch-Modal')) return
        let next: number | undefined
        if (['ArrowDown', 'PageDown', ' '].includes(event.key)) next = active.value + (event.shiftKey ? -1 : 1)
        if (['ArrowUp', 'PageUp'].includes(event.key)) next = active.value - 1
        if (event.key === 'Home') next = minimum()
        if (event.key === 'End') next = pages.length - 1
        if (next === undefined || scrollable(target, next - active.value)) return
        if (!busy.value && next >= pages.length) return
        event.preventDefault()
        changePage(next, true)
      }
      const touchStart = (event: TouchEvent) => {
        touch = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY, used: false } : undefined
      }
      const touchMove = (event: TouchEvent) => {
        if (!touch || event.touches.length !== 1) return
        const dx = touch.x - event.touches[0].clientX
        const dy = touch.y - event.touches[0].clientY
        if (Math.abs(dx) >= Math.abs(dy) || scrollable(event.target, dy)) return
        if (Math.abs(dy) > 12) event.preventDefault()
        if (Math.abs(dy) < 60 || touch.used) return
        touch.used = true
        changePage(active.value + Math.sign(dy))
      }
      const touchEnd = () => { touch = undefined }
      const click = (event: MouseEvent) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]')
        if (!link) return
        const hash = link.getAttribute('href')!.slice(1)
        const index = ids.indexOf(hash === 'club-title' ? 'start' : hash)
        if (index < 0) return
        event.preventDefault()
        event.stopPropagation()
        changePage(index, true)
      }
      const hashChange = () => { const index = fromHash(); if (index >= 0) changePage(index, true, true) }
      const motionChange = () => { if (motion.matches) context.settle() }
      const ascii = host.querySelector('.mag-ascii-hero')
      const checkAscii = () => {
        asciiAvailable.value = !ascii?.classList.contains('is-failed')
        if (!asciiAvailable.value && active.value === 0) changePage(1, false, true)
      }
      const asciiObserver = new MutationObserver(checkAscii)
      if (ascii) asciiObserver.observe(ascii, { attributes: true, attributeFilter: ['class'] })
      checkAscii()
      host.addEventListener('wheel', wheel, { passive: false })
      host.addEventListener('touchstart', touchStart, { passive: true })
      host.addEventListener('touchmove', touchMove, { passive: false })
      host.addEventListener('touchend', touchEnd)
      host.addEventListener('touchcancel', touchEnd)
      host.addEventListener('click', click)
      document.addEventListener('keydown', key)
      window.addEventListener('hashchange', hashChange)
      motion.addEventListener('change', motionChange)
      return () => {
        alive = false
        cancelAnimationFrame(alignmentFrame)
        timeline?.kill()
        asciiObserver.disconnect()
        host.removeEventListener('wheel', wheel)
        host.removeEventListener('touchstart', touchStart)
        host.removeEventListener('touchmove', touchMove)
        host.removeEventListener('touchend', touchEnd)
        host.removeEventListener('touchcancel', touchEnd)
        host.removeEventListener('click', click)
        document.removeEventListener('keydown', key)
        window.removeEventListener('hashchange', hashChange)
        motion.removeEventListener('change', motionChange)
        pages.forEach(page => { page.inert = false; page.removeAttribute('aria-hidden') })
        enabled.value = false
        busy.value = false
        changePage = () => {}
      }
    }, host)
  })
  onBeforeUnmount(() => media?.revert())
  return { active, enabled, busy, asciiAvailable, navigate: (index: number) => changePage(index) }
}
