import { onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'
import { initReveal, teardownReveal } from './useReveal'

export function usePageEnhancements() {
  const route = useRoute()

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
