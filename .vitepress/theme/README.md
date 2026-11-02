# 主题与组件说明

本主题把原先散落在各页面 `<style scoped>` 里的版式，收敛成一套全局注册的 Vue 组件。

**新增一个页面时不需要写任何 CSS**，也不需要 `import`——直接用下面的组件即可。

视觉方向是**编辑杂志风**：衬线大标题、纸面背景、期号/年份编号、细规则线。
卡片的交互语言是**便利贴**：索引网格项是完整的彩色便签（纸面颜色由标题散列、
顶部胶带、静止翘角、错落倾斜），hover 掀起一角，点击撕下后淡化跳转到对应页面。
所有颜色、字号、间距、阴影都来自 `styles/tokens.css`（亮/暗两套），
**改主题只需要动那一个文件**，不要在组件里写死颜色值。

## 目录结构

```
.vitepress/
├── theme/
│   ├── index.ts              # 全局注册组件、挂载动效、注入首页首屏（ASCII logo + CursorWave）
│   ├── styles/
│   │   ├── tokens.css        # 设计令牌（颜色/字阶/间距/阴影/动效曲线）
│   │   ├── base.css          # VitePress 默认主题覆写
│   │   └── motion.css        # 滚动揭示 + 路由转场
│   ├── composables/
│   │   ├── useReveal.ts      # IntersectionObserver 揭示逻辑（markdown 原生 DOM）
│   │   ├── useMotionReady.ts # SSG 安全的动效开关（水合 + prefers-reduced-motion）
│   │   ├── useRouteEnter.ts  # 路由进入转场（撕下转场的淡化入场也在这里分流）
│   │   └── useNoteTear.ts    # 「撕下便签 → 淡化」点击转场编排（MagArchive 网格 / MagCard 使用）
│   └── components/           # 下表中的所有组件
└── data/
    ├── shared.ts             # RecordEntry 类型 + toEntries() 派生（year/issue）
    ├── activities.data.mts   # 活动索引（自动收集）
    ├── news.data.mts         # 新闻索引（自动收集）
    └── competitions.data.mts # 竞赛索引（自动收集）
```

> 数据加载器必须用 `.data.mts` 后缀。本项目的 `package.json` 没有 `"type": "module"`，
> `.data.ts` 会被当成 CJS 加载，而 `vitepress` 是 ESM 包，构建会直接失败。

## 新增一个活动页

1. 建目录 `docs/activities/<YYMMDD-slug>/index.md`，目录名的 `YYMMDD` 前缀会被用来推断日期；
2. 写 frontmatter：

```yaml
---
title: "活动标题"
description: "一句话简介，会作为索引页的摘要"
date: 2026.03.01          # 可省略，省略时从目录名推断
icon: "🚀"                 # 索引页封面上的字形
tags: [Swift, 工作坊]
---
```

3. 正文用下面的组件拼版式。

**索引页会自动收录，不需要手动登记。** 但侧边栏导航仍由 `.vitepress/sidebar.ts` 控制，
如果希望它出现在侧栏，需要在那里加一条。

## 索引页怎么来的（数据层）

`createContentLoader` 收集各类目录下的 `*/index.md`，`toEntries()` 排序后派生两个字段：

- `year`：由 `date`/`timestamp` 推断，用于时间线按年份分组；无日期的归到「未归档」；
- `issue`：按期数自动编号（`№ 01` 递增，最新一期号最大），新增文章后所有期号自动重排。

竞赛页（`competitions/*/index.md`）想要出现在索引里，同样需要 `date`/`icon`/`tags` frontmatter。

## 组件一览

| 组件 | 用途 | 主要 props |
| --- | --- | --- |
| `MagHero` | 刊头页头（首屏入场编排） | `title` `subtitle` `eyebrow` `issue` `date` `entrance` |
| `MagSection` | 章节分隔标题 | `title` `icon` `n`（渲染 `01 /` 编号） |
| `MagGrid` | 响应式网格容器 | `cols`（桌面列数）`media`（图集模式） |
| `MagCard` | 卡片 | `icon` `title` `tag` `href` `compact` |
| `MagStep` | 编号步骤 | `n` `title`（都省略时退化为普通内容块） |
| `MagNote` | 提示 / 强调块 | `type`: `highlight` \| `tip` \| `warn`，`title` `icon` |
| `MagFigure` | 配图 | `caption` `maxHeight` `plain`（无装裱，用于 logo）；相对路径图片放插槽，见下 |
| `MagTimeline` / `MagTimelineItem` | 纵向时间线 | `tag` `title` |
| `MagBadge` | 行内胶囊标签 | `type`: `default` \| `accent` \| `warn` |
| `MagArchive` | 杂志式索引（时间线 / 网格双视图） | `source`: `activities` \| `news` \| `competitions`，`limit` `view` `showViewToggle` `highlightLatest` |
| `MagButton` | 按钮（替代 el-button） | `href` `variant`: `primary` \| `ghost`，`block` |
| `MagCarousel` | 轮播图（替代 el-carousel） | `autoplay`（间隔毫秒）；图片放插槽 |
| `MagModal` | 弹窗（原生 `<dialog>`） | `title` `width`；插槽 `trigger`（拿 `open`）/ 默认 / `footer`（拿 `close`） |
| `AsciiHero` | 首页首屏：Swift 徽章的 3D ASCII 打印（可拖拽） | 无 |
| `CursorWave` | 首页全屏背景：跟随光标的网格波纹 | 无 |

