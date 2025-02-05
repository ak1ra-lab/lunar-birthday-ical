import logging

import pytest

from lunar_birthday_ical.utils import get_logger


def test_get_logger_default_level():
    logger = get_logger("test_logger")
    assert logger.name == "test_logger"
    assert logger.level == logging.INFO


def test_get_logger_custom_level():
    logger = get_logger("test_logger", logging.DEBUG)
    assert logger.name == "test_logger"
    assert logger.level == logging.DEBUG


def test_get_logger_output(caplog: pytest.LogCaptureFixture):
    logger = get_logger("test_logger")
    with caplog.at_level(logging.INFO):
        logger.info("This is a test log message")
    assert "This is a test log message" in caplog.text
