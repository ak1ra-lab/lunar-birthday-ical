# lunar-birthday-ical

## What is this?

A command line tool written in Python 3 for creating lunar birthday events.

`lunar-birthday-ical` reads a YAML configuration file and generates an iCalendar `.ics` file. Optionally, it can upload the calendar to pastebin for easy subscription. For an full example configuration file, refer to [config/example-lunar-birthday.yaml](https://github.com/ak1ra-lab/lunar-birthday-ical/blob/master/config/example-lunar-birthday.yaml), not all fields are required in the `config/example-lunar-birthday.yaml`. The comments should be sufficient to explain the meaning of each option.

The minimal configuration file can only contain the `persons: []` field, with other fields left as default, for example:

```yaml
persons:
  - username: 张三
    startdate: 1989-06-03
    solar_birthday: false
    lunar_birthday: true

  - username: 李四
    startdate: 2006-02-01
    solar_birthday: true
    lunar_birthday: false
```

You can use the `-h` or `--help` option to view the command-line tool's help information.

```
$ lunar-birthday-ical -h
usage: lunar-birthday-ical [-h] [-L YYYY MM DD | -S YYYY MM DD] [-v] [config.yaml ...]

Generate iCal events and reminders for lunar birthday and cycle days.

positional arguments:
  config.yaml           config file for iCal, checkout config/example-lunar-birthday.yaml for example.

options:
  -h, --help            show this help message and exit
  -L YYYY MM DD, --lunar-to-solar YYYY MM DD
                        Convert lunar date to solar date, add minus sign before leap lunar month.
  -S YYYY MM DD, --solar-to-lunar YYYY MM DD
                        Convert solar date to lunar date.
  -v, --verbose         Enable debug logging.
```

Although this tool does not have many command-line options, it supports `argcomplete`. For configuration methods, refer to the [argcomplete documentation](https://kislyuk.github.io/argcomplete/).

## Installation

It is recommended to use [`pipx`](https://github.com/pypa/pipx) to install command-line tools written in Python, including this project.

```ShellSession
$ pipx install lunar-birthday-ical
  installed package lunar-birthday-ical v0.x.x, installed using Python 3.11.2
  These apps are now globally available
    - lunar-birthday-ical
done! ✨ 🌟 ✨
```

## About `pastebin`

In the YAML configuration file, you can choose whether to upload the generated `.ics` file to pastebin. This pastebin instance is a Cloudflare worker-based pastebin service ([SharzyL/pastebin-worker](https://github.com/SharzyL/pastebin-worker)) run by the repository owner.

When the `pastebin.enabled` option is set to `true`, you can leave `pastebin.name` and `pastebin.password` empty on the first run. After that, extract `pastebin.name` and `pastebin.password` from the admin field in the response from the pastebin server.

The response from the pastebin server looks like this:

```json
{
  "url": "https://komj.uk/XXXXXXXXXXXXXXXXXXXXXXXX",
  "suggestUrl": "https://komj.uk/XXXXXXXXXXXXXXXXXXXXXXXX/example-lunar-birthday.ics",
  "admin": "https://komj.uk/XXXXXXXXXXXXXXXXXXXXXXXX:YYYYYYYYYYYYYYYYYYYYYYYY",
  "isPrivate": true,
  "expire": 10800
}
```

Extract `XXXXXXXXXXXXXXXXXXXXXXXX` as `pastebin.name` and `YYYYYYYYYYYYYYYYYYYYYYYY` as `pastebin.password`.

The `suggestUrl` in the response can be subscribed to by the Calendar App.

**Privacy Statement**: All files uploaded to https://komj.uk can theoretically be viewed by the repository owner, even you are in private mode, although I would not normally view it. If you mind, please do not enable the `pastebin.enabled` option.
