import { nextTick, onBeforeUnmount, onMounted, type Ref } from 'vue'
import { gsap } from 'gsap'

/** Visual damping follows native scrolling; links, touch and history stay native. */
export function useCourseScrollMotion(root: Ref<HTMLElement | null>) {
  let disposed = false
  let dispose = () => {}
  onBeforeUnmount(() => { disposed = true; dispose() })
  onMounted(async () => {
    // Let the cover establish its state before deciding whether content is visible.
    await nextTick()
    const journal = root.value
    if (disposed || !journal) return
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    let media: ReturnType<typeof gsap.matchMedia> | undefined
    let scrollPlugin: typeof import('gsap/ScrollTrigger')['ScrollTrigger'] | undefined
    let pending = false, refreshFrame = 0
    const canMeasure = () => !document.hidden && journal.dataset.coursePage !== 'cover' &&
      !journal.dataset.coverTransition && !document.documentElement.dataset.routeTransition
    const refresh = () => {
      if (refreshFrame || !canMeasure()) return
      refreshFrame = requestAnimationFrame(() => {
        refreshFrame = 0
        if (!disposed && canMeasure()) scrollPlugin?.refresh()
      })
    }
    const sync = async () => {
      if (disposed || !canMeasure()) return
      if (media) { refresh(); return }
      if (pending || preference.matches) return
      pending = true
      // The cover needs neither ScrollTrigger's download nor its layout scans.
      const plugin = await import('gsap/ScrollTrigger').catch(() => null)
      await document.fonts.ready
      pending = false
      if (!plugin || disposed || !canMeasure() || preference.matches) return
      const { ScrollTrigger } = plugin
      scrollPlugin = ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)
      media = gsap.matchMedia()
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
        return () => journal.removeEventListener('focusin', focus)
      }, journal)
      refresh()
    }
    const stateObserver = new MutationObserver(() => { void sync() })
    stateObserver.observe(journal, { attributes: true, attributeFilter: ['data-course-page', 'data-cover-transition'] })
    stateObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-route-transition'] })
    journal.addEventListener('course-cover-settled', sync)
    document.addEventListener('visibilitychange', sync)
    preference.addEventListener('change', sync)
    dispose = () => {
      stateObserver.disconnect()
      cancelAnimationFrame(refreshFrame)
      journal.removeEventListener('course-cover-settled', sync)
      document.removeEventListener('visibilitychange', sync)
      preference.removeEventListener('change', sync)
      media?.revert()
      if (scrollPlugin && !scrollPlugin.getAll().length) scrollPlugin.disable()
    }
    void sync()
  })
}
