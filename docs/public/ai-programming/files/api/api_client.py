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
