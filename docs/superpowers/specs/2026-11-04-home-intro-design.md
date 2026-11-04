# Home typography intro

Approved direction: show `I dwell in Possibility`, stagger alternating letters vertically with repeated slogan echoes, then move the four words onto the existing three-line poem. Preserve Instrument Serif, theme colors, and responsive layout. During the final transition, the solid Possibility fill dissolves into ASCII characters clipped inside its letter shapes, then fades to the existing outline. Reveal Swift ASCII as the typography settles.

Use a scoped GSAP timeline with measured destination geometry. Keep SSR content readable. Defer heavy ASCII components until after the first client paint. Skip the intro for reduced motion and non-opening hash destinations. Resize, hash navigation, Escape, failure, and unmount must clean up overlays and restore content. Never wait indefinitely for fonts or WebGL. Lock home paging during the intro, then restore normal controls. Validate desktop/mobile, dark mode, skip paths, no-JS, and existing full-page transitions.

## Follow-up refinement

The user requested a true character transfer into the logo and faster initial rendering. Ship a CSS-only HTML cover, defer WebGL by 750ms, lazy-load Mermaid and non-home components, and remove unnecessary homepage diagram preloads. Extend the typography choreography with alternating flip letters and horizontal repeated rows. The latest direction explicitly replaces left-to-right conversion with a descending horizontal ink level: top becomes ASCII first, bottom retains solid fill, and particles leave top-to-bottom before assembling at the real logo snapshot. No fixed simulated loading percentage. Preserve interruption and accessibility behavior.
