import { computed, provide, ref, watch, type InjectionKey, type Ref } from 'vue'
import { usePlaybackVisibility } from '../../../composables/usePlaybackVisibility'

type Playback = { playing: Ref<boolean>; reduced: Ref<boolean>; toggle: () => void }
export const labPlaybackKey: InjectionKey<Playback> = Symbol('lab-playback')

export function useLabPlayback(root: Ref<HTMLElement | null>, tick: () => boolean | void, interval = 1100, options: { reset: () => void; static: () => void }) {
  const { available, reduced } = usePlaybackVisibility(root, .15)
  const wanted = ref(true)
  const playing = computed(() => wanted.value && available.value)
  let finishedAt = 0
  watch(reduced, value => {
    finishedAt = 0
    if (value) options.static()
    else options.reset()
  }, { flush: 'sync' })
  watch(playing, (value, _, onCleanup) => {
    if (!value) return
    const timer = setInterval(() => {
      if (finishedAt) {
        if (Date.now() >= finishedAt) { options.reset(); finishedAt = 0 }
      } else if (tick() === false) finishedAt = Date.now() + 1600
    }, interval)
    onCleanup(() => clearInterval(timer))
  })
  const toggle = () => { wanted.value = !wanted.value }
  provide(labPlaybackKey, { playing, reduced, toggle })
  return { playing, reduced }
}
