import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { gsap } from 'gsap'

/** Short, once-per-visit illustrations. Each mobile panel starts in its own viewport. */
export function useCourseArtworkMotion(root: Ref<HTMLElement | null>) {
  let media: ReturnType<typeof gsap.matchMedia> | undefined
  onBeforeUnmount(() => media?.revert())
  onMounted(() => {
    const figure = root.value
    if (!figure || !('IntersectionObserver' in window)) return
    media = gsap.matchMedia()
    media.add({ reduce: '(prefers-reduced-motion: reduce)', desktop: '(min-width: 641px)', mobile: '(max-width: 640px)' }, context => {
      if (context.conditions?.reduce) return
      const stages = Array.from(figure.querySelectorAll<HTMLElement>('.art-stage'))
      const connectors = Array.from(figure.querySelectorAll<SVGPathElement>('.art-connector path'))
      const visible = new Set<Element>()
      const timelines = new Map<Element, gsap.core.Timeline>()
      function draw(timeline: gsap.core.Timeline, paths: SVGPathElement[], at: number, duration: number) {
        const lengths = paths.map(path => path.getTotalLength())
        paths.forEach((path, i) => timeline.fromTo(path, {
          strokeDasharray: `${lengths[i]} ${lengths[i]}`, strokeDashoffset: lengths[i]
        }, { strokeDashoffset: 0, duration, ease: 'power2.inOut' }, at))
      }
      stages.forEach((stage, index) => {
        const select = gsap.utils.selector(stage)
        stage.dataset.motionState = 'waiting'
        const timeline = gsap.timeline({
          paused: true, delay: context.conditions?.desktop ? index * .48 : 0,
          defaults: { ease: 'power2.out' },
          onStart: () => { stage.dataset.motionState = 'playing' },
          onComplete: () => { stage.dataset.motionState = 'complete' }
        })
        timelines.set(stage, timeline)
        timeline.fromTo(select('svg'), { y: 12, opacity: .65 }, { y: 0, opacity: 1, duration: .8 }, 0)
        if (index === 0) {
          draw(timeline, Array.from(stage.querySelectorAll<SVGPathElement>('.art-sketch')), .12, 1.2)
          timeline.fromTo(select('.art-pen-motion'), { x: 10, y: -12 }, { x: 0, y: 0, duration: 1.4, ease: 'sine.inOut' }, 0)
        } else if (index === 1) {
          timeline.fromTo(select('.art-code text'), { opacity: .1, x: -4 }, { opacity: 1, x: 0, duration: .32, stagger: .16 }, .12)
          timeline.fromTo(select('.art-cursor'), { x: 12, y: 13, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: .5 }, .75)
          timeline.to(select('.art-play'), { scale: .94, transformOrigin: '50% 50%', duration: .13 }, 1.25)
            .to(select('.art-play'), { scale: 1, duration: .3 }, 1.38)
          timeline.fromTo(select('.art-caret'), { opacity: .2 }, { opacity: 1, duration: .2, repeat: 3, yoyo: true }, .4)
            .set(select('.art-caret'), { opacity: 1 }, 1.4)
        } else {
          timeline.fromTo(select('.art-grid'), { opacity: 0 }, { opacity: .12, duration: .6, stagger: .025 }, 0)
          draw(timeline, Array.from(stage.querySelectorAll<SVGPathElement>('.art-snake, .art-snake-shadow')), .2, 1.4)
          timeline.fromTo(select('.art-snake-eye'), { opacity: 0 }, { opacity: 1, duration: .16 }, 1.45)
          timeline.fromTo(select('.art-apple'), { scale: .65, opacity: 0, transformOrigin: '50% 50%' }, {
            scale: 1, opacity: 1, duration: .5, clearProps: 'transform,transformOrigin,opacity'
          }, .8)
        }
        if (connectors[index]) draw(timeline, [connectors[index]], 1.2, .55)
      })
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const timeline = timelines.get(entry.target)!
          if (entry.isIntersecting) {
            visible.add(entry.target)
            if (!document.hidden && timeline.progress() < 1) timeline.play()
          } else { visible.delete(entry.target); timeline.pause() }
        })
      }, { threshold: .28 })
      stages.forEach(stage => observer.observe(stage))
      const onVisibility = () => timelines.forEach((timeline, stage) => {
        if (document.hidden) timeline.pause()
        else if (visible.has(stage) && timeline.progress() < 1) timeline.play()
      })
      document.addEventListener('visibilitychange', onVisibility)
      return () => {
        observer.disconnect()
        document.removeEventListener('visibilitychange', onVisibility)
        stages.forEach(stage => { delete stage.dataset.motionState })
      }
    }, figure)
  })
}
