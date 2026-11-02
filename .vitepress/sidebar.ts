import { DefaultTheme } from "vitepress";

const sidebar: DefaultTheme.Sidebar = {
  '/resources/ai-programming/': {
    base: '/resources/ai-programming/',
    items: [
      { text: '从想法到作品', link: '' },
      { text: '六章主线', items: [
        { text: '01 · 先让想法动起来', link: 'chapters/01' },
        { text: '02 · 让 Agent 沿着想法做', link: 'chapters/02' },
        { text: '03 · 为了改好它而学习', link: 'chapters/03' },
        { text: '04 · 排错、恢复与继续', link: 'chapters/04' },
        { text: '05 · 把方法变成 Skill', link: 'chapters/05' },
        { text: '06 · 用 MCP 操作作品', link: 'chapters/06' },
      ] },
      { text: '补充学习', items: [
        { text: '在 DSH 中接入模型', link: 'chapters/api-setup' },
        { text: '选读 · Python 调用 API', link: 'reference/python-api' },
      ] },
      { text: '随用随查', collapsed: false, items: [
        { text: '工具准备', link: 'reference/tools' },
        { text: '常用操作', link: 'reference/operations' },
        { text: '术语与例子', link: 'reference/glossary' },
        { text: '案例与文档', link: 'reference/sources' },
      ] },
      { text: '配套材料与下载', link: 'materials/' },
      { text: '连续阅读版', link: 'read-all' },
    ]
  },

  '/activities/260209-winter-swift/': {
    base: '/activities/260209-winter-swift/',
    items: [
      {
        text: '培训主线',
        items: [
          { text: '第一讲：SwiftUI 入门与 CodeBreaker 基础界面', link: 'first/' },
          { text: '第二讲：Swift 进阶与 CodeBreaker 实战', link: 'second/' },
        ]
      },
      {
        text: '主线之外',
        items: [
          { text: '补充讲座：现代 AI 编程全景', link: 'bonus-ai-programming/' },
        ]
      }
    ]
  },
  '/activities/': {
    base: '/activities/',
    items: [
      {
        text: '最新活动',
        items: [
          { text: 'Winter SwiftUI 入门工作坊', link: '260209-winter-swift/' },
          { text: '日常记录小能手 - AI Agent实战', link: '251102-AI-Agent/' },
          { text: 'Vibe Coding - AI辅助开发工作坊', link: '251018-vibe-coding/' },
        ]
      },
      {
        text: '往期活动',
        items: [
          { text: 'AI工作坊', link: '250518-ai-workshop/' },
          { text: 'MAIC移动应用创新赛宣讲会', link: '250511-maic-seminar/' },
          { text: 'Learn Swift! 暑期学习打卡挑战', link: '240715-learn-swift-challenge/' },
          { text: '深入了解 Vision Pro [2]', link: '240601-learn-xcode-and-vision-pro/' },
          { text: '深入了解 Vision Pro [1]', link: '240519-learn-xcode-and-vision-pro/' },
          { text: '移动应用创新赛-官方宣讲会', link: '240420-maic-offical-seminar/' },
          { text: '百团纳新', link: '240414-club-recruitment/' },
          { text: 'MAIC宣讲会暨Vision Pro体验会', link: '240407-maic-and-vision-pro/' },
        ]
      }
    ]
  }
  ,
  '/competitions/': {
    base: '/competitions/',
    items: [
      {
        text: '社团竞赛',
        items: [
          { text: '移动应用创新赛', link: 'maic/' },
          { text: 'Swift 学生挑战赛', link: 'swift/' }
        ]
      }
    ]
  },
  '/news/': {
    base: '/news/',
    items: [
      {
        text: '安诺希校园体验中心', link: 'an-nuo-xi/'
      }
    ]

  }
}


export default sidebar
