import { defineAsyncComponent } from 'vue'

const lessonStory = defineAsyncComponent(() => import('./LessonStory.vue'))
export const illustrations = {
  project: defineAsyncComponent(() => import('./ProjectPreview.vue')),
  context: defineAsyncComponent(() => import('./ContextDesk.vue')),
  pause: defineAsyncComponent(() => import('./PauseAnatomy.vue')),
  timers: defineAsyncComponent(() => import('./TimerMicroscope.vue')),
  versions: defineAsyncComponent(() => import('./VersionBook.vue')),
  skill: defineAsyncComponent(() => import('./SkillRecipe.vue')),
  mcp: defineAsyncComponent(() => import('./McpWorkbench.vue')),
  api: defineAsyncComponent(() => import('./ApiEnvelope.vue')),
  observe: lessonStory,
  feedback: lessonStory,
}
export type Scene = keyof typeof illustrations
