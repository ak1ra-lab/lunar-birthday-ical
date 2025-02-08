# lunar-birthday-ical

## What is this?

A command line tool written in Python 3 for creating lunar birthday events.

`lunar-birthday-ical` reads a YAML configuration file and generates an iCalendar `.ics` file. Optionally, it can upload the calendar to pastebin for easy subscription. For an example configuration file, refer to [config/example-lunar-birthday.yaml](https://github.com/ak1ra-lab/lunar-birthday-ical/blob/master/config/example-lunar-birthday.yaml). The comments should be sufficient to explain the meaning of each option.

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

## Installation

It is recommended to use [`pipx`](https://github.com/pypa/pipx) to install command-line tools written in Python, including this project.

```ShellSession
$ pipx install lunar-birthday-ical
  installed package lunar-birthday-ical {{ version }}, installed using Python 3.11.2
  These apps are now globally available
    - lunar-birthday-ical
done! ✨ 🌟 ✨
```

## About pastebin

In the YAML configuration file, you can choose whether to upload the generated `.ics` file to pastebin. This pastebin instance is a Cloudflare worker-based pastebin service ([SharzyL/pastebin-worker](https://github.com/SharzyL/pastebin-worker)) run by the repository owner.

If pastebin (`pastebin.enabled`) is enabled, you can leave `pastebin.name` and `pastebin.password` in the YAML configuration file empty on the first run. After executing the command, it will automatically upload, and upon successful upload, retrieve the `pastebin.name` and `pastebin.password` from the `admin` field in the `lunar_birthday_ical.pastebin` log line in the standard output (`pastebin.name` and `pastebin.password` are split with `:`, as shown in the output below with `XXXXXXXXXXXXXXXXXXXXXXXX` and `YYYYYYYYYYYYYYYYYYYYYYYY`). Manually fill these into the configuration file. This way, on subsequent executions, it will only update the existing URL instead of re-uploading, thus keeping the URL unchanged and avoiding the need to update the calendar URL.

```
$ lunar-birthday-ical config/example-lunar-birthday.yaml
[2025-02-08 15:37:54,747][lunar_birthday_ical.ical][INFO] iCal file saved to config/example-lunar-birthday.ics
[2025-02-08 15:37:57,097][lunar_birthday_ical.pastebin][INFO] {'url': 'https://komj.uk/XXXXXXXXXXXXXXXXXXXXXXXX', 'suggestUrl': 'https://komj.uk/XXXXXXXXXXXXXXXXXXXXXXXX/example-lunar-birthday.ics', 'admin': 'https://komj.uk/XXXXXXXXXXXXXXXXXXXXXXXX:YYYYYYYYYYYYYYYYYYYYYYYY', 'isPrivate': True, 'expire': 604800}
```
