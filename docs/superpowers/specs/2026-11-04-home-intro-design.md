# Home typography intro

Approved direction: show `I dwell in Possibility`, stagger alternating letters vertically with repeated slogan echoes, then move the four words onto the existing three-line poem. Preserve Instrument Serif, theme colors, and responsive layout. During the final transition, the solid Possibility fill dissolves into ASCII characters clipped inside its letter shapes, then fades to the existing outline. Reveal Swift ASCII as the typography settles.

Use a scoped GSAP timeline with measured destination geometry. Keep SSR content readable. Defer heavy ASCII components until after the first client paint. Skip the intro for reduced motion and non-opening hash destinations. Resize, hash navigation, Escape, failure, and unmount must clean up overlays and restore content. Never wait indefinitely for fonts or WebGL. Lock home paging during the intro, then restore normal controls. Validate desktop/mobile, dark mode, skip paths, no-JS, and existing full-page transitions.

## Follow-up refinement

The user requested a true character transfer into the logo and faster initial rendering. Ship a CSS-only HTML cover, defer WebGL by 750ms, lazy-load Mermaid and non-home components, and remove unnecessary homepage diagram preloads. Extend the typography choreography with alternating flip letters and horizontal repeated rows. The latest direction explicitly replaces left-to-right conversion with a descending horizontal ink level: top becomes ASCII first, bottom retains solid fill, and particles leave top-to-bottom before assembling at the real logo snapshot. No fixed simulated loading percentage. Preserve interruption and accessibility behavior.

## Continuous emission refinement

The user clarified that characters must fly while the ink drains, not afterward. Use one elapsed-time clock for the waterline and particles. Invert the waterline easing to release each source row as it is exposed. Match horizontal neighbourhoods, use cubic paths with zero endpoint velocity/acceleration, vary travel duration slightly, and crossfade glyph identities instead of switching them abruptly. Acquire the logo snapshot before the conversion starts, with the existing bounded wait. Validate that particles are moving while solid ink remains, and that arrivals overlap ongoing flights.

## Moving handoff refinement

The user reported a pause between assembly and idle logo motion. End the transfer at the measured final arrival instead of the conservative fixed duration. Overlap the last 550ms with live WebGL motion and preserve that animation clock across intro teardown. Ramp motion gain on reveal to avoid a velocity jump. Prepare AsciiNarrative during the earlier typography phase, and avoid synchronous GPU snapshot reads on initial unchanged-page layout. Check concurrent particle/WebGL motion and continuous phase on desktop/mobile.
