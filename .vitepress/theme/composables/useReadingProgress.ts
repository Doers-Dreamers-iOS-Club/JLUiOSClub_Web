import { computed, onMounted, onUnmounted, ref } from 'vue'
import { chapters } from '../../data/course'
import { readState } from './readingState'

export function useReadingProgress() {
  const completed = ref<string[]>([])
  const last = ref('')
  const next = computed(() =>
    chapters.find(chapter => chapter.id === last.value && !completed.value.includes(chapter.id))
    || chapters.find(chapter => !completed.value.includes(chapter.id))
    || chapters[0])
  const finished = computed(() => completed.value.length === chapters.length)
  function sync() {
    const state = readState()
    completed.value = state.completed
    last.value = state.last
  }
  onMounted(() => {
    sync()
    window.addEventListener('storage', sync)
    window.addEventListener('jlu-reading-change', sync)
  })
  onUnmounted(() => {
    window.removeEventListener('storage', sync)
    window.removeEventListener('jlu-reading-change', sync)
  })
  return { completed, last, next, finished }
}
