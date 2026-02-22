import { DefaultTheme } from "vitepress";

const sidebar: DefaultTheme.Sidebar = {
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
          { text: '解锁iPad生产力', link: '/' },
          { text: '2023冬季WWDC-Swift特训营', link: '/' },
          { text: '购买Mac/iPad迎接高校生活——选购建议&经验分享', link: '/' },
          { text: 'macOS初体验', link: '/' },
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
