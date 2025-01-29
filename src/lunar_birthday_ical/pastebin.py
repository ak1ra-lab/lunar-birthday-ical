from pathlib import Path

import httpx

from lunar_birthday_ical.utils import get_logger

logger = get_logger(__name__)


def pastebin_upload(
    baseurl: str,
    file: Path,
    expiration: int | str = 0,
) -> httpx.Response:
    files = {"c": open(file, "rb")}
    # 强制使用 private mode
    data = {"p": True}
    if expiration:
        data["e"] = expiration

    response = httpx.post(f"{baseurl}/", data=data, files=files)
    return response


def pastebin_update(
    baseurl: str,
    name: str,
    password: str,
    file: Path,
    expiration: int | str = 0,
) -> httpx.Response:
    url = f"{baseurl}/{name}:{password}"
    files = {"c": open(file, "rb")}
    data = {}
    if expiration:
        data["e"] = expiration

    response = httpx.put(url, data=data, files=files)
    return response


def pastebin_helper(config: dict, file: Path) -> None:
    pastebin_url = config.get("pastebin").get("baseurl")
    pastebin_name = config.get("pastebin").get("name")
    pastebin_password = config.get("pastebin").get("password")
    pastebin_expiration = config.get("pastebin").get("expiration")
    if not pastebin_password:
        response = pastebin_upload(
            baseurl=pastebin_url,
            file=file,
            expiration=pastebin_expiration,
        )
    else:
        response = pastebin_update(
            baseurl=pastebin_url,
            name=pastebin_name,
            password=pastebin_password,
            file=file,
            expiration=pastebin_expiration,
        )
    logger.info(response.json())
