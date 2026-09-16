/**
 * 竞赛记录索引数据
 * ---------------------------------------------------------------------------
 * 与 activities / news 同一套数据流：建 docs/competitions/<slug>/index.md
 * 并写好 frontmatter（date / icon / tags），索引页自动收录。
 */
import { createContentLoader } from 'vitepress'
import { toEntries, type RecordEntry } from './shared'

declare const data: RecordEntry[]
export { data }

export default createContentLoader('competitions/*/index.md', {
  excerpt: true,
  transform: toEntries
})
