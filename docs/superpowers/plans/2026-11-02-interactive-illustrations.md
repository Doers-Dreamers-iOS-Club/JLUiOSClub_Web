# Interactive Illustrations Implementation Plan

> Execute with superpowers:subagent-driven-development assistance for bounded component work, then spec and code review. User approved the design on 2026-11-02; retain the current workspace and all existing edits.

**Goal:** Implement all eight chapter illustrations and small explanatory animations, without modifying the home page.

**Architecture:** One lazy illustration dispatcher loads independent Vue scenes. Shared LabFrame, scoped visual vocabulary, SnakeScene SVG and useLabPlayback supply framing and safe playback. Canonical chapter fragments embed each scene at the matching passage; continuous reading inherits the same content.

**Tech Stack:** Existing Vue 3, VitePress, SVG, CSS and puppeteer-core. No new dependency or real API requests.

## 1. Shared foundation
- [x] Add `components/learning/illustrations/LabFrame.vue`, `useLabPlayback.ts`, `SnakeScene.vue`, `lab.css`, and `LearningIllustration.vue`.
- [x] Playback starts only by user action, uses one interval per instance, pauses on hidden/offscreen/unmount/reduced motion; SSR renders a readable static state.
- [x] Base controls provide visible focus and 44 px targets; layouts collapse at 600 px and work at 320 px.

## 2. Illustrations
- [x] ProjectPreview: three rule choices, example contract, replay/step between requirement and result, reset to unspecified rules. Add compact observation/feedback story strips in chapter 1/2.
- [x] ContextDesk: five information cards, click and optional drag-to-tray, evidence/unknown explanation, three story presets and prompt copy fallback.
- [x] PauseAnatomy: ready/running/paused/ended, explicit valid actions, state inspection separate from state mutation, pulse, snapshot, single step and reset.
- [x] TimerMicroscope: one clock simulates clean vs leaked timers, bounded count, restart events, repair, step, play/pause/reset, event log.
- [x] VersionBook: two version selections, graphic comparison slider plus buttons, code/record views, simulated restore only.
- [x] SkillRecipe: six cards classified into facts/task/method/tool, feedback, move-back/example/other-project/reset, drag optional with click alternative.
- [x] McpWorkbench: service/page prerequisites, preset failures, call and return path, node inputs/outputs, illustrative browser action and observation.
- [x] ApiEnvelope: explanatory fields, three configuration presets, request/response drawers, full/chunk view, controlled send/replay/step, no network calls.

## 3. Content integration
- [x] Register only lazy dispatcher globally, replace redundant SnakeLab/FlowExplorer embeds and insert new scenes beside relevant paragraphs.
- [x] Preserve all source prose, code and original section anchors. Add stable illustration IDs and short labels.
- [x] Update theme documentation and approved design status, retain original downloads.

## 4. Verification
- [x] Compile all SFCs and `npm run build`.
- [x] Update `scripts/check-ai-course.mjs` to cover new interactions plus existing quiz/progress/prompt/download regressions.
- [x] Verify state transitions, invalid operations, restart/repair, selection/copy, failure/recovery, reduced motion and offscreen cleanup.
- [x] Inspect desktop/mobile/dark screenshots, run static link checks and `git diff --check`.
- [x] Perform spec review then code quality review, resolve findings, leave a local preview.

## Validation record — 2026-11-02

- Production build: `npm run build` passed.
- Browser regression: `node scripts/check-ai-course.mjs http://localhost:4175` passed against the production preview. Covers all eight scenes, existing quiz/progress/prompt behavior, copy fallback, drag/click alternatives, timer cleanup, state transitions, API/MCP failure recovery and downloads.
- Responsive/accessibility: 320 px layouts have no horizontal overflow; dark mode and reduced motion checked. Automatic playback does not repeatedly announce movement, and leaving reduced motion pauses the manual simulation.
- Static links: all local links and anchors across 18 generated handbook pages passed. Continuous reading has 10 illustration instances and no duplicate IDs.
- Visual inspection: desktop and mobile/dark captures reviewed in `/private/tmp/ai-course-illustrations-qa`.
- Spec and code reviews: all findings resolved and re-reviewed. `git diff --check` passed.
- Preview: `http://localhost:4175/resources/ai-programming/`. No deployment or remote changes.
