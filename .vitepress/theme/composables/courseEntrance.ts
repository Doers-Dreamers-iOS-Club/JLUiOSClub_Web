import type { gsap } from 'gsap'
import { addCourseLiquidFill } from './courseLiquidFill'

export function animateCourseEntrance(timeline: gsap.core.Timeline, cover: HTMLElement) {
  timeline.fromTo(cover.querySelector('.journal-masthead__rule'),
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
  addCourseLiquidFill(timeline, cover)
}
