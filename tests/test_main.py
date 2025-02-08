import json
import sys
from pathlib import Path

import pytest

from lunar_birthday_ical.main import main
from tests.__init__ import config


def test_main_no_args(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setattr(sys, "argv", ["main.py"])
    with pytest.raises(SystemExit) as excinfo:
        main()
    assert excinfo.value.code == 0


def test_main_with_input(monkeypatch: pytest.MonkeyPatch, tmp_path: Path):
    calendar_name = "test-calendar"
    input_file = tmp_path / f"{calendar_name}.yaml"
    input_file.write_text(json.dumps(config))

    output_file = tmp_path / f"{calendar_name}.ics"

    monkeypatch.setattr(
        sys, "argv", ["main.py", str(input_file), "-o", str(output_file)]
    )
    main()

    assert output_file.exists()


def test_main_default_output(monkeypatch: pytest.MonkeyPatch, tmp_path: Path):
    calendar_name = "test-calendar"
    input_file = tmp_path / f"{calendar_name}.yaml"
    input_file.write_text(json.dumps(config))

    expected_output_file = input_file.with_suffix(".ics")

    monkeypatch.setattr(sys, "argv", ["main.py", str(input_file)])
    main()

    assert expected_output_file.exists()


def test_main_lunar_to_solar(
    monkeypatch: pytest.MonkeyPatch, caplog: pytest.LogCaptureFixture
):
    lunar_date = (2020, 1, 1)
    monkeypatch.setattr(
        sys, "argv", ["main.py", "--lunar-to-solar", *(str(x) for x in lunar_date)]
    )
    main()

    assert "Lunar date 二〇二〇年正月初一 is Solar 2020-01-25" in caplog.text


def test_main_solar_to_lunar(
    monkeypatch: pytest.MonkeyPatch, caplog: pytest.LogCaptureFixture
):
    solar_date = (2020, 1, 25)
    monkeypatch.setattr(
        sys, "argv", ["main.py", "--solar-to-lunar", *(str(x) for x in solar_date)]
    )
    main()

    assert "Solar date 2020-01-25 is Lunar 二〇二〇年正月初一" in caplog.text


def test_main_lunar_leap_month_to_solar(
    monkeypatch: pytest.MonkeyPatch, caplog: pytest.LogCaptureFixture
):
    lunar_date = (2020, -4, 1)
    monkeypatch.setattr(
        sys, "argv", ["main.py", "--lunar-to-solar", *(str(x) for x in lunar_date)]
    )
    main()

    assert "Lunar date 二〇二〇年闰四月初一 is Solar 2020-05-23" in caplog.text
