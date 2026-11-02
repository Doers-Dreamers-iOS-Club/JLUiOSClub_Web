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
