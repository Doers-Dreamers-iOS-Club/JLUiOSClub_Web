import { chapters } from './data/course'
import type { DefaultTheme } from "vitepress";

const sidebar: DefaultTheme.Sidebar = {
  '/about-us/maintenance/': [
    {
      text: '网页维护指南',
      items: [
        { text: '维护指南总览', link: '/about-us/maintenance/' },
        { text: '内容写作与组件', link: '/about-us/maintenance/components' },
        { text: '动画展示与复用', link: '/about-us/maintenance/animations' },
        { text: '开发与维护', link: '/about-us/maintenance/development' },
      ]
    }
  ],
  '/resources/ai-programming/': {
    base: '/resources/ai-programming/',
    items: [
      { text: '从想法到作品', link: '' },
      { text: '主线课程', items: chapters.map(({ id, title }) => ({ text: `${id} · ${title}`, link: `chapters/${id}` })) },
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
          { text: '第一讲 · SwiftUI 入门', link: 'first/' },
          { text: '第二讲 · Swift 实战', link: 'second/' },
        ]
      },
      {
        text: '主线之外',
        items: [
          { text: '补充 · AI 编程', link: 'bonus-ai-programming/' },
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
          { text: '你的想法值得被听见', link: '261025-idea-workshop/' },
          { text: '华为 ICT 路演', link: '261016-huawei-ict/' },
          { text: '秋季纳新宣讲', link: '261011-autumn-welcome/' },
        ]
      },
      {
        text: '往期活动',
        items: [
          { text: 'Winter SwiftUI 工作坊', link: '260209-winter-swift/' },
          { text: 'AI Agent 实战', link: '251102-AI-Agent/' },
          { text: 'Vibe Coding 工作坊', link: '251018-vibe-coding/' },
          { text: 'AI工作坊', link: '250518-ai-workshop/' },
          { text: 'MAIC 宣讲会', link: '250511-maic-seminar/' },
          { text: 'Swift 暑期挑战', link: '240715-learn-swift-challenge/' },
          { text: 'Vision Pro · 第二期', link: '240601-learn-xcode-and-vision-pro/' },
          { text: 'Vision Pro · 第一期', link: '240519-learn-xcode-and-vision-pro/' },
          { text: 'MAIC 官方宣讲', link: '240420-maic-offical-seminar/' },
          { text: '百团纳新', link: '240414-club-recruitment/' },
          { text: 'MAIC 与 Vision Pro 体验', link: '240407-maic-and-vision-pro/' },
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
