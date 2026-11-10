export interface NavigationLink {
  title: string
  href: string
}

export interface PageNavigation {
  section: NavigationLink
  series?: NavigationLink
  index: NavigationLink
}

export const learningActivitySlugs = [
  '260209-winter-swift',
  '251102-AI-Agent',
  '251018-vibe-coding',
  '250518-ai-workshop',
] as const

const learningActivityPattern = `(?:${learningActivitySlugs.join('|')})(?:/|$)`
export const learningActiveMatch = `^/(?:resources(?:/|$)|activities/${learningActivityPattern})`
export const activitiesActiveMatch = `^/activities(?:/(?!${learningActivityPattern})|$)`
export const updatesActiveMatch = `(?:${activitiesActiveMatch})|^/news(?:/|$)`

const learningSection = { title: '学习中心', href: '/resources/' }
const activitiesSection = { title: '活动与动态', href: '/activities/#activity-content' }

/** Resolve navigation by content purpose while preserving existing page URLs. */
export function getPageNavigation(relativePath: string): PageNavigation {
  const path = '/' + relativePath.replace(/^\/+/, '').replace(/(?:index)?\.md$/, '').replace(/\/$/, '')
  const within = (prefix: string) => path === prefix || path.startsWith(prefix + '/')

  if (within('/resources/ai-programming')) {
    const series = { title: 'AI 编程入门', href: '/resources/ai-programming/#course-content' }
    return { section: learningSection, series, index: { title: '返回课程目录', href: series.href } }
  }
  if (within('/activities/260209-winter-swift')) {
    const series = { title: 'Winter Swift', href: '/activities/260209-winter-swift/#activity-content' }
    return { section: learningSection, series, index: { title: '返回培训目录', href: series.href } }
  }
  if (learningActivitySlugs.some(slug => within('/activities/' + slug))) {
    return { section: learningSection, index: { title: '返回学习中心', href: learningSection.href } }
  }
  if (within('/activities')) {
    return { section: activitiesSection, index: { title: '返回活动目录', href: activitiesSection.href } }
  }
  if (within('/news')) {
    return { section: activitiesSection, index: { title: '返回新闻目录', href: '/news/' } }
  }
  if (within('/competitions')) {
    const section = { title: '竞赛', href: '/competitions/' }
    return { section, index: { title: '返回竞赛目录', href: section.href } }
  }
  if (within('/about-us')) {
    const section = { title: '关于社团', href: '/about-us/' }
    return { section, index: { title: '返回关于社团', href: section.href } }
  }
  if (within('/join-us')) {
    const section = { title: '加入我们', href: '/join-us/' }
    return { section, index: { title: '返回加入我们', href: section.href } }
  }
  return { section: learningSection, index: { title: '返回学习中心', href: learningSection.href } }
}
