# 活动总览页

活动索引和某一期活动的导航入口都属于总览页，使用 `ActivityOverview.vue`，不要套内容页侧栏或卡片墙。讲义、回顾正文等内容页保留原侧栏。

Markdown 入口设置 `sidebar: false`、`aside: false`、`outline: false`、`prev: false`、`next: false`、`pageClass: activity-overview`，导入该页的 Landing 组件。

`ActivityOverview` 接收两行中文 `title`、刊头 `label`、主入口 `primary`、可选次入口 `secondary` 和目录标签 `contentsLabel`。`cover` 插槽放该页独立设计的封面 SVG（可用 `data-cover-piece`、`data-cover-peg`、`data-cover-line` 接入入场动画）；未提供插槽时可选用 `english` 两行英文作为后备。`artwork` 插槽放该页专属 SVG，默认插槽放目录及资源。先封页，再 SVG 概览，再实际目录。

每页独立设计 SVG 构图，不固定为三段式。使用 `useOverviewArtworkMotion` 管理可见性、封页状态和减少动态效果。`data-art-reveal` 用于插图主体入场，`data-art-draw` 用于短路径描画，`data-art-pop` 用于小部件落位，`data-art-row` 用于序列变化，`data-art-finish` 用于完成反馈。静态 SVG 必须已经是完整画面，动画只做增强。

`overview.css` 的所有版式规则限于 `.activity-journal` / `.activity-overview`。目录沿用 `.journal-chapter` 和 `.journal-section__head` 接入滚动阻尼；交互沿用课程封页状态机，但锚点为 `#activity-content` / `#activity-cover`。底部 SVG 不获得滚动锁，也不等待动画结束再切页。

检查：`npm run build` 后重启 `npm run preview -- --port 4174 --host 0.0.0.0`，执行 `node scripts/check-activity-overviews.mjs --all`。修改共用切页逻辑时另跑 `node scripts/check-course-cover.mjs`。
