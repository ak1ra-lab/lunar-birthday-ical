# lunar-birthday-ical

## What is this?

A command line tool written in Python 3 for creating lunar birthday events.

`lunar-birthday-ical` reads a YAML configuration file and generates an iCalendar `.ics` file. Optionally, it can upload the calendar to pastebin for easy subscription. For an full example configuration file, refer to [config/example-lunar-birthday.yaml](https://github.com/ak1ra-lab/lunar-birthday-ical/blob/master/config/example-lunar-birthday.yaml), not all fields are required in the `config/example-lunar-birthday.yaml`. The comments should be sufficient to explain the meaning of each option.

The minimal configuration file can only contain the `[]events` field, with other fields left as default, for example:

```yaml
events:
  - name: 张三
    start_date: 1989-06-03
    event_keys:
      - lunar_birthday

  - name: 李四
    start_date: 2006-02-01
    event_keys:
      - integer_days
      - solar_birthday
```

You can use the `-h` or `--help` option to view the command-line tool's help information.

```
$ lunar-birthday-ical -h
usage: lunar-birthday-ical [-h] [-L YYYY MM DD | -S YYYY MM DD] [config.yaml ...]

Generate iCal events and reminders for lunar birthday and cycle days.

positional arguments:
  config.yaml           config file for iCal, checkout config/example-lunar-birthday.yaml for example.

options:
  -h, --help            show this help message and exit
  -L YYYY MM DD, --lunar-to-solar YYYY MM DD
                        Convert lunar date to solar date, add minus sign before leap lunar month.
  -S YYYY MM DD, --solar-to-lunar YYYY MM DD
                        Convert solar date to lunar date.
```

Although this tool does not have many command-line options, it supports `argcomplete`. For configuration methods, refer to the [argcomplete documentation](https://kislyuk.github.io/argcomplete/).

## Installation

It is recommended to use [`pipx`](https://github.com/pypa/pipx) to install command-line tools written in Python, including this project.

```shell
# install from PyPI
pipx install lunar-birthday-ical

# install from Test PyPI
pipx install lunar-birthday-ical \
    --index-url https://test.pypi.org/simple/ \
    --pip-args "--extra-index-url https://pypi.org/simple/"
```

## About `pastebin`

The YAML config lets you decide whether to upload the created .ics file to a pastebin service. This uses SharzyL's Cloudflare Workers-based pastebin ([SharzyL/pastebin-worker](https://github.com/SharzyL/pastebin-worker)), hosted by the repo owner.

When the `pastebin.enabled` option is set to `true`, you can leave `pastebin.admin_url` empty for the first run. After that, set `pastebin.admin_url` url from the `.admin` field in the response from the pastebin server.

The response from the pastebin server looks like this:

```shellsession
$ lunar-birthday-ical config/example-lunar-birthday.yaml
iCal saved to config/example-lunar-birthday.ics
HTTP Request: POST https://komj.uk/ "HTTP/1.1 200 OK"
{"url": "https://komj.uk/Kree41N5W28qJC70XQU4Kj1F", "suggestUrl": "https://komj.uk/Kree41N5W28qJC70XQU4Kj1F/example-lunar-birthday.ics", "admin": "https://komj.uk/Kree41N5W28qJC70XQU4Kj1F:i9Jq1bd3KMscrEsyUzm0ksgQ", "isPrivate": true, "expire": 1800}
```

The `.suggestUrl` can be used by any Calendar App.