## 写法示例

```html
<MagHero title="Vibe Coding" subtitle="AI 时代的开发新方式" date="2025.10.18" />

<MagSection n="01" title="活动信息" />

<MagGrid :cols="4">
  <MagCard icon="🗓️" title="活动日期">2025年10月18日</MagCard>
  <MagCard icon="📍" title="活动地点">南区计算机楼 B110</MagCard>
</MagGrid>

<MagStep :n="1" title="打开 Xcode 并创建新项目">
  <p>说明文字。</p>
</MagStep>

<MagFigure caption="图 1：启动界面">
  <img src="./shots/1.png" alt="Xcode 启动界面" />
</MagFigure>

<MagNote type="tip" title="小提示">正文……</MagNote>

<MagButton href="https://example.com" block>立即报名</MagButton>

<MagModal title="请选择场次">
  <template #trigger="{ open }">
    <MagButton @click="open">报名</MagButton>
  </template>
  <p>弹窗内容</p>
</MagModal>
```

### 三个容易踩的点

- **站内相对路径的图片必须放进 `MagFigure` 的插槽**，不能写成 `src` prop：

  ```html
  <!-- 对 -->
  <MagFigure caption="图 1">
    <img src="./imgs/1.png" alt="说明" />
  </MagFigure>

  <!-- 错：构建产物里会缺图 -->
  <MagFigure src="./imgs/1.png" caption="图 1" />
  ```

  因为 VitePress 只重写 markdown 中 `<img src>` 的路径；写成 prop 后它只是一个
  普通字符串，Vite 不会把这张图当作资源打包。`/public` 下的绝对路径不受影响，
  可以直接用 `src` prop。

- **插槽里想写 markdown，前后要留空行**，否则会被当成纯 HTML：

  ```html
  <MagCard title="示例">

  这里可以用 **markdown**。

  </MagCard>
  ```

- **组件的 `<style scoped>` 管不到插槽内容**（插槽带的是父组件的 scope id）。
  给插槽内容加样式必须用 `:deep()`，各组件里已经处理了常见的 `p` / `ul` / `h3` / `a`。

## 动效：两套系统各管各的

| 系统 | 负责 | 用法 |
| --- | --- | --- |
| `useReveal`（IntersectionObserver + CSS） | markdown 原生 DOM 的滚动揭示 | 对 `.vp-doc` 顶层区块和 `[data-mag-stagger]` 子元素自动生效，页面零配置 |
| motion-v（`<Motion>` / `useScroll` / `animate()`） | 组件级编排 | MagHero 首屏入场、MagArchive 时间线 scrub、首页 hero、路由转场 |
| `useNoteTear`（模块级编排 + CSS keyframes） | 便签卡片的点击转场 | 被点卡片克隆为挂在 body 上的「幽灵」独立播撕下动画（拽角→脱胶回弹→甩出），同时其余内容淡出 → 切路由 → 新页在幽灵下方纯淡入（`mag-enter-tear`，useRouteEnter 分流），幽灵飞完才消散 |

规则：

- 想让某个元素不参与动效，加 `class="mag-no-reveal"`；
- **凡被 motion-v 接管的组件根元素必须有 `mag-no-reveal`**，且不能放进 `data-mag-stagger` 容器；
- 组件里写 motion-v 动画必须过 `useMotionReady()` 的 `animate` 守卫——SSR 永远输出可见终态，
  隐藏态只在水合后启用，**绝不把 `opacity: 0` 写进 SSR 输出**；
- 系统开启「减弱动态效果」时，所有动效与背景动画都会自动停用。

## 字体分工

- **衬线**（`--mag-font-serif`，系统栈零加载）：只用于 display 标题（vp-doc h1/h2、刊头、年份、期号）；
- **无衬线**：正文、小标、卡片、按钮等一切界面文字。


## AI 编程入门：内容交互

`components/learning/` 提供静态封面、阅读标记、六轮对话和章节小题。新增图解统一通过 `<LearningIllustration scene="..." />` 按需加载，章节只引用需要的场景，首页不加载这些图解。

| scene | 内容 |
| --- | --- |
| project | 规则选择与作品预览 |
| context | 上下文桌面，点选或拖入材料 |
| pause | 暂停、继续、结束与重开的状态剖面 |
| timers | 正常与重复计时器的对照实验 |
| versions | 版本画面、真实节选差异与模拟恢复 |
| skill | 方法、事实、任务与工具能力归类 |
| mcp | MCP 接线台，模拟连接故障与返回结果 |
| api | 预设请求信封、失败路径与分段响应 |
| observe / feedback | 试玩与反馈的短分镜 |

组件位于 `components/learning/illustrations/`。`LabFrame` 与 `lab.css` 管理纸面、控件和观察笔记，`useLabPlayback` 管理用户启动的单时钟与停止条件，`SnakeScene` 提供共用 SVG。新增动画使用主题令牌，遵守减少动态效果；离屏、切页与标签隐藏会停止播放。状态改变独立于 CSS 动画完成事件。

所有场景都是教学模拟，不发送模型请求、连接真实 MCP 服务或操作仓库。旧 SnakeLab / FlowExplorer 文件保留作参考，已不在章节或全局组件注册中使用。验证入口：`node scripts/check-ai-course.mjs <本地预览地址>`。
