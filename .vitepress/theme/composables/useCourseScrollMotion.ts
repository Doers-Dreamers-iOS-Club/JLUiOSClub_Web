import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { gsap } from 'gsap'

/** Visual damping follows native scrolling; links, touch and history stay native. */
export function useCourseScrollMotion(root: Ref<HTMLElement | null>) {
  let disposed = false
  let dispose = () => {}
  onBeforeUnmount(() => { disposed = true; dispose() })
  onMounted(async () => {
    // Keep the scrolling plugin out of the initial homepage and static markup.
    const plugin = await import('gsap/ScrollTrigger').catch(() => null)
    if (!plugin || disposed) return
    const { ScrollTrigger } = plugin
    await document.fonts.ready
    if (disposed || !root.value) return
    const journal = root.value
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    media.add({ reduce: '(prefers-reduced-motion: reduce)', desktop: '(min-width: 641px)', mobile: '(max-width: 640px)' }, context => {
      if (context.conditions?.reduce) {
        if (!ScrollTrigger.getAll().length) ScrollTrigger.disable()
        return
      }
      ScrollTrigger.enable()
      const targets = Array.from(journal.querySelectorAll<HTMLElement>('.journal-section__head, .journal-chapter, .journal-feature, .journal-desk > *, .journal-related > a'))
      const motions = targets.map(target => gsap.fromTo(target, {
        y: context.conditions?.desktop ? 26 : 16, opacity: .45
      }, {
        y: 0, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: target, start: 'top 96%', end: 'top 74%', scrub: context.conditions?.desktop ? .65 : .4 }
      }))
      const focus = (event: FocusEvent) => {
        motions.forEach((motion, index) => {
          if (event.target instanceof Node && targets[index].contains(event.target)) {
            motion.scrollTrigger?.disable(false)
            motion.progress(1)
          }
        })
      }
      journal.addEventListener('focusin', focus)
      // Route entrances translate the content briefly; measure again at rest.
      const routeObserver = new MutationObserver(() => {
        if (!document.documentElement.dataset.routeTransition) ScrollTrigger.refresh()
      })
      routeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-route-transition'] })
      const coverSettled = () => ScrollTrigger.refresh()
      journal.addEventListener('course-cover-settled', coverSettled)
      return () => {
        journal.removeEventListener('focusin', focus)
        journal.removeEventListener('course-cover-settled', coverSettled)
        routeObserver.disconnect()
      }
    }, journal)
    dispose = () => {
      media.revert()
      if (!ScrollTrigger.getAll().length) ScrollTrigger.disable()
    }
  })
}
