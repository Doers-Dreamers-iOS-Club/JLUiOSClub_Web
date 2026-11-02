# Restrained reading implementation plan

Goal: Deliver the approved reading-focused redesign with the existing palette and working course interactions.

Architecture: Keep VitePress and existing content interfaces. Centralize typography and surfaces in theme tokens; replace ornate shared components; use one lifecycle-managed GSAP motion controller.

Tech stack: Vue, VitePress, CSS, GSAP, Puppeteer.

- [ ] Preserve existing state in Git; document approved design.
- [ ] Update `styles/tokens.css`, `styles/base.css` and shared Mag components: 400/500 sans typography, 22/18/16px headings, hairline borders, no shadows or folded corners.
- [ ] Create `components/ClubHome.vue` and simplify `docs/index.md`; preserve all four learning entry URLs and recent activities.
- [ ] Replace `useReveal.ts`, remove obsolete route/tear controllers and update `index.ts`: scoped GSAP timeline, observer cleanup and live reduced-motion support.
- [ ] Simplify `MagArchive.vue`, learning styles and `LabFrame.vue`, retaining navigation, view persistence and every teaching control.
- [ ] Run `npm run build` and `node scripts/check-ai-course.mjs http://localhost:5173`; fix any regressions.
- [ ] Capture and inspect desktop/mobile and light/dark screenshots; check SSR, navigation, typography, reduced motion and overflow.
- [ ] Document final behavior and validation, then commit implementation.
