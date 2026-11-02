<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
type Scene = 'project' | 'context' | 'pause' | 'timers' | 'versions' | 'skill' | 'mcp' | 'api' | 'observe' | 'feedback'
const props = defineProps<{ scene: Scene }>()
const components = {
  project: defineAsyncComponent(() => import('./illustrations/ProjectPreview.vue')),
  context: defineAsyncComponent(() => import('./illustrations/ContextDesk.vue')),
  pause: defineAsyncComponent(() => import('./illustrations/PauseAnatomy.vue')),
  timers: defineAsyncComponent(() => import('./illustrations/TimerMicroscope.vue')),
  versions: defineAsyncComponent(() => import('./illustrations/VersionBook.vue')),
  skill: defineAsyncComponent(() => import('./illustrations/SkillRecipe.vue')),
  mcp: defineAsyncComponent(() => import('./illustrations/McpWorkbench.vue')),
  api: defineAsyncComponent(() => import('./illustrations/ApiEnvelope.vue')),
  observe: defineAsyncComponent(() => import('./illustrations/LessonStory.vue')),
  feedback: defineAsyncComponent(() => import('./illustrations/LessonStory.vue')),
}
</script>
<template><div class="learning-illustration mag-no-reveal" :data-scene="scene"><component :is="components[props.scene]" :kind="scene === 'observe' ? 'observe' : scene === 'feedback' ? 'feedback' : undefined" /></div></template>
