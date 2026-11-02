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
