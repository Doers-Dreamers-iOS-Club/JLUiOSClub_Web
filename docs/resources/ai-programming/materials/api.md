---
title: "API 配套程序"
description: "查看与下载：API 配套程序"
outline: [2, 3]
pageClass: ai-course-article
---

# API 配套程序

[选读：用 Python 调用模型 API](/resources/ai-programming/reference/python-api)

如果只是想连接模型、认识配置字段，先读 [DSH 接入说明](/resources/ai-programming/chapters/api-setup)。下面的程序供想继续写代码的同学使用。

按详细教程准备 Python 和 API 密钥，在这个目录里打开终端，再依次操作。

## 文件与用途

| 文件 | 做什么 |
|---|---|
| first_call.py | 用固定问题完成第一次请求，读清完整调用过程 |
| api_client.py | 复用请求、响应提取和常见错误处理 |
| ask.py | 从命令行输入自己的问题 |
| notice_helper.py | 在自己的通知整理程序中调用模型 |
| .env.example | 查看环境变量名称；当前程序直接读取终端环境 |

## 先查看将要发出的请求

macOS / Linux：

```bash
python3 ask.py --prompt "请用三句话解释 API。" --dry-run
```

Windows PowerShell：

```powershell
py ask.py --prompt "请用三句话解释 API。" --dry-run
```

这一步只输出地址与消息，不发送请求。

## 再完成真实调用

在当前终端设置 `DEEPSEEK_API_KEY`，可选设置 `DEEPSEEK_MODEL`。具体命令见详细教程。

macOS / Linux：

```bash
python3 first_call.py
python3 ask.py --prompt "请安排一份每周三次的编程学习计划。"
python3 notice_helper.py
```

Windows PowerShell：

```powershell
py first_call.py
py ask.py --prompt "请安排一份每周三次的编程学习计划。"
py notice_helper.py
```

看到回答后，对照代码找到输入、请求和返回。再修改通知或问题，检查新内容是否真正影响结果。

接口格式见 [DeepSeek 首次调用文档](https://api-docs.deepseek.com/zh-cn/)，出现错误时按[错误码说明](https://api-docs.deepseek.com/zh-cn/quick_start/error_codes/)排查。


<a href="/ai-programming/files/api/README.md" download>下载原始文件</a> · [全部配套材料](/resources/ai-programming/materials/)

## api_client.py

```python
"""DeepSeek 对话 API 的小型封装，使用 Python 标准库。"""
import json
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ENDPOINT = "https://api.deepseek.com/chat/completions"


class APIError(Exception):
    """向调用者返回可理解的接口错误。"""


def build_payload(prompt, model):
    if not isinstance(prompt, str) or not prompt.strip():
        raise ValueError("请提供非空的问题。")
    if not isinstance(model, str) or not model.strip():
        raise ValueError("请设置可用的 DEEPSEEK_MODEL。")
    return {
        "model": model.strip(),
        "messages": [
            {"role": "system", "content": "你是一位表达清楚的中文学习助手。"},
            {"role": "user", "content": prompt.strip()},
        ],
        "stream": False,
        "max_tokens": 512,
        "thinking": {"type": "disabled"},
    }


def parse_response(raw):
    try:
        data = json.loads(raw)
        content = data["choices"][0]["message"]["content"]
    except (ValueError, KeyError, IndexError, TypeError) as error:
        raise APIError("返回格式不符合预期，请对照接口文档检查响应。") from error
    if not isinstance(content, str) or not content.strip():
        raise APIError("返回中没有可显示的文本，请检查模型与输出参数。")
    return content.strip()


def request_text(payload, api_key):
    if not isinstance(api_key, str) or not api_key.strip():
        raise APIError("请先在当前终端设置 DEEPSEEK_API_KEY。")
    request = Request(
        ENDPOINT,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key.strip()}",
        },
        method="POST",
    )
    try:
        with urlopen(request, timeout=45) as response:
            return parse_response(response.read())
    except HTTPError as error:
        hints = {
            400: "请求格式有误，检查 JSON 和字段。",
            401: "认证失败，检查密钥与服务地址。",
            402: "余额不足，查看 API 控制台。",
            422: "参数有误，检查模型名称和字段取值。",
            429: "调用过于频繁，稍后再试。",
            500: "服务端出现错误，查看服务状态后再试。",
            503: "服务暂时繁忙，稍后再试。",
        }
        raise APIError(f"HTTP {error.code}：{hints.get(error.code, '按官方错误码文档排查。')}") from error
    except (URLError, TimeoutError, OSError) as error:
        raise APIError(f"连接未完成（{type(error).__name__}），请检查网络、地址和服务状态。") from error


def ask(prompt, api_key, model="deepseek-flash"):
    """输入问题和配置，返回回答文本。"""
    return request_text(build_payload(prompt, model), api_key)

```

<a href="/ai-programming/files/api/api_client.py" download>下载 api_client.py</a>

## first_call.py

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

<a href="/ai-programming/files/api/first_call.py" download>下载 first_call.py</a>

## ask.py

```python
"""命令行提问工具：输入问题，调用接口，显示回答。"""
import argparse
import json
import os
import sys
from api_client import APIError, ENDPOINT, ask, build_payload


def main(argv=None):
    parser = argparse.ArgumentParser(description="发送一个问题，获得模型回答")
    parser.add_argument("--prompt", default="请用三句话解释什么是 API。", help="发给模型的问题")
    parser.add_argument("--dry-run", action="store_true", help="只查看请求，不联网")
    args = parser.parse_args(argv)
    model = os.environ.get("DEEPSEEK_MODEL", "deepseek-flash")
    try:
        payload = build_payload(args.prompt, model)
        if args.dry_run:
            print(json.dumps({"endpoint": ENDPOINT, "body": payload}, ensure_ascii=False, indent=2))
            return 0
        print(ask(args.prompt, os.environ.get("DEEPSEEK_API_KEY", ""), model))
        return 0
    except (APIError, ValueError) as error:
        print(str(error), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())

```

<a href="/ai-programming/files/api/ask.py" download>下载 ask.py</a>

## notice_helper.py

```python
"""输入一份通知，调用模型整理为四个条目。"""
import os
import sys
from api_client import APIError, ask


def main():
    notice = "周五下午三点在活动室召开新生见面会，请提前十分钟到场。"
    prompt = (
        "请把通知整理为事项、时间、地点、待确认信息四项。"
        "通知没有给出的信息写待确认，不要补造：\n" + notice
    )
    try:
        print(ask(
            prompt=prompt,
            api_key=os.environ.get("DEEPSEEK_API_KEY", ""),
            model=os.environ.get("DEEPSEEK_MODEL", "deepseek-flash"),
        ))
    except (APIError, ValueError) as error:
        print(str(error), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

```

<a href="/ai-programming/files/api/notice_helper.py" download>下载 notice_helper.py</a>

## 环境变量示例

`.env.example` 是配置样例；具体加载方法见 [Python 选读](/resources/ai-programming/reference/python-api)。

```dotenv
DEEPSEEK_API_KEY=
DEEPSEEK_MODEL=deepseek-flash

```

<a href="/ai-programming/files/api/env.example" download=".env.example">下载 .env.example</a>
