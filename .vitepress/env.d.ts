export {}

declare module 'vue' {
  export interface GlobalComponents {
    ClubHome: typeof import('./theme/components/ClubHome.vue')['default']
    MagHero: typeof import('./theme/components/MagHero.vue')['default']
    MagSection: typeof import('./theme/components/MagSection.vue')['default']
    MagGrid: typeof import('./theme/components/MagGrid.vue')['default']
    MagCard: typeof import('./theme/components/MagCard.vue')['default']
    MagStep: typeof import('./theme/components/MagStep.vue')['default']
    MagNote: typeof import('./theme/components/MagNote.vue')['default']
    MagFigure: typeof import('./theme/components/MagFigure.vue')['default']
    MagTimeline: typeof import('./theme/components/MagTimeline.vue')['default']
    MagTimelineItem: typeof import('./theme/components/MagTimelineItem.vue')['default']
    MagBadge: typeof import('./theme/components/MagBadge.vue')['default']
    MagArchive: typeof import('./theme/components/MagArchive.vue')['default']
    MagButton: typeof import('./theme/components/MagButton.vue')['default']
    MagCarousel: typeof import('./theme/components/MagCarousel.vue')['default']
    MagModal: typeof import('./theme/components/MagModal.vue')['default']
    CourseArtwork: typeof import('./theme/components/learning/CourseArtwork.vue')['default']
    ReadingTools: typeof import('./theme/components/learning/ReadingTools.vue')['default']
    CourseProgress: typeof import('./theme/components/learning/CourseProgress.vue')['default']
    LearningIllustration: typeof import('./theme/components/learning/LearningIllustration.vue')['default']
    PromptWorkshop: typeof import('./theme/components/learning/PromptWorkshop.vue')['default']
    RecallQuiz: typeof import('./theme/components/learning/RecallQuiz.vue')['default']
    MagDetails: typeof import('./theme/components/MagDetails.vue')['default']
  }
}
