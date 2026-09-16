// https://vitepress.dev/guide/custom-theme
import { h, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import type { Theme } from 'vitepress'
import mediumZoom from 'medium-zoom'
import DefaultTheme from 'vitepress/theme-without-fonts'

import './style.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/motion.css'

import { initReveal, teardownReveal } from './composables/useReveal'
import { initRouteEnter } from './composables/useRouteEnter'

import CursorWave from './components/CursorWave.vue'
import AsciiHero from './components/AsciiHero.vue'
import MagHero from './components/MagHero.vue'
import MagSection from './components/MagSection.vue'
import MagGrid from './components/MagGrid.vue'
import MagCard from './components/MagCard.vue'
import MagStep from './components/MagStep.vue'
import MagNote from './components/MagNote.vue'
import MagFigure from './components/MagFigure.vue'
import MagTimeline from './components/MagTimeline.vue'
import MagTimelineItem from './components/MagTimelineItem.vue'
import MagBadge from './components/MagBadge.vue'
import MagArchive from './components/MagArchive.vue'
import MagButton from './components/MagButton.vue'
import MagCarousel from './components/MagCarousel.vue'
import MagModal from './components/MagModal.vue'

/**
 * 全局注册 —— markdown 里可直接使用，无需 import。
 * 这是"新增一个界面"成本最低的关键：写 frontmatter + 拼组件，不碰 CSS。
 */
const components = {
  CursorWave,
  AsciiHero,
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
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      // 首页首屏：CursorWave 全屏背景 + ASCII Swift 立体 logo，独占一屏；
      // 刊头、按钮、卡片等其余元素由 useReveal 滚动揭示。
      'home-hero-before': () => [h(CursorWave), h(AsciiHero)]
    })
  },
  enhanceApp({ app }) {
    for (const [name, component] of Object.entries(components)) {
      app.component(name, component)
    }
  },
  setup() {
    const route = useRoute()

    const initZoom = () => {
      // 不显式添加{data-zoomable}的情况下为所有图像启用此功能（轮播图除外）
      mediumZoom('.main img:not(.mag-carousel__track img)', {
        background: 'var(--vp-c-bg)'
      })
    }

    /** 首页路由标记：纯白色底只给首页，正文页保持暖纸 */
    const markHomeRoute = () => {
      document.documentElement.classList.toggle('mag-route-home', route.path === '/')
    }

    const refresh = () => {
      initZoom()
      initReveal()
    }

    onMounted(() => {
      markHomeRoute()
      refresh()
    })

    watch(
      () => route.path,
      () =>
        nextTick(() => {
          markHomeRoute()
          initRouteEnter()
          refresh()
        })
    )

    onUnmounted(teardownReveal)
  }
} satisfies Theme
