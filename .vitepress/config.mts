import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: 'docs',
  title: "JLU iOS Club",
  description: "一个教你从零开始创作专属App的社团",
  head: [
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' }],
    ['link', { rel: 'manifest', href: '/favicon/site.webmanifest' }]
  ],
  sitemap: {
    hostname: 'https://jluios.club'
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',
    nav: [
      { text: '主页', link: '/' },
      { text: '社团活动', link: '/activities/' },
      { text: '竞赛指导', link: '/competitions/' },
    ],

    sidebar: {
      '/activities/': [
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
      ],
      '/competitions/': [
        {
          text: '社团竞赛',
          items: [
            {text: 'Swift 学生挑战赛', link: '/competitions/Swift-Student-Challenge'},
            {text: '移动应用创新赛', link: '/competitions/maic'}
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/AQiu-2003/JLUiOSClub_Web/' }
    ],

    footer: {
      message: 'Released under the <a href="https://github.com/AQiu-2003/JLUiOSClub_Web/blob/main/LICENSE">MIT License</a>.',
      copyright: 'Copyright © 2017-2024 吉林大学 Doers & Dreamers iOS Club'
    },

    search: {
      provider: 'local'
    }
  }
})
