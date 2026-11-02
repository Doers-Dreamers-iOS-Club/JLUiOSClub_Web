---
title: "准备一个能开始工作的环境"
description: "从想法到作品 · 准备一个能开始工作的环境"
outline: [2, 3]
pageClass: ai-course-article
---

<p class="course-kicker">随用随查 / FIELD NOTES</p>

# 准备一个能开始工作的环境

[回到阅读入口](/resources/ai-programming/)

我建议先选一款工具，把一次任务走完。这里用 ZCode 说明准备步骤；DSH 可以用来练习模型接入。Node.js 和 Python 等后续用到时再准备。

## 连接 ZCode

打开[官方安装页面](https://zcode.z.ai/cn/docs/install)，按系统与芯片下载安装。

- Windows：在系统“关于”中查看 x64 或 ARM64，选择对应版本。
- macOS：在“关于本机”中查看 Apple 芯片或 Intel，选择对应版本。

启动后按[模型连接说明](https://zcode.z.ai/cn/docs/configuration)完成授权或配置。先发一个普通问题，收到回答后再创建项目。连接时查看可用模型、额度和费用，选择适合自己的方式。

在“文档”里建立 `snake-lab`，在工具中选择这个工作目录。让 Agent 确认目录，再开始第一章。后面生成的文件都从这里找。

## 使用 DSH

打开 [DeepSeek Harness 官网](https://www.deepseek.com/harness/)，点击“下载桌面端”。目前页面提供 Windows 64 位与 macOS Apple 芯片安装包。选择与电脑匹配的版本，安装后打开应用。

按[DSH 模型接入说明](/resources/ai-programming/chapters/api-setup)，进入设置，填入自己的密钥，选择模型并发送一条消息。再选择项目目录，让 Agent 概括里面的文件。

## 第六章用到 Node.js 与浏览器

从 [Node.js 中文下载页](https://nodejs.cn/download/)选择 LTS 版本和对应系统的安装包，也可以使用[华为云 Node.js 镜像](https://repo.huaweicloud.com/nodejs/)。Windows 通常选择 `.msi`，macOS 选择 `.pkg`。芯片架构同样要与电脑对应。

安装后重新打开终端，运行：

```bash
node --version
npx --version
```

看到版本信息后，再填写第六章配置。配套配置通过国内 npm 镜像获取 Playwright MCP，并使用已安装的 Microsoft Edge；先确认电脑上有 Edge。`npx` 用于启动软件包，首次运行需要下载。

## 本地服务与 Python 选读

使用[华为云 Python 镜像](https://repo.huaweicloud.com/python/)，进入 Python 3 的正式版本目录。Windows 选择对应架构的 `.exe` 安装程序，macOS 选择 `.pkg`；Windows 安装时勾选将 Python 添加到 PATH。

安装后在终端检查：

```bash
python3 --version
```

Windows 也可以使用：

```powershell
py --version
```

第六章用它启动本地文件服务。想继续读 Python API 选读时，也用它运行配套程序；这些程序只使用标准库，无需安装 SDK。

## 先确认哪一步通了

| 看到什么 | 可以继续做什么 |
|---|---|
| 工具启动，模型能正常回答 | 选择项目目录，开始任务 |
| 项目目录出现 index.html | 用浏览器打开并试玩 |
| Node.js 与 npx 有版本输出，已安装 Edge | 配置 Playwright MCP |
| Python 有版本输出 | 启动本地服务；按需阅读 API 代码选读 |

遇到问题，把当前命令、完整提示、系统和操作步骤一起交给 Agent 分析。先弄清停在哪一步，再继续。


[返回讲义导读](/resources/ai-programming/)
