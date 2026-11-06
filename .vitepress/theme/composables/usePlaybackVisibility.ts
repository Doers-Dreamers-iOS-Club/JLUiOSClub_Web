import { computed, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/** Playback is available only in a visible document and a sufficiently visible element. */
export function usePlaybackVisibility(root: Ref<HTMLElement | null>, threshold: number) {
  const visible = ref(false)
  const foreground = ref(false)
  const reduced = ref(false)
  let dispose = () => {}
  onMounted(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const preference = () => { reduced.value = media.matches }
    const visibility = () => { foreground.value = !document.hidden }
    preference()
    visibility()
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { visible.value = entry.isIntersecting && entry.intersectionRatio >= threshold })
    }, { threshold: [0, threshold] })
    observer.observe(root.value!)
    media.addEventListener('change', preference)
    document.addEventListener('visibilitychange', visibility)
    dispose = () => {
      observer.disconnect()
      media.removeEventListener('change', preference)
      document.removeEventListener('visibilitychange', visibility)
    }
  })
  onBeforeUnmount(() => { visible.value = false; dispose() })
  return { available: computed(() => visible.value && foreground.value && !reduced.value), reduced }
}
