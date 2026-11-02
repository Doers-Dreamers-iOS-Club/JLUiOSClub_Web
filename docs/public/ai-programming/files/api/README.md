# API 配套程序

[选读：用 Python 调用模型 API](../../随查/选读-用Python调用API.md)

如果只是想连接模型、认识配置字段，先读 [DSH 接入说明](../../正文/07-让自己的程序调用API.md)。下面的程序供想继续写代码的同学使用。

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
