import {DefaultTheme} from "vitepress";

const sidebar: DefaultTheme.Sidebar = {
  '/activities/':
    {
      base: '/activities/',
      items:
        [
          {
            text: '即将推出',
            items: [
              {text: '解锁iPad生产力', link: '/'},
              {text: '移动应用创新赛宣讲', link: '/'}
            ]
          },
          {
            text: '往期活动',
            items: [
              {text: '2023冬季WWDC-Swift特训营', link: '/'},
              {text: '购买Mac/iPad迎接高校生活——选购建议&经验分享', link: '/'},
              {text: 'macOS初体验', link: '/'},
              {text: '百团纳新', link: '/'}
            ]
          }
        ]
    }
  ,
  '/competitions/':
    {
      base: '/competitions/',
      items:
        [
          {
            text: '社团竞赛',
            items: [
              {text: '移动应用创新赛', link: '/maic/'},
              {text: 'Swift 学生挑战赛', link: '/swift/'}
            ]
          }
        ]
    }
}


export default sidebar