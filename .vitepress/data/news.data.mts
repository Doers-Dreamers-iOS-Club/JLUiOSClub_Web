/**
 * 新闻索引数据。约定同 activities.data.ts。
 */
import { createContentLoader } from 'vitepress'
import { toEntries, type RecordEntry } from './shared'

declare const data: RecordEntry[]
export { data }

export default createContentLoader('news/*/index.md', {
  excerpt: true,
  transform: toEntries
})
