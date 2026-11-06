---
title: 网页维护指南
description: JLU iOS Club 官网的写作组件、动画展示、页面模板与开发流程。
---

<MagHero title="网页维护指南">

从记录一次活动，到扩展一个交互示例，在这里找到可以直接使用的组件、动画和模板。

</MagHero>

## 从这里开始

<MagGrid :cols="2">
  <MagCard title="内容写作与组件" href="/about-us/maintenance/components">

用 Markdown 和现成的 Mag 组件组织正文。查看卡片、步骤、图片、弹窗与轮播的实际效果，复制对应代码。

  </MagCard>
  <MagCard title="动画展示与复用" href="/about-us/maintenance/animations">

预览教学图解、封面插画与滚动文字，重播动画并复制使用示例。首页与页面切换效果可前往实际页面体验。

  </MagCard>
  <MagCard title="开发与维护" href="/about-us/maintenance/development">

启动本地环境，了解目录职责、内容索引和动画生命周期，完成修改后的检查。

  </MagCard>
</MagGrid>

## 复制页面模板

- [下载活动页模板](/templates/activity.md){download="activity.md"}：适合活动介绍、日程和资料入口。
- [下载讲义模板](/templates/lesson.md){download="lesson.md"}：适合分节教学、操作步骤和练习。

模板源文件位于 `docs/public/templates/`。活动页保存为 `docs/activities/YYMMDD-slug/index.md`，讲义放在对应专题目录，图片与页面就近保存。具体写作方式见 [内容写作与组件](/about-us/maintenance/components)。

<MagNote type="tip" title="先组合已有内容">

普通页面直接使用 Markdown 与全局注册的 Mag 组件；需要动画时从展示页挑选现有示例。只有确实需要新的行为时，再按照开发指南扩展组件。

</MagNote>
