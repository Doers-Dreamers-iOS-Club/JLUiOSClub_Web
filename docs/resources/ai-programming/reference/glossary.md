---
title: "需要时回来看：术语与小例子"
description: "从想法到作品 · 需要时回来看：术语与小例子"
outline: [2, 3]
pageClass: ai-course-article
---

<p class="course-kicker">随用随查 / FIELD NOTES</p>

# 需要时回来看：术语与小例子

[阅读入口](/resources/ai-programming/)

## 项目位置、入口与上下文

<a id="context"></a>

工作目录告诉 Agent 这次在哪个项目里工作；入口文件是运行作品的起点；上下文是模型当前实际收到并能利用的信息。文件在项目里，和它的相关内容已经送到模型，是两个不同环节。

当前练习可以对应为：选择 snake-lab，找到 index.html，再让 Agent 读取与速度有关的代码。对话要求、读取的片段和工具返回，共同帮助它理解这次任务。

## 计时与暂停

<a id="timer"></a>

如果当前实现用 setInterval，程序会反复安排一项处理，并得到一个计时器标识。clearInterval 使用这个标识停止相应计时安排。重开时若旧安排仍在、新安排又启动，就可能出现多个更新过程。

先让 Agent 说明当前代码怎样开始、停止和恢复，再对照一次暂停或重开观察。采用其他动画机制的项目，同样先追踪当前实现。

## 用小任务认识 Skill

<a id="skills"></a>

Agent Skills 的入门材料用掷骰子演示技能：在 SKILL.md 写清触发场景与执行方法，调用时观察它是否使用了指定工具。这让发现、读取、执行几个环节变得容易分辨。

我们的练习采用配套的 playable-review。它把检查方法写在文件中，调用时再提供当前项目、地址和重点。格式上，顶部的 name 是技能名称，description 说明什么时候使用，正文写工作方法。

想调整技能，先找一次实际使用中缺少的步骤，再修改并重试。项目事实留在项目说明里，跨任务使用的方法放进技能里。

## 浏览器工具与 MCP

<a id="mcp"></a>

MCP 将工具或数据等能力接到 Agent 应用中。应用与服务连接后，先看可用工具，再执行一个小调用，之后带回真实任务。

Playwright MCP 提供浏览器操作；我们的配置选用电脑上已有的 Microsoft Edge，通过国内 npm 镜像获取服务软件包。完整配置见[配套 JSON](/ai-programming/files/mcp/playwright.json)，操作过程见[第六章](/resources/ai-programming/chapters/06)。

## 保存版本与恢复

<a id="git"></a>

Git 的提交记录一组文件的版本；diff 显示差异；暂存区决定本次准备记录哪些修改。恢复前先看当前差异，再确定要回到哪个状态。

在当前练习里，git restore index.html 默认用索引内容还原工作区的这个文件，未暂存修改会被覆盖。想保留的内容先备份，再恢复。

## 案例来源

贪吃蛇起点参考 Datawhale Easy-Vibe；日常协作参考 Claude Code 的工作流材料；技能格式参考 Agent Skills，网页检查方法参考 Anthropic webapp-testing；浏览器工具案例参考微软 Playwright MCP；模型接入参考 DeepSeek Harness 的模型配置说明。

这里已经把当前练习需要的过程写进讲义。先按正文和配套文件完成自己的任务，再通过可访问的中文工具文档查具体入口。


[返回讲义导读](/resources/ai-programming/)
