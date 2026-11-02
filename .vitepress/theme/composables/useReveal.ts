import { gsap } from 'gsap'

let media: ReturnType<typeof gsap.matchMedia> | undefined

export function teardownReveal(): void {
  media?.revert()
  media = undefined
}

export function initReveal(): void {
  if (typeof window === 'undefined') return
  teardownReveal()
  const root = document.querySelector<HTMLElement>('.VPContent')
  if (!root) return
  media = gsap.matchMedia()
  media.add('(prefers-reduced-motion: no-preference)', context => {
    const lines = Array.from(root.querySelectorAll<HTMLElement>('[data-mag-line]'))
    const intro = Array.from(root.querySelectorAll<HTMLElement>('[data-mag-enter]'))
    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-mag-reveal], [data-mag-stagger] > *'))
      .filter(el => !el.closest('.mag-hero, .learning-illustration'))
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out', clearProps: 'transform,opacity,visibility' } })
    if (lines.length) timeline.from(lines, { yPercent: 105, duration: .75, stagger: .09 }, 0)
    if (intro.length) timeline.from(intro, { autoAlpha: 0, y: 8, duration: .55, stagger: .08 }, .1)
    let observer: IntersectionObserver | undefined
    const pending = new Set<HTMLElement>()
    if ('IntersectionObserver' in window) {
      context.add('reveal', (elements: HTMLElement[]) => {
        gsap.fromTo(elements, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .55, stagger: { amount: .14 }, ease: 'power3.out', clearProps: 'transform,opacity,visibility', overwrite: 'auto' })
        const artwork = elements.filter(el => el.hasAttribute('data-mag-art')).flatMap(el => Array.from(el.querySelectorAll('img')))
        if (artwork.length) gsap.fromTo(artwork, { scale: 1.045 }, { scale: 1, duration: 1.1, ease: 'power3.out', clearProps: 'transform' })
      })
      observer = new IntersectionObserver(entries => {
        const arrived = entries.filter(entry => entry.isIntersecting).map(entry => entry.target as HTMLElement).filter(el => pending.has(el))
        if (arrived.length) context.reveal(arrived)
        arrived.forEach(el => { pending.delete(el); observer?.unobserve(el) })
      }, { threshold: 0, rootMargin: '0px 0px 24px 0px' })
      const bounds = targets.map(el => ({ el, top: el.getBoundingClientRect().top }))
      bounds.forEach(({ el, top }) => {
        if (top >= window.innerHeight) {
          pending.add(el)
          gsap.set(el, { opacity: 0, y: 12 })
          observer?.observe(el)
        }
      })
    }
    const revealFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return
      for (const el of pending) {
        if (el.contains(event.target)) {
          gsap.set(el, { clearProps: 'transform,opacity,visibility' })
          pending.delete(el)
          observer?.unobserve(el)
        }
      }
    }
    root.addEventListener('focusin', revealFocus)
    return () => { observer?.disconnect(); root.removeEventListener('focusin', revealFocus) }
  }, root)
}
