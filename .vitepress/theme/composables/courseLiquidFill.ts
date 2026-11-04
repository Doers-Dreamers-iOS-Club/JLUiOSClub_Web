import { gsap } from 'gsap'

/** Move a fixed wave mask over stationary text. Counter-transforms keep the
 * glyph in place without changing its font, stroke, color or path each frame. */
export function addCourseLiquidFill(timeline: gsap.core.Timeline, cover: HTMLElement, at = .65) {
  const glyphs = Array.from(cover.querySelectorAll<HTMLElement>('.journal-word--world .journal-glyph'))
  glyphs.forEach((glyph, index) => {
    const window = glyph.querySelector<HTMLElement>('.journal-liquid-window')!
    const fill = glyph.querySelector<HTMLElement>('.journal-glyph-fill')!
    const outline = glyph.querySelector<HTMLElement>('.journal-glyph-outline')!
    const start = at + index * .065
    // The window is 3x as wide and 2x as tall as its glyph. The opposite
    // percentages on the text cancel its movement while the liquid rises.
    timeline.fromTo(window,
      { yPercent: 55, clipPath: 'url(#course-world-liquid-clip)', willChange: 'transform' },
      { yPercent: -12, duration: 2, ease: 'sine.inOut' }, start)
      .fromTo(fill,
        { yPercent: -110, willChange: 'transform' },
        { yPercent: 24, duration: 2, ease: 'sine.inOut' }, start)
      .fromTo(window, { xPercent: -4 }, { xPercent: 4, duration: .5, ease: 'sine.inOut' }, start)
      .fromTo(fill, { xPercent: 12 }, { xPercent: -12, duration: .5, ease: 'sine.inOut' }, start)
    // Two progressively smaller sloshes, then a still, full letter.
    const waves = [{ time: .5, duration: .65, x: -2 }, { time: 1.15, duration: .5, x: 1 }, { time: 1.65, duration: .35, x: 0 }]
    for (const wave of waves) {
      timeline.to(window, { xPercent: wave.x, duration: wave.duration, ease: 'sine.inOut' }, start + wave.time)
        .to(fill, { xPercent: -wave.x * 3, duration: wave.duration, ease: 'sine.inOut' }, start + wave.time)
    }
    timeline.fromTo(outline, { opacity: 1, willChange: 'opacity' },
      { opacity: 0, duration: .4, ease: 'sine.inOut' }, start + 1.7)
      .set(window, { clearProps: 'transform,clipPath,willChange' }, start + 2.1)
      .set(fill, { clearProps: 'transform,willChange' }, start + 2.1)
      .set(outline, { clearProps: 'opacity,willChange' }, start + 2.1)
  })
}
