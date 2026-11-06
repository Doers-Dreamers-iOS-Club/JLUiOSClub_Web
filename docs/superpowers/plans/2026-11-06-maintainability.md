# Maintainability Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development for isolated lifecycle implementation and review; root integrates the approved changes in the existing clean feature branch.

**Goal:** Reduce duplication and loading cost while making Markdown components and module boundaries usable by future contributors.

**Architecture:** Keep Vue composition and explicit typed functions. Build-time data, content components, feature code, and browser effects have separate ownership. Preserve current route and animation contracts.

**Tech Stack:** VitePress 1.6, Vue 3.5, TypeScript, GSAP, Node test runner, Puppeteer.

## Tasks

- [ ] Data: add `.vitepress/data/createRecordLoader.ts` and a pure linear `groupByYear` function; use them from the three loaders and both archive consumers. Normalize competition frontmatter to quoted dates. Test sorting, grouping, URL date inference and invalid date reporting with `node --test`.
- [ ] Course: separate chapter catalog from persistence, derive totals and membership from the catalog, remove unused minutes props and stale fallbacks. Keep reading storage key and existing progress semantics.
- [ ] Theme: move registration to `components/register.ts`, isolate image/reveal refresh as a composable, make illustration registry module-scoped. Remove the five audited unused modules and unused dependencies.
- [ ] Motion: extract course entrance strategy from `useCourseCover`; share artwork observer lifecycle; implement a visibility/reduced-motion composable for carousel and lab playback. Add browser regression for timers and preserve existing artwork tests.
- [ ] Icons: add a small build-time CSS transform in `.vitepress/plugins/` that discovers `ti-*` literals from theme and Markdown sources, retains base/font-face rules and filters unused icon selectors. Verify all source classes resolve and measure production CSS.
- [ ] Authoring: clean stale props at definitions and Markdown call sites. Add an explicit card body option for linked cards, native details wrapper, component guide and downloadable/copyable page templates; update README and theme reference.
- [ ] Validation: add strict TypeScript checking for changed typed modules and Vue components, reuse existing browser scripts, update obsolete design assertions to current routes, run build and relevant regression suites. Record outputs and compare baseline resource bytes.
- [ ] Review and commit: inspect diff for needless guards/abstractions, review spec compliance then code quality, commit as Hean-Yi. Keep work on the feature branch without merging or deploying.

## Verification commands

```sh
npm run test
npm run typecheck
npm run build
npm run preview -- --host 127.0.0.1 --port 4175
node scripts/check-overview-loading.mjs http://localhost:4175
node scripts/check-artwork-first-frame.mjs http://localhost:4175
node scripts/check-course-motion.mjs http://localhost:4175
node scripts/check-route-motion.mjs http://localhost:4175
node scripts/check-design.mjs http://localhost:4175
```

Production build and selected tests run once after integration, then only failures or newly changed behavior are rerun. Browser tests must close their browser in finally; DOM selectors must target the current page contracts.
