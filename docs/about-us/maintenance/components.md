---
title: 内容写作与组件
description: 用 Markdown 和现成组件编写活动页、讲义与资源页。
---

# 内容写作与组件

在 `docs/` 新建 Markdown 文件，就能编译成网页。下面的组件均已全局注册，直接使用即可，不需要 import，也不需要在页面里写 CSS。

先复制 [活动页模板](/templates/activity.md){download="activity.md"} 或 [讲义模板](/templates/lesson.md){download="lesson.md"}。活动页放在 `docs/activities/YYMMDD-slug/index.md`，活动索引自动收录；侧栏入口在 `.vitepress/sidebar.ts` 中维护。

## 页面信息

```yaml
---
title: Swift 入门工作坊
description: 一起做出第一个 SwiftUI 页面。
date: "2026-11-06"
---
```

日期使用带引号的 `YYYY-MM-DD`；只知道月份时可写 `"2026-11"`。有日期前缀的活动目录可以省略 date，由目录名推断。description 用于页面元信息；正文由 Markdown 与组件共同组成。

## 标题与章节

```html
<MagHero title="Swift 入门工作坊" date="2026.11.06" />
<MagSection n="01" title="活动安排" />
```

普通正文继续使用 `##`、`###`、列表、表格和代码块。`MagHero` 可用默认插槽放导语；没有 subtitle、eyebrow 或 issue 参数。

## 杂志文章

活动详情、介绍、回顾与讲义统一使用 `MagArticle`。实际效果见 [秋季纳新宣讲](/activities/261011-autumn-welcome/)、[华为 ICT 路演](/activities/261016-huawei-ict/) 和 [Find 主题交流](/activities/261025-idea-workshop/)。它提供刊头、导语、日期、编号章节、摘句和文末导航，正文仍然使用普通 Markdown。

```md
---
title: 一次从想法出发的相聚
description: 用一两句话介绍这次活动的主题与看点。
date: "2026-10-25"
sidebar: false
aside: false
outline: false
prev: false
next: false
lastUpdated: false
editLink: false
pageClass: mag-article-page
---

<MagArticle :title="$frontmatter.title" :description="$frontmatter.description" :date="$frontmatter.date" issue="01" category="秋季活动 · 交流回顾">

开篇用一段完整的叙述，把读者带进这次活动。

## 从一个问题开始

继续写正文。二级标题会自动编号，不需要在标题里重复写数字。

> 从原文中选取一句值得停下来读的话。

</MagArticle>
```

`title`、`description`、`date`、`issue`、`category` 为必填参数，日期使用 ISO 字符串。`kind` 默认“活动回顾”，可设为“活动介绍”或“活动讲义”；`author` 设置署名。仅知道记录日期时使用 `date-label="记录日期"`。已有手动章节编号时使用 `:numbered="false"`。`next` 可选，格式为 `{ title: '下一篇标题', href: '/activities/下一篇目录/' }`。组件已经输出一级标题，正文从二级标题开始。`pageClass` 应用于独立文章页；它只调整这一类页面的阅读宽度与页脚，不影响其他页面。长文以段落推进，少量摘句即可形成阅读节奏。

活动详情采用统一的单栏文章结构，事实资料使用段落或 `<div class="article-facts">`，不再把全文拆成卡片和步骤框。较长讲义可以参考 [SwiftUI 第一讲](/activities/260209-winter-swift/first) 的原生折叠目录；更换标题时使用 `{#原锚点}` 保留旧链接。照片与截图提供原始尺寸，首图提前加载、后续图片由浏览器在接近视口时加载。活动总目录和专题总览继续使用现有封面导航。

仓库内的创作约定位于 `docs/activities/AGENTS.md`；活动页与讲义下载模板也已采用此版式。

## 网格与卡片

<MagGrid :cols="2">
  <MagCard title="适合谁">

想用 **SwiftUI** 做出第一个页面的同学。

  </MagCard>
  <MagCard title="学习资源" href="/resources/">

查看讲义、工具与课程入口。

  </MagCard>
</MagGrid>

```html
<MagGrid :cols="2">
  <MagCard title="适合谁">

想用 **SwiftUI** 做出第一个页面的同学。

  </MagCard>
  <MagCard title="学习资源" href="/resources/">

查看讲义、工具与课程入口。

  </MagCard>
</MagGrid>
```

