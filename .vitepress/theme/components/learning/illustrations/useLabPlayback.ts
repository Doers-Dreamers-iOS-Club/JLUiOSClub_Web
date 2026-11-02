import { onBeforeUnmount, onMounted, provide, ref, type InjectionKey, type Ref } from 'vue'

type Playback = { playing: Ref<boolean>; reduced: Ref<boolean>; toggle: () => void }
export const labPlaybackKey: InjectionKey<Playback> = Symbol('lab-playback')

export function useLabPlayback(root: Ref<HTMLElement | null>, tick: () => boolean | void, interval = 1100, options: { reset: () => void; static: () => void }) {
  const playing = ref(false)
  const reduced = ref(false)
  let wanted = true
  let visible = false
  let finishedAt = 0
  let timer: ReturnType<typeof setInterval> | undefined
  let observer: IntersectionObserver | undefined
  let media: MediaQueryList | undefined
  function stopClock() {
    if (timer !== undefined) clearInterval(timer)
    timer = undefined
    playing.value = false
  }
  function reconcile() {
    stopClock()
    if (!wanted || !visible || reduced.value || document.hidden) return
    playing.value = true
    timer = setInterval(() => {
      if (finishedAt) {
        if (Date.now() >= finishedAt) { options.reset(); finishedAt = 0 }
      } else if (tick() === false) finishedAt = Date.now() + 1600
    }, interval)
  }
  function toggle() { wanted = !wanted; reconcile() }
  function preference() {
    const wasReduced = reduced.value
    reduced.value = media?.matches ?? false
    if (reduced.value) { finishedAt = 0; options.static() }
    else if (wasReduced) { finishedAt = 0; options.reset() }
    reconcile()
  }
  provide(labPlaybackKey, { playing, reduced, toggle })
  onMounted(() => {
    media = window.matchMedia('(prefers-reduced-motion: reduce)')
    preference()
    media.addEventListener('change', preference)
    document.addEventListener('visibilitychange', reconcile)
    if ('IntersectionObserver' in window && root.value) {
      observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= .15
        reconcile()
      }, { threshold: [0, .15] })
      observer.observe(root.value)
    } else { visible = true; reconcile() }
  })
  onBeforeUnmount(() => {
    stopClock()
    observer?.disconnect()
    media?.removeEventListener('change', preference)
    document.removeEventListener('visibilitychange', reconcile)
  })
  return { playing, reduced }
}
