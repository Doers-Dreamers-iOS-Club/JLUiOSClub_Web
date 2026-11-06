import { defineAsyncComponent, type App } from 'vue'

export const contentComponents = {
  ClubHome: defineAsyncComponent(() => import('./ClubHome.vue')),
  MagHero: defineAsyncComponent(() => import('./MagHero.vue')),
  MagSection: defineAsyncComponent(() => import('./MagSection.vue')),
  MagGrid: defineAsyncComponent(() => import('./MagGrid.vue')),
  MagCard: defineAsyncComponent(() => import('./MagCard.vue')),
  MagStep: defineAsyncComponent(() => import('./MagStep.vue')),
  MagNote: defineAsyncComponent(() => import('./MagNote.vue')),
  MagFigure: defineAsyncComponent(() => import('./MagFigure.vue')),
  MagTimeline: defineAsyncComponent(() => import('./MagTimeline.vue')),
  MagTimelineItem: defineAsyncComponent(() => import('./MagTimelineItem.vue')),
  MagBadge: defineAsyncComponent(() => import('./MagBadge.vue')),
  MagArchive: defineAsyncComponent(() => import('./MagArchive.vue')),
  MagButton: defineAsyncComponent(() => import('./MagButton.vue')),
  MagCarousel: defineAsyncComponent(() => import('./MagCarousel.vue')),
  MagModal: defineAsyncComponent(() => import('./MagModal.vue')),
  CourseArtwork: defineAsyncComponent(() => import('./learning/CourseArtwork.vue')),
  ReadingTools: defineAsyncComponent(() => import('./learning/ReadingTools.vue')),
  CourseProgress: defineAsyncComponent(() => import('./learning/CourseProgress.vue')),
  LearningIllustration: defineAsyncComponent(() => import('./learning/LearningIllustration.vue')),
  PromptWorkshop: defineAsyncComponent(() => import('./learning/PromptWorkshop.vue')),
  RecallQuiz: defineAsyncComponent(() => import('./learning/RecallQuiz.vue')),
  MagDetails: defineAsyncComponent(() => import('./MagDetails.vue'))
}

export function registerContentComponents(app: App) {
  for (const [name, component] of Object.entries(contentComponents)) app.component(name, component)
}
