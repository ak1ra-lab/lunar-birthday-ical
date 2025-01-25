# lunar-birthday-ical

## 这是什么?

一个使用 Python 3 编写的用于创建农历生日事件的命令行工具.

`lunar-birthday-ical` 读入一个 YAML 配置文件, 生成 iCalendar 格式的 `.ics` 文件, 可选是否将日历上传到 pastebin, 方便直接订阅,
示例配置文件请参考 [config/example-lunar-birthday.yaml](config/example-lunar-birthday.yaml), 注释应该足够能解释每个选项分别是什么含义.

```
$ lunar-birthday-ical -h
usage: lunar-birthday-ical [-h] [-o OUTPUT] input

Generate iCal events for lunar birthday and cycle days.

positional arguments:
  input                 input config.yaml, check config/example-lunar-birthday.yaml for example.

options:
  -h, --help            show this help message and exit
  -o OUTPUT, --output OUTPUT
                        Path to save the generated iCal file.
```

## 安装

可以使用 pipx 直接安装本项目,

```ShellSession
$ git clone https://github.com/ak1ra-lab/lunar-birthday-ical.git

$ cd lunar-birthday-ical/
$ pipx install .
  installed package lunar-birthday-ical 0.1.0, installed using Python 3.11.2
  These apps are now globally available
    - lunar-birthday-ical
done! ✨ 🌟 ✨

$ lunar-birthday-ical config/example-lunar-birthday.yaml
[2025-01-25 11:39:43,354][lunar_birthday_ical.ical][INFO] iCal file saved to config/example-lunar-birthday.ics
```

## 关于 pastebin

在 YAML 配置文件中可选配置是否同时将生成的 `.ics` 文件同时上传 pastebin, 该 pastebin 实例是作者运行的一个基于 Cloudflare worker 的 pastebin 服务, 实例所使用的代码是 [SharzyL/pastebin-worker](https://github.com/SharzyL/pastebin-worker).
