import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { gsap } from 'gsap'

export function animateOverviewEntrance(timeline: gsap.core.Timeline, cover: HTMLElement) {
  // Measure paths before any tween writes styles and invalidates SVG layout.
  const paths = Array.from(cover.querySelectorAll<SVGGeometryElement>('[data-cover-line]'))
  const lengths = paths.map(path => path.getTotalLength())
  timeline.fromTo(cover.querySelector('.overview-rule'), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power2.inOut', clearProps: 'transform' }, 0)
    .fromTo(cover.querySelectorAll('.overview-title-line > span'), { yPercent: 110, rotation: 3, opacity: .2 }, { yPercent: 0, rotation: 0, opacity: 1, duration: 1, stagger: .13, clearProps: 'transform,opacity' }, .08)
    .fromTo(cover.querySelectorAll('.overview-start,.overview-secondary,.overview-next'), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .65, stagger: .08, clearProps: 'transform,opacity' }, .4)
  const letters = cover.querySelectorAll('.overview-letter')
  if (letters.length) timeline.fromTo(letters, { yPercent: 110, rotation: 4, opacity: 0 }, { yPercent: 0, rotation: 0, opacity: 1, duration: 1.1, stagger: .045, clearProps: 'transform,opacity' }, .16)
  const mark = cover.querySelector('.overview-mark')
  if (mark) timeline.fromTo(mark, { rotation: -100, scale: .6, opacity: 0 }, { rotation: 0, scale: 1, opacity: 1, duration: 1.2, clearProps: 'transform,opacity' }, .35)
  const pieces = cover.querySelectorAll('[data-cover-piece]')
  if (pieces.length) timeline.fromTo(pieces, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: .12, clearProps: 'transform,opacity' }, .18)
  const pegs = cover.querySelectorAll('[data-cover-peg]')
  if (pegs.length) timeline.fromTo(pegs, { y: -24, scale: .7, opacity: 0, transformOrigin: '50% 50%' }, { y: 0, scale: 1, opacity: 1, duration: .85, stagger: .09, clearProps: 'transform,opacity,transformOrigin' }, .6)
  paths.forEach((path, i) => {
    const length = lengths[i]
    timeline.fromTo(path, { strokeDasharray: `${length} ${length}`, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 1.25, ease: 'sine.inOut', clearProps: 'strokeDasharray,strokeDashoffset' }, .35 + i * .12)
  })
}

/** Each illustration owns its composition; data attributes only share playback rules. */
export function useOverviewArtworkMotion(root: Ref<HTMLElement | null>) {
  let media: ReturnType<typeof gsap.matchMedia> | undefined
  onBeforeUnmount(() => media?.revert())
  onMounted(() => {
    const figure = root.value
    if (!figure || !('IntersectionObserver' in window)) return
    const journal = figure.closest<HTMLElement>('.activity-journal')
    media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', context => {
      let visible = false
      figure.dataset.artState = 'waiting'
      let timeline: gsap.core.Timeline | undefined
      // A paused fromTo still measures and writes its starting values. Build it
      // only when the illustration is visible, inside the GSAP cleanup context.
      context.add('prepare', () => {
        const paths = Array.from(figure.querySelectorAll<SVGPathElement>('[data-art-draw]'))
        const lengths = paths.map(path => path.getTotalLength())
        const motion = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' }, onStart: () => { figure.dataset.artState = 'playing' }, onComplete: () => { figure.dataset.artState = 'complete' } })
        const reveals = figure.querySelectorAll('[data-art-reveal]')
        if (reveals.length) motion.fromTo(reveals, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: .15 }, 0)
        paths.forEach((path, i) => motion.fromTo(path, { strokeDasharray: `${lengths[i]} ${lengths[i]}`, strokeDashoffset: lengths[i] }, { strokeDashoffset: 0, duration: 1.25, ease: 'sine.inOut' }, .4 + i * .1))
        const pieces = figure.querySelectorAll('[data-art-pop]')
        if (pieces.length) motion.fromTo(pieces, { scale: .65, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: .7, stagger: .09 }, .6)
        const rows = figure.querySelectorAll('[data-art-row]')
        if (rows.length) motion.fromTo(rows, { x: -16, opacity: 0 }, { x: 0, opacity: 1, duration: .6, stagger: .32 }, .7)
        const finish = figure.querySelectorAll('[data-art-finish]')
        if (finish.length) motion.fromTo(finish, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .65 }, 2.15)
        timeline = motion
      })
      const sync = () => {
        if (visible && !document.hidden && journal?.dataset.coursePage !== 'cover' && !journal?.dataset.coverTransition) {
          if (!timeline) context.prepare()
          if (timeline!.progress() < 1) timeline!.play()
        } else timeline?.pause()
      }
      const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync() }, { threshold: .2 })
      observer.observe(figure)
      const state = new MutationObserver(sync)
      if (journal) state.observe(journal, { attributes: true, attributeFilter: ['data-course-page', 'data-cover-transition'] })
      journal?.addEventListener('course-cover-settled', sync)
      document.addEventListener('visibilitychange', sync)
      return () => {
        observer.disconnect(); state.disconnect()
        journal?.removeEventListener('course-cover-settled', sync)
        document.removeEventListener('visibilitychange', sync)
        delete figure.dataset.artState
      }
    }, figure)
  })
}
