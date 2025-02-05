import json
import sys
from pathlib import Path

import pytest

from lunar_birthday_ical.main import main
from tests.__init__ import config


def test_main_no_args(monkeypatch):
    with pytest.raises(SystemExit):
        monkeypatch.setattr(sys, "argv", ["main.py"])
        main()


def test_main_with_input(monkeypatch, tmp_path: Path):
    input_file = tmp_path / "config.yaml"
    input_file.write_text(json.dumps(config))

    output_file = tmp_path / "output.ics"

    monkeypatch.setattr(
        sys, "argv", ["main.py", str(input_file), "-o", str(output_file)]
    )
    main()

    assert output_file.exists()


def test_main_default_output(monkeypatch: pytest.MonkeyPatch, tmp_path: Path):
    input_file = tmp_path / "config.yaml"
    input_file.write_text(json.dumps(config))

    expected_output_file = input_file.with_suffix(".ics")

    monkeypatch.setattr(sys, "argv", ["main.py", str(input_file)])
    main()

    assert expected_output_file.exists()
