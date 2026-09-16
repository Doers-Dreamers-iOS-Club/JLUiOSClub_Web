/**
 * 索引页数据的共用转换逻辑
 * ---------------------------------------------------------------------------
 * 供 activities.data.ts / news.data.ts 复用。
 */
import type { ContentData } from 'vitepress'

export interface RecordEntry {
  url: string
  title: string
  summary: string
  /** 用于展示，如 "2025.10.18"；无法判定时为空串 */
  date: string
  /** 用于排序的时间戳，无法判定时为 0 */
  timestamp: number
  cover: string
  /** 无封面图时展示的字形（emoji 或单字） */
  icon: string
  tags: string[]
  /** 派生：归档年份（时间戳无法判定时为 0，模板层兜底「未归档」） */
  year: number
  /** 派生：期号，按全量倒序编号（最新一期最大），如 "07" → 展示为 № 07 */
  issue: string
}

/**
 * 目录名一律是 YYMMDD 前缀（如 251018-vibe-coding、240407-maic-and-vision-pro），
 * 所以 frontmatter 缺 date 时可以从 URL 反推，省去逐页补写。
 */
function dateFromUrl(url: string): { date: string; timestamp: number } {
  const match = url.match(/\/(\d{2})(\d{2})(\d{2})-/)
  if (!match) return { date: '', timestamp: 0 }

  const [, yy, mm, dd] = match
  const year = 2000 + Number(yy)
  const time = new Date(year, Number(mm) - 1, Number(dd)).getTime()
  return { date: `${year}.${mm}.${dd}`, timestamp: Number.isNaN(time) ? 0 : time }
}

function parseDate(raw: unknown, url: string): { date: string; timestamp: number } {
  if (typeof raw === 'string' || raw instanceof Date) {
    const text = raw instanceof Date ? raw.toISOString().slice(0, 10) : raw
    // 同时接受 2025.10.18 / 2025-10-18 / 2025/10/18
    const time = new Date(text.replace(/\./g, '-')).getTime()
    if (!Number.isNaN(time)) {
      return { date: text.replace(/-/g, '.'), timestamp: time }
    }
  }
  return dateFromUrl(url)
}

/** 摘要优先级：summary > description > 正文摘录 */
function pickSummary(fm: Record<string, any>, excerpt: string | undefined): string {
  if (typeof fm.summary === 'string' && fm.summary) return fm.summary
  if (typeof fm.description === 'string' && fm.description) return fm.description
  if (!excerpt) return ''
  return excerpt.replace(/<[^>]+>/g, '').trim().slice(0, 120)
}

export function toEntries(raw: ContentData[]): RecordEntry[] {
  const sorted = raw
    .map(({ url, frontmatter: fm, excerpt }) => {
      const { date, timestamp } = parseDate(fm.date, url)
      return {
        url,
        title: fm.title || fm.name || url,
        summary: pickSummary(fm, excerpt),
        date,
        timestamp,
        cover: fm.cover || '',
        icon: fm.icon || '',
        tags: Array.isArray(fm.tags) ? fm.tags.map(String) : []
      }
    })
    .sort((a, b) => b.timestamp - a.timestamp)

  // 派生字段：年份用于时间线分组；期号是全量倒序编号，新增一篇自动重排
  const total = sorted.length
  return sorted.map((entry, i) => ({
    ...entry,
    year: entry.timestamp ? new Date(entry.timestamp).getFullYear() : 0,
    issue: String(total - i).padStart(2, '0')
  }))
}
