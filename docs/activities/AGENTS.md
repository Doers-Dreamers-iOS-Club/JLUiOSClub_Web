# 活动详情的创作规范

本目录的活动详情、活动介绍、回顾与讲义统一使用杂志文章风格。参考 `261011-autumn-welcome/index.md`、`261016-huawei-ict/index.md`、`261025-idea-workshop/index.md`；下载模板在 `docs/public/templates/activity.md` 和 `lesson.md`。

- 每个详情页使用一个 `MagArticle`，frontmatter 设置 `pageClass: mag-article-page`，关闭 sidebar、aside、outline、prev、next、lastUpdated、editLink。文章组件输出唯一 h1，正文从 h2 开始。
- 标题、导语、日期从 `$frontmatter` 传入；填写 issue 和 category。用 kind 区分活动介绍、活动回顾和活动讲义；author 使用当时署名。日期用带引号的 ISO 字符串。只有记录日期时明确使用 `date-label="记录日期"`，不能把目录推断日期写成已核实的活动日期。
- 宋体标题、单栏正文、编号章节、少量摘句、图注与文末导航由组件统一提供。活动事实写成段落或 `article-facts` 资料栏；不要将整篇内容拆成 MagCard 卡片墙或 MagStep 容器，不再使用 MagHero 重复输出标题。
- 正文中的照片、代码、表格、步骤、链接和交互按原资料保留。截图用 MagFigure 或 `MagGrid media`，提供准确 alt、图注与原始 width/height。首张插图 eager，其余 lazy，统一 decoding="async"；浏览器会提前加载接近视口的图片。不能为缺少照片的文章编造现场图片。
- 长讲义提供 `<details class="article-contents">` 可点击目录；已有手动章节编号使用 `:numbered="false"`，避免重复编号。调整标题时用 `{#原锚点}` 保留旧链接。保留提示、弹窗、代码复制等必要交互，正文不等待动画完成才显示。
- 历史预告保持历史语境，不改写成未经证实的现场回顾。只做版式迁移时不擅改日期、人物、活动安排、代码示例或外链。
- 活动总目录 `index.md`、Winter Swift 等专题总览仍使用 ActivityOverview；本规范针对详情正文，不改动总览的封面与滚动行为。
- 修改后运行类型检查与构建；在本地预览执行 `node scripts/check-activity-articles.mjs http://localhost:4175`，检查桌面、320/390px、深浅色、目录锚点、图片、代码滚动和原交互。截图检查排版后再提交。

详情页面内容保留在 Markdown；共用排版在 `.vitepress/theme/components/MagArticle.vue`。不要为每篇文章复制 CSS 或另造页面框架。
