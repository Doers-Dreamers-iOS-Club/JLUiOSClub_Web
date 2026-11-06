import { chapterIds } from '../../data/course'

export const readingKey = 'jlu-ai-programming-reading-v1'
export interface ReadingState { completed: string[]; last: string }
export function readState(): ReadingState {
  try {
    const data = JSON.parse(localStorage.getItem(readingKey) || '{}')
    return {
      completed: Array.isArray(data?.completed) ? [...new Set<string>(data.completed.filter((id: unknown) => typeof id === 'string' && chapterIds.includes(id)))] : [],
      last: chapterIds.includes(data?.last) ? data.last : ''
    }
  } catch { return { completed: [], last: '' } }
}
export function saveState(state: ReadingState): boolean {
  try {
    localStorage.setItem(readingKey, JSON.stringify(state))
    window.dispatchEvent(new Event('jlu-reading-change'))
    return true
  } catch { return false }
}