卡片可以只有标题，也可以包含正文。提供 href 后整张卡片成为链接，此时正文不要再嵌套链接或按钮。`compact` 缩小内边距。网格在窄屏自动调整列数。

## 提示与步骤

<MagNote type="tip" title="Markdown 插槽">

组件标签与 Markdown 正文之间保留空行，**加粗**、列表和链接才会正常编译。

</MagNote>

<MagStep :n="1" title="准备项目">

1. 打开 Xcode。
2. 创建一个 SwiftUI App。

</MagStep>

```html
<MagNote type="tip" title="准备工作">

请提前安装 Xcode。

</MagNote>

<MagStep :n="1" title="创建项目">

在 Xcode 中选择新建 App。

</MagStep>
```

`MagNote` 的 type 可选 `highlight`、`tip`、`warn`；`MagStep` 也可以省略编号，仅保留标题和内容。

## 图片与图集

<MagFigure caption="社团标志" plain maxHeight="8rem">
  <img src="/logo.png" alt="JLU iOS Club" loading="lazy" />
</MagFigure>

```html
<MagFigure caption="图 1：项目界面" maxHeight="24rem">
  <img src="./imgs/project.png" alt="项目主界面" loading="lazy" />
</MagFigure>
```

本地相对路径图片放在 `<img>` 插槽中，VitePress 才能打包资源。`docs/public/` 下的图片可用 `<MagFigure src="/logo.png" alt="社团标志" />`。需要并排时，将多个 `MagFigure` 放入 `MagGrid`；logo 可加 `plain` 去掉边框。

## 折叠内容

<MagDetails summary="展开查看排版约定">

组件负责布局，Markdown 负责内容。优先组合现有组件；新增通用组件时同步补充本页示例。

</MagDetails>

```html
<MagDetails summary="展开查看参考答案">

答案与解释放在这里。

</MagDetails>
```

折叠内容采用原生 details，键盘可操作，关闭 JavaScript 时仍可展开。添加 `open` 属性即可默认展开。

## 按钮与弹窗

<MagModal title="组件示例">
  <template #trigger="{ open }">
    <MagButton @click="open">打开示例弹窗</MagButton>
  </template>

这里可以放说明文字、图片或报名链接。

  <template #footer="{ close }">
    <MagButton variant="ghost" @click="close">关闭</MagButton>
  </template>
</MagModal>

```html
<MagButton href="/join-us/">加入我们</MagButton>

<MagModal title="活动报名">
  <template #trigger="{ open }">
    <MagButton @click="open">查看报名说明</MagButton>
  </template>

报名说明。

  <template #footer="{ close }">
    <MagButton variant="ghost" @click="close">关闭</MagButton>
  </template>
</MagModal>
```

按钮有 href 时渲染链接，否则渲染原生 button。弹窗支持 Escape 关闭与焦点返回。

## 轮播

<MagCarousel>
  <img src="/logo.png" alt="社团标志" loading="lazy" />
  <img src="/logo-hero.png" alt="社团完整标志" loading="lazy" />
</MagCarousel>

```html
<MagCarousel :autoplay="4000">
  <img src="./shots/1.png" alt="第一张活动照片" loading="lazy" />
  <img src="./shots/2.png" alt="第二张活动照片" loading="lazy" />
</MagCarousel>
```

默认不自动播放。开启后，离屏、后台、鼠标悬停、键盘焦点进入以及系统要求减少动态效果时暂停。图片直接放在组件里，不要额外套段落。

## 其余组件

| 组件 | 参数 | 用途 |
| --- | --- | --- |
| `MagBadge` | `type="default\|accent\|warn"` | 行内标签 |
| `MagTimeline` | 默认插槽 | 时间线容器 |
| `MagTimelineItem` | `title`、`tag` | 时间线节点 |
| `MagArchive` | `source="activities\|news\|competitions"`、`limit`、`view`、`showViewToggle` | 自动内容目录 |

## 提交前检查

执行 `npm ci` 安装锁定依赖，`npm run dev` 预览页面。检查手机宽度、图片、链接和代码块，再运行 `npm test`、`npm run typecheck` 与 `npm run build`。组件维护者可运行 `npm run check:components -- http://localhost:4173` 验证生产预览。
