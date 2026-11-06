import type { ContentData } from 'vitepress'

export interface RecordEntry {
  url: string
  title: string
  date: string
  timestamp: number
  year: number
  cover: string
}

interface RecordFrontmatter {
  title: string
  date?: string | Date
  cover?: string
}

function recordDate(raw: RecordFrontmatter['date'], url: string) {
  const inferred = url.match(/\/(\d{2})(\d{2})(\d{2})-/)
  const text = raw instanceof Date ? raw.toISOString().slice(0, 10)
    : raw ?? (inferred ? `20${inferred[1]}.${inferred[2]}.${inferred[3]}` : '')
  if (!text) return { date: '', timestamp: 0, year: 0 }
  const date = new Date(text.replaceAll('.', '-'))
  // ISO conversion reports malformed authored dates during the build.
  const iso = date.toISOString()
  return { date: text.replaceAll('-', '.'), timestamp: date.getTime(), year: Number(iso.slice(0, 4)) }
}

export function toEntries(raw: ContentData[]): RecordEntry[] {
  return raw.map(({ url, frontmatter }) => {
    const { title, date, cover = '' } = frontmatter as RecordFrontmatter
    return { url, title, cover, ...recordDate(date, url) }
  }).sort((a, b) => b.timestamp - a.timestamp)
}

/** A single pass; preserve the input's year and record order. */
export function groupByYear<T extends { year: number }>(entries: readonly T[]) {
  const groups = new Map<number, T[]>()
  for (const entry of entries) {
    const group = groups.get(entry.year)
    if (group) group.push(entry)
    else groups.set(entry.year, [entry])
  }
  return Array.from(groups, ([year, entries]) => ({ year, entries }))
}
