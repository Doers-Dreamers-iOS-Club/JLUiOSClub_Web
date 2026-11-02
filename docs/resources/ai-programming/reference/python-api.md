---
title: "选读｜用 Python 调用模型 API"
description: "从想法到作品 · 选读｜用 Python 调用模型 API"
outline: [2, 3]
pageClass: ai-course-article
---

<p class="course-kicker">随用随查 / FIELD NOTES</p>

# 选读｜用 Python 调用模型 API

[阅读入口](/resources/ai-programming/) · [先看 DSH 接入](/resources/ai-programming/chapters/api-setup)

这一篇，我带大家单独走通一次模型 API 调用：准备账号和密钥，在电脑上发出一个问题，收到模型回答，再把这段调用做成自己能反复使用的小工具。

最后得到的工具在终端中运行。你输入“请帮我整理一份学习计划”，程序把问题发给模型，再把回答显示出来。先把这个过程做完整，以后想在自己的项目中使用模型，就有一份能参考的实现。

我们采用 DeepSeek 的接口和 Python。操作分成两条线：先按步骤跑通，再带着已经看到的结果读代码。解释性名词放在文末 PS，遇到需要时回来看。

## 第一步：把文件和运行环境准备好

打开配套材料中的 [api 文件夹说明](/resources/ai-programming/materials/api)，在电脑文件管理器里找到这个文件夹。里面有三份程序：

```text
api/
├── first_call.py     第一次调用，集中看完整过程
├── api_client.py     把请求和响应处理封装起来
└── ask.py            用命令行输入自己的问题
```

`first_call.py` 已经放在材料里，跟着操作时直接运行即可。读到后面的代码部分，再逐行对照。

先按[工具准备](/resources/ai-programming/reference/tools)安装 Python 3。然后在这个 `api` 文件夹中打开终端：

- **Windows**：在文件夹空白处右键，选择“在终端中打开”。本篇的 Windows 命令按 PowerShell 写。
- **macOS**：打开“终端”，输入 `cd` 和一个空格，把 `api` 文件夹拖进窗口，再按回车。

检查 Python：

```bash
# macOS / Linux
python3 --version
```

```powershell
# Windows PowerShell
py --version
```

**这一步的结果**：看到 Python 3 的版本号。再列出当前文件，Windows 用 `Get-ChildItem`，macOS / Linux 用 `ls`，确认看得到上面的三份程序。

如果显示找不到 Python，先处理安装与命令问题；如果看不到文件，先回到正确目录。环境和位置确认后，再接 API。

## 第二步：取得自己的 API 配置

