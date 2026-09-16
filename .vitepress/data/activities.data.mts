/**
 * 活动索引数据
 * ---------------------------------------------------------------------------
 * 从 frontmatter 自动收集，不再依赖 sidebar.ts。
 * 新增一个活动 = 建 docs/activities/<YYMMDD-slug>/index.md 并写 frontmatter，
 * 索引页会自动出现该条目。
 */
import { createContentLoader } from 'vitepress'
import { toEntries, type RecordEntry } from './shared'

declare const data: RecordEntry[]
export { data }

export default createContentLoader('activities/*/index.md', {
  excerpt: true,
  transform: toEntries
})
