# Home Intro Implementation Plan

**Goal:** Transition the slogan into the existing homepage with a solid-to-ASCII-to-outline fill animation.
**Architecture:** A dedicated intro composable owns temporary DOM layers and its GSAP timeline. ClubHome defers ASCII components until a client paint and supplies a paging lock. A canvas helper creates a glyph-clipped ASCII texture from measured text.
**Tech Stack:** Vue, GSAP, Canvas 2D, VitePress, Puppeteer.

- [x] Add `composables/introAscii.ts`: rasterize the final word using DOM Range measurements; mask deterministic monospace characters to the text shape.
- [x] Add `composables/useHomeIntro.ts`: bounded font wait, alternating character echoes, measured transforms, fill dissolve, cleanup on interruptions.
- [x] Integrate in `components/ClubHome.vue` and `composables/useFullPage.ts`: client-deferred async ASCII components, intro lock, scoped styles.
- [x] Build with `npm run build`; run a preview on port 4173.
- [x] Add and run `scripts/check-home-intro.mjs`: inspect intermediate states, final cleanup, desktop/mobile, dark mode, reduced motion, Escape, resize, hash navigation and no JavaScript.
- [x] Run existing `scripts/check-fullpage.mjs` with intro-aware initial settling. Update theme documentation with timing and behavior.

Validation completed: production build, intro browser checks, and existing full-page regression checks passed. Preview: http://localhost:4174/.
