---
title: 配套材料与下载
description: AI 编程入门讲义的 Skill、MCP 配置、API 程序与项目记录模板。
outline: [2, 3]
pageClass: ai-course-article
---

<MagHero eyebrow="从想法到作品 / TOOLKIT" title="动手时，把它们放在身边。" subtitle="先查看用途和内容，再把需要的文件带回自己的项目。" />

<div class="course-actions">
<a class="course-file-button" href="/ai-programming/ai-programming-handbook.zip" download>下载完整讲义包 ↓</a>
<a href="/resources/ai-programming/">返回讲义导读</a>
</div>

完整包保留原讲义目录，包含 README、连续阅读版、分章正文、随查与配套材料；解压后可在 Markdown 阅读器中使用。

## 第五章 · 小游戏检查 Skill

这份技能组织“读规则、安排场景、记录现象、整理问题”的方法。安装位置按当前工具的约定选择。

[查看技能全文](/resources/ai-programming/materials/skill) · <a href="/ai-programming/files/skills/playable-review/SKILL.md" download>下载 SKILL.md</a> · [回到第五章](/resources/ai-programming/chapters/05)

## 第六章 · Playwright MCP 配置

这份 JSON 是讲义中的本地服务配置示例，用已安装的 Microsoft Edge 打开页面。配置含义与连接检查见[第六章](/resources/ai-programming/chapters/06)。

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "--registry=https://registry.npmmirror.com",
        "-y",
        "@playwright/mcp@latest",
        "--browser",
        "msedge"
      ]
    }
  }
}
```

<a href="/ai-programming/files/mcp/playwright.json" download>下载 playwright.json</a> · [查看工具准备](/resources/ai-programming/reference/tools)

## Python 选读 · API 配套程序

先使用示例的请求预览模式，读清将发送的内容；实际调用步骤见 [Python 选读](/resources/ai-programming/reference/python-api)。本网页的交互演示不发送模型请求。

| 文件 | 用途 | 下载 |
| --- | --- | --- |
| `api_client.py` | 共用请求封装 | <a href="/ai-programming/files/api/api_client.py" download>下载</a> |
| `first_call.py` | 第一次调用 | <a href="/ai-programming/files/api/first_call.py" download>下载</a> |
| `ask.py` | 输入自己的问题 | <a href="/ai-programming/files/api/ask.py" download>下载</a> |
| `notice_helper.py` | 通知整理示例 | <a href="/ai-programming/files/api/notice_helper.py" download>下载</a> |
| `.env.example` | 环境变量示例 | <a href="/ai-programming/files/api/env.example" download=".env.example">下载</a> |

[查看程序说明与源码](/resources/ai-programming/materials/api) · <a href="/ai-programming/api-examples.zip" download>打包下载 API 示例</a>

API 示例包中的 README 链接指向完整讲义的其他目录；需要离线交叉阅读时，使用本页顶部的完整讲义包。

## 每次修改之后 · 项目记录模板

记下目标、运行方法、已作出的决定、当前结果和下一步。下一次对话就能从这里接着走。

[预览记录模板](/resources/ai-programming/materials/project-record) · <a href="/ai-programming/files/项目记录.md" download>下载 Markdown 模板</a>
