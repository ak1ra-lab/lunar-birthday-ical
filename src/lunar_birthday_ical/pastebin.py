import json
import logging
from pathlib import Path

import httpx

logger = logging.getLogger(__name__)


def pastebin_upload(
    base_url: str,
    file: Path,
    expiration: int | str = 0,
) -> httpx.Response:
    files = {"c": open(file, "rb")}
    # private mode by default
    data = {"p": True}
    if expiration:
        data["e"] = expiration

    response = httpx.post(f"{base_url}/", data=data, files=files)
    return response


def pastebin_update(
    manage_url: str,
    file: Path,
    expiration: int | str = 0,
) -> httpx.Response:
    files = {"c": open(file, "rb")}
    data = {}
    if expiration:
        data["e"] = expiration

    response = httpx.put(manage_url, data=data, files=files)
    return response


def pastebin_helper(config: dict, file: Path) -> None:
    base_url = config.get("pastebin").get("base_url")
    manage_url = config.get("pastebin").get("manage_url")
    expiration = config.get("pastebin").get("expiration")
    if not manage_url:
        response = pastebin_upload(
            base_url=base_url,
            file=file,
            expiration=expiration,
        )
    else:
        response = pastebin_update(
            manage_url=manage_url,
            file=file,
            expiration=expiration,
        )
    logger.info(json.dumps(response.json(), ensure_ascii=False))
