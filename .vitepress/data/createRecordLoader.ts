import { createContentLoader } from 'vitepress'
import { toEntries } from './shared'

export function createRecordLoader(section: 'activities' | 'news' | 'competitions') {
  return createContentLoader(`${section}/*/index.md`, { transform: toEntries })
}
