// https://vitepress.dev/guide/custom-theme
import { defineAsyncComponent, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import type { Theme } from 'vitepress'
import mediumZoom from 'medium-zoom'
import DefaultTheme from 'vitepress/theme-without-fonts'

import './style.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/motion.css'
import './styles/learning.css'

import { initReveal, teardownReveal } from './composables/useReveal'
import { useRouteMotion } from './composables/useRouteMotion'
import '@tabler/icons-webfont/dist/tabler-icons.min.css'
const ClubHome = defineAsyncComponent(() => import('./components/ClubHome.vue'))

const MagHero = defineAsyncComponent(() => import('./components/MagHero.vue'))
const MagSection = defineAsyncComponent(() => import('./components/MagSection.vue'))
const MagGrid = defineAsyncComponent(() => import('./components/MagGrid.vue'))
const MagCard = defineAsyncComponent(() => import('./components/MagCard.vue'))
const MagStep = defineAsyncComponent(() => import('./components/MagStep.vue'))
const MagNote = defineAsyncComponent(() => import('./components/MagNote.vue'))
const MagFigure = defineAsyncComponent(() => import('./components/MagFigure.vue'))
const MagTimeline = defineAsyncComponent(() => import('./components/MagTimeline.vue'))
const MagTimelineItem = defineAsyncComponent(() => import('./components/MagTimelineItem.vue'))
const MagBadge = defineAsyncComponent(() => import('./components/MagBadge.vue'))
const MagArchive = defineAsyncComponent(() => import('./components/MagArchive.vue'))
const MagButton = defineAsyncComponent(() => import('./components/MagButton.vue'))
const MagCarousel = defineAsyncComponent(() => import('./components/MagCarousel.vue'))
const MagModal = defineAsyncComponent(() => import('./components/MagModal.vue'))

/**
 * 全局注册 —— markdown 里可直接使用，无需 import。
 * 这是"新增一个界面"成本最低的关键：写 frontmatter + 拼组件，不碰 CSS。
 */
const CourseArtwork = defineAsyncComponent(() => import('./components/learning/CourseArtwork.vue'))
const ReadingTools = defineAsyncComponent(() => import('./components/learning/ReadingTools.vue'))
const CourseProgress = defineAsyncComponent(() => import('./components/learning/CourseProgress.vue'))
const LearningIllustration = defineAsyncComponent(() => import('./components/learning/LearningIllustration.vue'))
const PromptWorkshop = defineAsyncComponent(() => import('./components/learning/PromptWorkshop.vue'))
const RecallQuiz = defineAsyncComponent(() => import('./components/learning/RecallQuiz.vue'))

const components = {
  ClubHome,
  CourseArtwork,
  ReadingTools,
  CourseProgress,
  LearningIllustration,
  PromptWorkshop,
  RecallQuiz,
  MagHero,
  MagSection,
  MagGrid,
  MagCard,
  MagStep,
  MagNote,
  MagFigure,
  MagTimeline,
  MagTimelineItem,
  MagBadge,
  MagArchive,
  MagButton,
  MagCarousel,
  MagModal
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    for (const [name, component] of Object.entries(components)) {
      app.component(name, component)
    }
  },
  setup() {
    const route = useRoute()
    useRouteMotion()

    let zoom: ReturnType<typeof mediumZoom> | undefined
    const initZoom = () => {
      zoom?.detach()
      // 不显式添加{data-zoomable}的情况下为所有图像启用此功能（轮播图除外）
      zoom = mediumZoom('.main img:not(.mag-carousel__track img)', {
        background: 'var(--vp-c-bg)'
      })
    }

    const refresh = () => {
      initZoom()
      initReveal()
    }

    onMounted(() => {
      refresh()
    })

    watch(
      () => route.path,
      () =>
        nextTick(() => {
          refresh()
        })
    )

    onUnmounted(() => { teardownReveal(); zoom?.detach() })
  }
} satisfies Theme
