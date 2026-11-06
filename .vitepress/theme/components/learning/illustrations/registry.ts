import { defineAsyncComponent, type Component } from 'vue'

const loadLessonStory = () => import('./LessonStory.vue')
export const illustrationLoaders = {
  project: () => import('./ProjectPreview.vue'),
  context: () => import('./ContextDesk.vue'),
  pause: () => import('./PauseAnatomy.vue'),
  timers: () => import('./TimerMicroscope.vue'),
  versions: () => import('./VersionBook.vue'),
  skill: () => import('./SkillRecipe.vue'),
  mcp: () => import('./McpWorkbench.vue'),
  api: () => import('./ApiEnvelope.vue'),
  observe: loadLessonStory,
  feedback: loadLessonStory,
}
export type Scene = keyof typeof illustrationLoaders
export const illustrations = Object.fromEntries(
  Object.entries(illustrationLoaders).map(([scene, load]) => [scene, defineAsyncComponent<Component>(load)])
) as Record<Scene, Component>
illustrations.feedback = illustrations.observe
