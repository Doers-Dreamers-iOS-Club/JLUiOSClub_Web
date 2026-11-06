# 活动总览页

活动索引和某一期活动的导航入口都属于总览页，使用 `ActivityOverview.vue`，不要套内容页侧栏或卡片墙。活动详情、介绍、讲义与回顾正文统一使用 `MagArticle` 和 `pageClass: mag-article-page`，启用杂志目录侧栏，以连续文章组织内容。具体创作规范见 `docs/activities/AGENTS.md` 和网页维护指南，长讲义使用文内可点击目录。

Markdown 入口设置 `sidebar: false`、`aside: false`、`outline: false`、`prev: false`、`next: false`、`pageClass: activity-overview`，导入该页的 Landing 组件。

`ActivityOverview` 接收两行中文 `title`、刊头 `label`、主入口 `primary`、可选次入口 `secondary` 和目录标签 `contentsLabel`。`cover` 插槽放该页独立设计的封面 SVG（可用 `data-cover-piece`、`data-cover-peg`、`data-cover-line` 接入入场动画）；未提供插槽时可选用 `english` 两行英文作为后备。`artwork` 插槽放该页专属 SVG，默认插槽放目录及资源。先封页，再 SVG 概览，再实际目录。

每页独立设计 SVG 构图，不固定为三段式。使用 `useOverviewArtworkMotion` 管理可见性、封页状态和减少动态效果。`data-art-reveal` 用于插图主体入场，`data-art-draw` 用于短路径描画，`data-art-pop` 用于小部件落位，`data-art-row` 用于序列变化，`data-art-finish` 用于完成反馈。静态 SVG 必须已经是完整画面，动画只做增强。

插图的 SSR 根节点设置 `data-art-state="waiting"`，与 `styles/artwork-motion.css` 中的动画起点样式配合，避免翻页或直接打开内容锚点时先闪出完成态。CSS 起点必须与时间线的 `from` 值同步；用户翻页时，通过 `course-cover-prepare` 在过渡开始前准备首屏插图，过渡结束后才播放，屏外插图仍延迟初始化。滚动动画只初始化视口下方的内容，不能把已经显示的目录移回动画起点。禁用 JavaScript、减少动态效果和打印时显示完整静态插图。修改后运行 `node scripts/check-artwork-first-frame.mjs` 和 `node scripts/check-content-settle.mjs` 检查首帧、锚点直达及翻页后的位置稳定性。

`overview.css` 的所有版式规则限于 `.activity-journal` / `.activity-overview`。目录沿用 `.journal-chapter` 和 `.journal-section__head` 接入滚动阻尼；交互沿用课程封页状态机，但锚点为 `#activity-content` / `#activity-cover`。底部 SVG 不获得滚动锁，也不等待动画结束再切页。

检查：`npm run build` 后重启 `npm run preview -- --port 4174 --host 0.0.0.0`，执行 `node scripts/check-activity-overviews.mjs --all`。修改共用切页逻辑时另跑 `node scripts/check-course-cover.mjs`。

SVG 修改完成后必须先渲染实际页面截图，逐张查看浅色、深色与手机端的主体轮廓、线条交叉、文字遮挡和裁切；修正视觉问题后再 commit，不能只凭源码或构建通过判定完成。

`MagazineSidebar.vue` 将 `sidebar.ts` 的分组呈现为杂志目次，复用主页 `RollText`。`ClubSidebarGroup.vue` 仅在活动文章中替换目录内容，VitePress 继续负责抽屉与键盘操作，其他栏目保留默认侧栏。

目录保留「目次 / Contents & stories.」、简短链接和条目编号，最新活动固定展示前三篇，其余移入往期活动。`ClubLayout.vue` 管理桌面侧栏收起状态，切换文章时保持；移动端仍使用默认抽屉。

桌面开关位于侧栏最外沿，仅显示 `<` / `>`，无障碍名称保留。侧栏用 CSS 位移过渡，条目按顺序轻移淡入；正文通过 GSAP 衔接布局位置，不逐帧修改宽度。收起时立即设置 inert，减少动态效果时直接切换。
