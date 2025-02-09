## v0.3.2 (2025-02-09)

- use deep_merge_iterative instead of dict union to overwride default_config
- add argcomplete support for lunar-birthday-ical

## v0.3.0 (2025-02-08)

- disable pastebin on config/example-lunar-birthday.yaml
- multiple config files support

## v0.2.6 (2025-02-08)

- translate README.md and config/example-lunar-birthday.yaml to English

## v0.2.5 (2025-02-08)

- use Path(config_file).stem as calendar_name
- add `--lunar-to-solar` and `--solar-to-lunar` option

## v0.2.4 (2025-02-07)

- use absolute datetime for reminders
- update default reminders on config/example-lunar-birthday.yaml

## v0.2.3 (2025-02-06)

- fix utils.get_logger setLevel
- ci: add nox, pytest, ruff skeleton
- add pytest test cases with help of copilot
- fix example config url on README.md

## v0.2.2 (2025-01-29)

- ci: use dynamic version from scm tag
- add CHANGELOG.md

## v0.2.1 (2025-01-29)

- bug: fix UID and DTSTAMP on iCalendar

## v0.2.0 (2025-01-29)

- BREAKING: update multiple config file fields
- ci: remove env on pypi-publish.yaml

## v0.1.3 (2025-01-25)

- add .github/workflows/pypi-publish.yaml
- first release on PyPI

## v0.1.0 (2025-01-25)

- initial release
- update default config/example-lunar-birthday.yaml
