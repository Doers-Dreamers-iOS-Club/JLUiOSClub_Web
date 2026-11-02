# 主题与组件说明

本主题把原先散落在各页面 `<style scoped>` 里的版式，收敛成一套全局注册的 Vue 组件。

**新增一个页面时不需要写任何 CSS**，也不需要 `import`——直接用下面的组件即可。

视觉方向为克制阅读：保留白灰蓝配色与深浅模式，以统一无衬线字体、400/500 字重、细描边和留白组织内容。正文标题为 22/18/16px，首页允许 36–60px 的展示标题。代码使用等宽字体。卡片无阴影、无纸角；链接立即跳转。图标使用 Tabler outline。

设计令牌在 `styles/tokens.css`，默认主题覆写在 `styles/base.css`，教学交互在 `components/learning/illustrations/lab.css`。背景、文字与边框只消费主题变量。

## 目录结构

```
.vitepress/
├── theme/
│   ├── index.ts              # 全局注册组件、挂载 GSAP 动效及图片缩放
│   ├── styles/
│   │   ├── tokens.css        # 设计令牌（颜色/字阶/间距/阴影/动效曲线）
│   │   ├── base.css          # VitePress 默认主题覆写
│   │   └── motion.css        # 减少动态效果和打印样式
│   ├── composables/
│   │   ├── useReveal.ts      # GSAP 入场 + IntersectionObserver 栏目揭示
│   │   ├── useMotionReady.ts # SSG 安全的动效开关（水合 + prefers-reduced-motion）
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
cover: "/example.jpg"     # 可选的活动照片
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
| `ClubHome` | 首页介绍、学习入口、活动和社团入口 | 无 |
| `MagHero` | 阅读页页头（短淡入） | `title` `subtitle` `eyebrow` `issue` `date` `entrance` |
| `MagSection` | 章节分隔标题 | `title` `n`（轻量编号） |
| `MagGrid` | 响应式网格容器 | `cols`（桌面列数）`media`（图集模式） |
| `MagCard` | 卡片（icon 参数兼容保留，不展示装饰 emoji） | `title` `tag` `href` `compact` |
| `MagStep` | 编号步骤 | `n` `title`（都省略时退化为普通内容块） |
| `MagNote` | 提示 / 强调块 | `type`: `highlight` \| `tip` \| `warn`，`title` `icon` |
| `MagFigure` | 配图 | `caption` `maxHeight` `plain`（无装裱，用于 logo）；相对路径图片放插槽，见下 |
| `MagTimeline` / `MagTimelineItem` | 纵向时间线 | `tag` `title` |
| `MagBadge` | 行内胶囊标签 | `type`: `default` \| `accent` \| `warn` |
| `MagArchive` | 杂志式索引（时间线 / 网格双视图） | `source`: `activities` \| `news` \| `competitions`，`limit` `view` `showViewToggle` `highlightLatest` |
| `MagButton` | 按钮（替代 el-button） | `href` `variant`: `primary` \| `ghost`，`block` |
| `MagCarousel` | 轮播图（替代 el-carousel） | `autoplay`（间隔毫秒）；图片放插槽 |
| `MagModal` | 弹窗（原生 `<dialog>`） | `title` `width`；插槽 `trigger`（拿 `open`）/ 默认 / `footer`（拿 `close`） |

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

## 动效

`useReveal.ts` 统一管理 GSAP 与 IntersectionObserver。SSR 默认可见；首页整行标题短暂上移、页头淡入。正文段落不隐藏，鼠标点击不等待离场动画。

| 标记 | 行为 |
| --- | --- |
| `data-mag-line` | 首页整行上移显现，0.75 秒 |
| `data-mag-enter` | 页头短淡入，0.55 秒、8px |
| `data-mag-reveal` | 栏目滚动入场，0.55 秒、12px |
| `data-mag-stagger` | 子项滚动入场，批次错开最多 0.14 秒 |

`gsap.matchMedia` 响应运行时减少动态效果偏好；路由变化时 revert 动画并断开观察器。页面卸载时释放动画与图片缩放实例。不要同时动画父子节点，不对正文逐段隐藏，不增加 blur 或循环背景动效。

官方参考：[gsap.matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/)。

验证：`npm run build` 后运行 `npm run preview -- --port 4173`，再执行、`node scripts/check-design.mjs http://localhost:4173` 和 `node scripts/check-ai-course.mjs http://localhost:5173`。设计截图默认输出到 `/private/tmp/club-design-qa`。

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
