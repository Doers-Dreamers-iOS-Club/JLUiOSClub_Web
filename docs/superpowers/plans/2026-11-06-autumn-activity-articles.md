# 秋季活动杂志文章实施计划

**目标：** 把三份原稿整理成三篇可连续阅读的活动回顾，接入活动目录。

**结构：** MagArticle 提供刊头、正文容器与文末导航；Markdown 保存文章内容。组件只使用 Vue props 和 CSS，不新增播放状态或运行时数据层。

- [x] 新建 `.vitepress/theme/components/MagArticle.vue`，接收 title、description、date、issue、category、next，正文使用默认插槽。样式为局部刊头与正文排版，并通过 mag-article-page 限定 VitePress 容器覆盖。
- [x] 在 `components/register.ts` 与 `.vitepress/env.d.ts` 登记组件。
- [x] 新建 `docs/activities/261011-autumn-welcome/index.md`、`261016-huawei-ict/index.md`、`261025-idea-workshop/index.md`。日期使用引号包裹的 ISO 字符串，隐藏侧栏，完整保留原稿关键事实，第三篇不重复缩减稿，统一蒋锋姓名。
- [x] 更新 `.vitepress/sidebar.ts` 最新活动入口；在维护指南 components.md 和主题 README 中记录组件用法。
- [x] 运行 `npm run typecheck` 与 `npm run build`；重启 4175 预览。用浏览器检查三页的唯一 h1、日期、完整章节、索引排序、文末导航和 no-JS 正文，截图检查 1440/390/320px 与深色模式。
- [x] 修正发现的版式问题，检查 git diff，使用 Hean-Yi 身份提交并保持预览。
