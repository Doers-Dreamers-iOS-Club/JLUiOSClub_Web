import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { gsap } from 'gsap'
import { observeArtworkPlayback } from './observeArtworkPlayback'

/** Short, once-per-visit illustrations. Each mobile panel starts in its own viewport. */
export function useCourseArtworkMotion(root: Ref<HTMLElement | null>) {
  let media: ReturnType<typeof gsap.matchMedia> | undefined
  onBeforeUnmount(() => media?.revert())
  onMounted(() => {
    const figure = root.value
    if (!figure) return
    const stages = Array.from(figure.querySelectorAll<HTMLElement>('.art-stage'))
    // Release the SSR starting pose if this visit cannot run an animation.
    stages.forEach(stage => { delete stage.dataset.motionState })
    if (!('IntersectionObserver' in window)) return
    media = gsap.matchMedia()
    media.add({ reduce: '(prefers-reduced-motion: reduce)', desktop: '(min-width: 641px)', mobile: '(max-width: 640px)' }, context => {
      if (context.conditions?.reduce) return
      const connectors = Array.from(figure.querySelectorAll<SVGPathElement>('.art-connector path'))
      const timelines = new Map<Element, gsap.core.Timeline>()
      const journal = figure.closest<HTMLElement>('.course-journal')
      function draw(timeline: gsap.core.Timeline, paths: SVGPathElement[], lengths: Map<SVGPathElement, number>, at: number, duration: number) {
        paths.forEach(path => timeline.fromTo(path, {
          strokeDasharray: `${lengths.get(path)} ${lengths.get(path)}`, strokeDashoffset: lengths.get(path)
        }, { strokeDashoffset: 0, duration, ease: 'power2.inOut' }, at))
      }
      stages.forEach(stage => { stage.dataset.motionState = 'waiting' })
      context.add('prepare', (stage: HTMLElement) => {
        // Release CSS within this synchronous setup so GSAP saves the actual
        // resting transforms for revert(), rather than the temporary start pose.
        // Restore waiting before the browser can paint or the delayed tween runs.
        stage.dataset.motionState = 'preparing'
        const index = stages.indexOf(stage)
        const paths = Array.from(stage.querySelectorAll<SVGPathElement>('.art-sketch, .art-snake, .art-snake-shadow'))
        if (connectors[index]) paths.push(connectors[index])
        const lengths = new Map(paths.map(path => [path, path.getTotalLength()]))
        const select = gsap.utils.selector(stage)
        const timeline = gsap.timeline({
          paused: true, delay: context.conditions?.desktop ? index * .48 : 0,
          defaults: { ease: 'power2.out' },
          onStart: () => { stage.dataset.motionState = 'playing' },
          onComplete: () => { stage.dataset.motionState = 'complete' }
        })
        timelines.set(stage, timeline)
        timeline.fromTo(select('svg'), { y: 12, opacity: .65 }, { y: 0, opacity: 1, duration: .8 }, 0)
        if (index === 0) {
          draw(timeline, Array.from(stage.querySelectorAll<SVGPathElement>('.art-sketch')), lengths, .12, 1.2)
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
          draw(timeline, Array.from(stage.querySelectorAll<SVGPathElement>('.art-snake, .art-snake-shadow')), lengths, .2, 1.4)
          timeline.fromTo(select('.art-snake-eye'), { opacity: 0 }, { opacity: 1, duration: .16 }, 1.45)
          timeline.fromTo(select('.art-apple'), { scale: .65, opacity: 0, transformOrigin: '50% 50%' }, {
            scale: 1, opacity: 1, duration: .5, clearProps: 'transform,transformOrigin,opacity'
          }, .8)
        }
        if (connectors[index]) draw(timeline, [connectors[index]], lengths, 1.2, .55)
        stage.dataset.motionState = 'waiting'
      })
      const prepare = (stage: HTMLElement) => { if (!timelines.has(stage)) context.prepare(stage) }
      const stopPlayback = observeArtworkPlayback({
        targets: stages, journal, threshold: .28, prepare,
        sync: (stage, playing) => {
          if (playing) {
            prepare(stage)
            const timeline = timelines.get(stage)!
            if (timeline.progress() < 1) timeline.play()
          } else timelines.get(stage)?.pause()
        }
      })
      return () => {
        stopPlayback()
        stages.forEach(stage => { delete stage.dataset.motionState })
      }
    }, figure)
  })
}
