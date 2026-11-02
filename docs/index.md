---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "JLU iOS Club"
  text: 一个教你从零开始创作专属App的社团
  tagline: return Create_your_First_iOS_App
  actions:
    - theme: brand
      text: 了解 iOS Club
      link: /about-us/index
    - theme: alt
      text: 从想法到作品 · AI 编程入门
      link: /resources/ai-programming/

features:
  - title: 社团背景
    icon: 🍎
    details: 吉林大学计算机科学与技术学院直属社团，由Apple中国官方提供支持，曾多次获得创新赛国家级奖项。
  - title: 核心任务
    icon: 👩🏻‍💻
    details: 面向果粉与Apple开发者提供App创作入门指南，培训指导同学参加「Swift学生挑战赛」与「移动应用创新赛」等各类创新创意赛。
  - title: 日常活动
    icon: 📅
    details: 每学期定期举行iOS应用开发入门讲座、苹果设备使用技巧分享会等活动，为吉大果粉提供丰富多彩的学习交流机会。
---

<MagSection n="04" title="从这里，开始创作" />

<MagGrid :cols="2">
<MagCard tag="新生入门 · 交互讲义" title="从想法到作品" href="/resources/ai-programming/">
从贪吃蛇开始，学会与 Agent 协作。六章主线、可操作的动态图和配套材料，陪你完成第一个小作品。
</MagCard>
<MagCard tag="Swift / SwiftUI" title="Winter Swift 培训" href="/activities/260209-winter-swift/">
围绕 CodeBreaker 项目，从界面搭建走向 Swift 进阶实战。
</MagCard>
<MagCard tag="往期工作坊" title="AI Agent 实战" href="/activities/251102-AI-Agent/">
用 Coze 与飞书多维表格，搭建日常记录助手。
</MagCard>
<MagCard tag="往期工作坊" title="Vibe Coding" href="/activities/251018-vibe-coding/">
体验 AI 辅助开发，探索自己的 App 创作方法。
</MagCard>
</MagGrid>

<MagSection n="05" title="最新动态" />

<MagArchive source="activities" :limit="3" :show-view-toggle="false" />

<div class="mag-more">
  <a href="/activities/">查看全部活动 →</a>
</div>
