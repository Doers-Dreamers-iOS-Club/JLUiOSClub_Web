export const courseBase = '/resources/ai-programming/'
export const chapters = [
  { id: '01', title: '先让一个想法动起来', summary: '从第一份任务开始，做出并试玩基础贪吃蛇。', label: '从零开始' },
  { id: '02', title: '让 Agent 沿着你的想法做', summary: '沿六轮对话，把“慢一点”变成可检查的修改。', label: '表达与协作' },
  { id: '03', title: '为了改好它，我们需要学什么', summary: '理解计时与状态，把暂停功能说准确。', label: '边做边学' },
  { id: '04', title: '改坏了、走偏了，怎样继续', summary: '复现问题、检查修复，把可用版本留下来。', label: '排错与恢复' },
  { id: '05', title: '把好用的方法变成 Skill', summary: '把重复的检查方法，整理成自己的技能。', label: '方法的复用' },
  { id: '06', title: '用 MCP 让 Agent 真正操作作品', summary: '连接浏览器工具，让检查真正发生。', label: '工具与行动' }
] as const

export type ChapterId = typeof chapters[number]['id']
export const chapterIds: readonly string[] = chapters.map(chapter => chapter.id)
