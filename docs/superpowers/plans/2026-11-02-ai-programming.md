# AI Programming Implementation Plan

> Execute within the current authorized workspace. Use focused subagent assistance for isolated components and review; preserve all pre-existing edits.

**Goal:** Publishable VitePress learning series with original content, blog-style illustrations and educational interactions.

**Architecture:** Canonical Markdown fragments power chapter and continuous views. Small Vue components provide local-only interactions. Existing Mag components and tokens supply visual consistency.

**Tech Stack:** VitePress, Vue 3, TypeScript, SVG, CSS, existing puppeteer-core browser QA.

## Task 1: Content migration and assets
- [x] Read supplied chapters/reference files. Map each Markdown file to its new route, retain explicit anchors, rewrite all relative links including raw downloads.
- [x] Create `docs/resources/ai-programming/_content/` fragments; chapter pages include fragments and navigation metadata. `read-all.md` includes all seven fragments with stable chapter anchors, excluded from duplicate search.
- [x] Copy original materials to `docs/public/ai-programming/`; build original-layout ZIP excluding `.DS_Store` and other OS metadata.
- [x] Create original thematic SVG cover and chapter illustrations, with meaningful alt text/captions.

## Task 2: Educational interactions
- [x] Implement `SnakeLab.vue`: controlled timer, speed change, pause, step, reset, explicit simulation label, clean timers on unmount/visibility changes.
- [x] Implement `FlowExplorer.vue`: typed `kind` prop for debugging, skill, mcp, api; ordered nodes, explanations, user-started playback, keyboard controls and reduced-motion handling.
- [x] Implement `PromptWorkshop.vue`: six rounds, explanations and copy with failure feedback.
- [x] Implement `RecallQuiz.vue`: per-chapter answer/feedback data; buttons and live feedback.
- [x] Implement `ReadingTools.vue` + `CourseProgress.vue` with shared validated storage helper and explicit read toggle.

## Task 3: Layout and integration
- [x] Create scoped series CSS and landing page. Register components in existing theme index without replacing local edits.
- [x] Add dedicated sidebar, source exclusions for internal fragments/specs/plans, and top nav entry.
- [x] Update home/resources/activities/Winter Swift/related AI articles and repository documentation.

## Task 4: Verification
- [x] Run `npm run build`; resolve missing routes/anchors/render errors.
- [x] Run existing Chrome through puppeteer-core against local preview. Test interactions and reading persistence; capture desktop/mobile/light/dark views.
- [x] Inspect rendered screenshots; fix layout overflows and poor contrast. Test reduced-motion and repeated navigation timer cleanup.
- [x] Verify original/download files and ZIP manifest, then run `git diff --check`. Report remaining limitations honestly.

## Validation record

- Production build passed.
- Content/spec review approved: all seven chapter bodies and five reference pages preserved; original ZIP contains 24 files.
- Code review approved after improving dark primary-button contrast to 6.35:1.
- Static output checked: 18 new HTML pages, 1161 local link references resolve.
- Final production browser suite passed at http://localhost:4175: chapter links, snake speed/pause/step/reset, quiz wrong/correct/retry, reading persistence, prompt clipboard fallback, flow playback, reduced motion, mobile overflow, console checks, and exact downloaded-byte comparison. Screenshots inspected and saved outside repository in `/private/tmp/ai-course-qa`.