打开 [DeepSeek API 控制台](https://platform.deepseek.com/)，登录后找到 API keys 或密钥管理入口，创建供本次练习使用的密钥。把它保存好，并在控制台确认当前可用额度。

我们先认识三项配置：

| 配置 | 在这次练习中的作用 | 怎样取得 |
|---|---|---|
| 服务地址 | 告诉程序去哪里请求模型 | 从服务商文档读取 |
| API Key | 让服务识别调用账号 | 在 API 控制台创建 |
| 模型名称 | 选择具体模型 | 按账号和官方文档填写 |

本例按 [DeepSeek 首次调用文档](https://api-docs.deepseek.com/zh-cn/)使用 `https://api.deepseek.com`，示例模型名为 `deepseek-flash`。程序实际请求的完整地址是 `https://api.deepseek.com/chat/completions`。

这里容易混淆两件事：网页上的聊天地址，和程序请求模型的服务地址。配置接口时，使用 API 文档给出的地址。模型名称也应使用接口规定的名称，和产品界面上的展示名称分开看。

接下来，把密钥放进当前终端的环境变量。把下面的占位文字换成自己的值。

**macOS / Linux：**

```bash
export DEEPSEEK_API_KEY='自己的密钥'
export DEEPSEEK_MODEL='deepseek-flash'
```

**Windows PowerShell：**

```powershell
$env:DEEPSEEK_API_KEY = '自己的密钥'
$env:DEEPSEEK_MODEL = 'deepseek-flash'
```

用一条只检查“有没有配置”的命令确认：

```bash
# macOS / Linux
python3 -c "import os; print(bool(os.environ.get('DEEPSEEK_API_KEY')))"
```

```powershell
# Windows PowerShell
py -c "import os; print(bool(os.environ.get('DEEPSEEK_API_KEY')))"
```

**这一步的结果**：输出 `True`。它只表示当前程序能读到变量；密钥是否有效，要等实际请求由服务确认。

继续使用这个终端。这里设置的变量会传给它启动的 Python 程序；关闭后重新开窗口，需要再次设置。密钥保留在自己的环境中，发代码和截图时把它留出去。

## 第三步：先看清程序准备发送什么

在同一个目录运行：

```bash
# macOS / Linux
python3 ask.py --prompt "请用三句话解释什么是 API。" --dry-run
```

```powershell
# Windows PowerShell
py ask.py --prompt "请用三句话解释什么是 API。" --dry-run
```

`--dry-run` 会展示请求地址和内容，这一步不会发送网络请求。你会看到类似结构：

```json
{
  "endpoint": "https://api.deepseek.com/chat/completions",
  "body": {
    "model": "deepseek-flash",
    "messages": [
      {"role": "system", "content": "你是一位表达清楚的中文学习助手。"},
      {"role": "user", "content": "请用三句话解释什么是 API。"}
    ],
    "stream": false,
    "max_tokens": 512,
    "thinking": {"type": "disabled"}
  }
}
```

现在先看三个位置：地址是不是这次要用的服务，模型是不是自己选择的名称，`user` 消息是不是刚输入的问题。

**这一步的结果**：可以在发送前读到准确的输入。试着换一句问题，再运行一次，比较 `messages` 中哪一处变了。你已经开始理解“改命令行输入，程序怎样准备请求”。

## 第四步：发出第一次真实请求

先运行最小程序：

```bash
# macOS / Linux
python3 first_call.py
```

```powershell
# Windows PowerShell
py first_call.py
```

程序会发送一个固定问题：“请用三句话解释什么是 API。”等待响应后，终端应出现模型生成的回答。具体句子每次可能不同，先看是否回应了这个问题。

**这一步的结果**：模型回答出现在终端，账号、网络、地址和基本请求已经配合完成一次调用。真实请求按 API 账号的规则使用额度，可以在控制台查看用量。

如果出现错误，记下状态码或错误文本，转到后面的排错表。先让最小请求成功，再改问题和输出要求。

## 第五步：沿着这次成功，读完整代码

下面就是 `first_call.py`。它没有额外 SDK 依赖，使用 Python 自带的 HTTP 和 JSON 功能：

```python
"""最小示例：读取密钥、发送一个问题、打印回答。"""
import json
import os
from urllib.request import Request, urlopen

api_key = os.environ.get("DEEPSEEK_API_KEY", "").strip()
if not api_key:
    raise SystemExit("请先在当前终端设置 DEEPSEEK_API_KEY。")

body = {
    "model": os.environ.get("DEEPSEEK_MODEL", "deepseek-flash"),
    "messages": [
        {"role": "system", "content": "你是一位表达清楚的中文学习助手。"},
        {"role": "user", "content": "请用三句话解释什么是 API。"},
    ],
    "stream": False,
    "max_tokens": 512,
    "thinking": {"type": "disabled"},
}
request = Request(
    "https://api.deepseek.com/chat/completions",
    data=json.dumps(body, ensure_ascii=False).encode("utf-8"),
    headers={
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    },
    method="POST",
)
with urlopen(request, timeout=45) as response:
    result = json.loads(response.read())

print(result["choices"][0]["message"]["content"])
```

我们沿刚才的运行过程看四个位置。

**1. 从环境中读配置。** `os.environ.get` 取得你在终端设置的变量。代码和调用凭据由此分开：同学拿到同一份代码，配置自己的密钥，就可以使用自己的账号。

**2. 组织问题。** `body` 是一个 Python 字典，里面有模型名、消息和输出参数。`json.dumps` 把它转换成 JSON，编码后成为发送的数据。

**3. 发出请求。** `Request` 描述地址、请求头、内容和方法；`urlopen` 负责实际发送并等候结果。请求头中的 `Authorization` 携带账号凭据，`Content-Type` 表示发送的是 JSON。

**4. 取出回答。** 收到响应后，程序用 `json.loads` 解析，最后从 `choices` 中取出第一条消息的 `content`。

响应还可能带其他信息。先根据文档找到自己需要的字段，再决定显示什么。假设想观察结构，可以让 Agent 帮你只打印顶层字段名称，或单独查看用量部分。

> 可以发给 Agent：请沿这次 API 调用，指出配置在哪里读取、问题在哪里准备、请求在哪里发送、回答在哪里提取。每一步都对应到文件里的具体位置，先不修改代码。

## 第六步：把固定问题换成自己输入的问题

`first_call.py` 便于看清全过程。日常使用时，我们希望从命令行换问题，于是再运行 `ask.py`：

```bash
# macOS / Linux
python3 ask.py --prompt "请给刚入学的新生安排一个每周三次的编程自学计划，每次30分钟。"
```

```powershell
# Windows PowerShell
py ask.py --prompt "请给刚入学的新生安排一个每周三次的编程自学计划，每次30分钟。"
```

**这一步的结果**：终端显示针对新问题的回答。再换一个问题试一次，确认自己的输入确实传到了模型。

这两个文件把工作分开：`ask.py` 接收问题、读取环境变量、显示结果；`api_client.py` 负责组织请求、调用接口、提取文本和处理常见错误。这样，后面换成其他输入方式时，还能复用调用部分。

如果文字显示不符合预期，可以先用 `--dry-run` 看程序到底收到了什么。先确认输入，再调整输出要求，避免把内容问题和连接问题混在一起。

## 第七步：在自己的 Python 程序中接入

现在把接口调用接到一个具体输入中。我们做一份简短通知整理工具：输入通知文字，让模型提取事项、时间、地点和待确认信息。

配套的 `notice_helper.py` 与 `api_client.py` 放在同一个目录，可以直接运行。核心写法是：

```python
import os
from api_client import ask

notice = "周五下午三点在活动室召开新生见面会，请提前十分钟到场。"
prompt = (
    "请把通知整理为事项、时间、地点、待确认信息四项。"
    "通知没有给出的信息写待确认，不要补造：\n" + notice
)
answer = ask(
    prompt=prompt,
    api_key=os.environ["DEEPSEEK_API_KEY"],
    model=os.environ.get("DEEPSEEK_MODEL", "deepseek-flash"),
)
print(answer)
```

运行配套版本：

```bash
# macOS / Linux
python3 notice_helper.py
```

```powershell
# Windows PowerShell
py notice_helper.py
```

**这一步的结果**：终端显示四项整理结果，其中不明确的日期或具体房间等信息应作为待确认事项。输入中只有“周五”和“活动室”，不要在结果里补出一个未经提供的日历日期或房间号。

此时，你已经把“输入内容—调用模型—使用回答”接成了自己的程序。后面想读取文件，可以把 `notice` 改成文件内容；想批量处理，则需要安排逐条输入、保存结果与失败处理。每一轮先增加一种能力，再检查实际效果。

> 可以发给 Agent：请在 notice_helper.py 的基础上，增加读取一个文本文件的方式。先说明输入路径、编码和文件不存在时怎样处理，再实施。保留已有通知整理规则。

## 第八步：修改输出时，先确定要改哪一层

API 能正常响应后，新的问题往往出现在结果是否好用。可以按下面三个位置分别调整：

| 想改变什么 | 先改哪里 | 怎样检查 |
|---|---|---|
| 让输入问题不同 | `--prompt` 或程序中的输入变量 | 用 dry-run 查看送出的消息 |
| 让回答更短、格式更统一 | 消息里的任务要求 | 用相同输入比较修改前后 |
| 换一个模型 | `DEEPSEEK_MODEL` | 固定问题，比较结果、耗时和用量 |

我们先采用一次返回完整文本的方式。消息中的 `stream: false` 表示非流式响应；`thinking` 在这份例子里关闭思考模式，让首次调用先聚焦输入输出。参数含义可查[官方思考模式说明](https://api-docs.deepseek.com/zh-cn/guides/thinking_mode/)。

`max_tokens` 控制输出 token 上限，不等于精确字数。如果想要四个条目或一段短回答，既要在任务中说明格式，也要安排足够的输出空间。具体参数取值与响应字段见[接口参考](https://api-docs.deepseek.com/api/create-chat-completion/)。

## 第九步：失败时，按当前结果找下一步

配套的 `ask.py` 和 `notice_helper.py` 会把常见错误转换成容易辨认的提示。先看属于哪一类：

| 现象 | 优先处理 |
|---|---|
| 找不到脚本 | 回到 api 目录，列出文件确认位置 |
| 找不到 Python | 检查安装，Windows 尝试 `py`，macOS 尝试 `python3` |
| 提示缺少密钥 | 在同一个终端设置环境变量，再运行 |
| HTTP 401 | 核对密钥与服务地址，确认不是占位文字 |
| HTTP 402 | 到 API 控制台查看余额与额度 |
| HTTP 400 / 422 | 查看请求格式、模型名与参数 |
| HTTP 429 | 减少频率或并发，等候后再尝试 |
| 连接失败或超时 | 检查网络、地址与服务状态 |
| 返回内容不符合任务 | 查看实际输入，调整要求并重新比较 |

状态码对照[官方错误说明](https://api-docs.deepseek.com/zh-cn/quick_start/error_codes/)。反馈时附命令、错误文本与已经尝试过的办法，密钥自行保管。

## 最后，自己完成三次调用

1. 用 `first_call.py` 得到固定问题的回答。
2. 用 `ask.py --prompt` 发送自己的问题，并找到构造消息的位置。
3. 用 `notice_helper.py` 整理通知，再换一份缺少地点的通知，检查结果是否把地点列为待确认。

完成这三次，你就已经接触了一条完整的接入路线：从配置凭据到首次请求，从读取回答到在自己的程序中使用。以后让 Agent 帮忙接一个新的接口，也可以先请它按这条顺序准备最小版本。

## PS｜需要时再查这几个词

> **API 与 SDK。** API 是使用服务的接口；SDK 是方便某种语言调用接口的工具包。这里直接用 Python 标准库发送 HTTP 请求，因此没有额外安装 SDK。

> **基础地址与完整地址。** 有些 SDK 接受 `base_url`，会自行补上接口路径；这份程序直接请求完整的 `/chat/completions` 地址。查看代码采用哪种方式，再填写对应配置。

> **环境变量与 .env。** 环境变量由运行程序的环境提供。配套的 `.env.example` 用于列出配置项；当前程序直接读取终端变量。若以后想从 `.env` 文件加载，再添加相应读取逻辑。

> **单次请求与连续对话。** 当前程序每次只发送指定消息。想保留此前问答，需要在后续请求中组织相应的消息历史，再考虑长度和用量。


[返回讲义导读](/resources/ai-programming/)
