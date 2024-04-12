// https://vitepress.dev/guide/custom-theme
import {h, onMounted, watch, nextTick} from 'vue'
import {useRoute} from "vitepress";
import type {Theme} from 'vitepress'
import mediumZoom from "medium-zoom";
import DefaultTheme from 'vitepress/theme-without-fonts'
import './style.css'
import './custom.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {

  },
  setup() {
    const route = useRoute()
    const initZoom = () => {
      // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
      mediumZoom('.main img:not(.el-image__inner)', { background: 'var(--vp-c-bg)' })
    }
    onMounted(() => {
      initZoom()
    })
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )
  }
} satisfies Theme
