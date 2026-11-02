import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/** Only one clock. Returning false from tick finishes a finite illustration. */
export function useLabPlayback(root: Ref<HTMLElement | null>, tick: () => boolean | void, interval = 800, onStop?: () => void) {
  const playing = ref(false)
  const reduced = ref(false)
  const visible = ref(false)
  let timer: ReturnType<typeof setInterval> | undefined
  let observer: IntersectionObserver | undefined
  let media: MediaQueryList | undefined
  function pause() {
    if (timer !== undefined) clearInterval(timer)
    timer = undefined
    const wasPlaying = playing.value
    playing.value = false
    if (wasPlaying) onStop?.()
  }
  function step() { pause(); tick() }
  function play() {
    pause()
    if (reduced.value || !visible.value || typeof document === 'undefined' || document.hidden) return false
    playing.value = true
    timer = setInterval(() => { if (tick() === false) pause() }, interval)
    return true
  }
  function visibility() { if (document.hidden) pause() }
  function preference() { reduced.value = media?.matches ?? false; if (reduced.value) pause() }
  onMounted(() => {
    media = window.matchMedia('(prefers-reduced-motion: reduce)')
    preference()
    media.addEventListener('change', preference)
    document.addEventListener('visibilitychange', visibility)
    if ('IntersectionObserver' in window && root.value) {
      observer = new IntersectionObserver(([entry]) => { visible.value = entry.isIntersecting; if (!visible.value) pause() })
      observer.observe(root.value)
    } else visible.value = true
  })
  onBeforeUnmount(() => {
    pause()
    observer?.disconnect()
    media?.removeEventListener('change', preference)
    document.removeEventListener('visibilitychange', visibility)
  })
  return { playing, reduced, visible, play, pause, step }
}
