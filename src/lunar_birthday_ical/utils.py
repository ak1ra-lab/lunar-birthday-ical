import logging
import sys
from collections import deque
from collections.abc import Mapping
from logging.handlers import RotatingFileHandler
from pathlib import Path


def get_logger(name: str) -> logging.Logger:
    log_dir = Path("~/.local/state/lunar-birthday-ical/log").expanduser()
    log_dir.mkdir(parents=True, exist_ok=True)
    log_file = log_dir / "messages.log"

    logger = logging.getLogger(name)

    # 确保 Logger 级别继承 root, 但 root logger 可能还未被设置, 所以需要显式处理
    root_logger = logging.getLogger()
    if not root_logger.hasHandlers():
        # 只有在 root logger 没有 handler 时才初始化
        logging.basicConfig(
            level=logging.INFO, handlers=[logging.StreamHandler(sys.stdout)]
        )

    logger.setLevel(root_logger.getEffectiveLevel())  # 继承 root 的最终级别
    logger.propagate = False  # 避免重复日志

    # 避免重复添加 Handler
    if not logger.handlers:
        log_format = logging.Formatter(
            "[%(asctime)s][%(name)s][%(levelname)s] %(message)s"
        )

        stream_handler = logging.StreamHandler(sys.stdout)
        stream_handler.setFormatter(log_format)
        logger.addHandler(stream_handler)

        file_handler = RotatingFileHandler(
            log_file, maxBytes=10 * 1024 * 1024, backupCount=5, encoding="utf-8"
        )
        file_handler.setFormatter(log_format)
        logger.addHandler(file_handler)

    return logger


def deep_merge(d1, d2):
    merged = d1.copy()  # 复制 d1 以免修改原字典
    for k, v in d2.items():
        if isinstance(v, Mapping) and k in merged and isinstance(merged[k], Mapping):
            merged[k] = deep_merge(merged[k], v)  # 递归合并
        else:
            merged[k] = v  # 直接覆盖
    return merged


def deep_merge_iterative(d1, d2):
    merged = d1.copy()  # 复制 d1 以免修改原字典
    stack = deque([(merged, d2)])  # 使用 deque 作为堆栈, 存储要合并的字典对

    while stack:
        current_d1, current_d2 = stack.pop()  # 取出一对字典

        for k, v in current_d2.items():
            if (
                isinstance(v, Mapping)
                and k in current_d1
                and isinstance(current_d1[k], Mapping)
            ):
                # 如果两个字典的该键都是字典, 则推入栈中, 等待后续合并
                stack.append((current_d1[k], v))
            else:
                # 否则, 直接更新
                current_d1[k] = v

    return merged
