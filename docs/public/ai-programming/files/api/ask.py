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
