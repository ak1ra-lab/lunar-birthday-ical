import datetime
import zoneinfo
from pathlib import Path

from icalendar import (
    Alarm,
    Calendar,
    Event,
    vCalAddress,
    vDatetime,
    vText,
)

from lunar_birthday_ical.lunar import get_future_lunar_equivalent_date
from lunar_birthday_ical.pastebin import pastebin_helper
from lunar_birthday_ical.utils import get_logger

logger = get_logger()


def local_datetime_to_utc_datetime(
    local_date: datetime.date, local_time: datetime.time, timezone: zoneinfo.ZoneInfo
) -> datetime.datetime:
    local_datetime = datetime.datetime.combine(local_date, local_time, timezone)
    # 将 local_datetime "强制"转换为 UTC 时间
    utc = zoneinfo.ZoneInfo("UTC")
    utc_datetime = local_datetime.replace(tzinfo=utc) - local_datetime.utcoffset()

    return utc_datetime


def add_reminders_to_event(event: Event, reminders: list, summary: str):
    # 添加提醒
    for reminder_days in reminders:
        alarm = Alarm()
        trigger_time = datetime.timedelta(days=-reminder_days)
        alarm.add("action", "DISPLAY")
        alarm.add("description", f"Reminder: {summary}")
        alarm.add("trigger", trigger_time)
        event.add_component(alarm)


def add_attendees_to_event(event: Event, attendees: list):
    # 添加与会者
    for attendee_email in attendees:
        attendee = vCalAddress(f"mailto:{attendee_email}")
        attendee.params["cn"] = vText(attendee_email.split("@")[0])
        attendee.params["role"] = vText("REQ-PARTICIPANT")
        event.add("attendee", attendee)


def add_days_event_to_calendar(
    calendar: Calendar,
    startdate: datetime.date,
    timezone: zoneinfo.ZoneInfo,
    event_time: datetime.time,
    event_duration: datetime.timedelta,
    reminders: list[int],
    attendees: list[str],
    username: str,
    days: int,
):
    age = round(days / 365.25, 2)
    startdate_utc = local_datetime_to_utc_datetime(startdate, event_time, timezone)
    dtstart = startdate_utc + datetime.timedelta(days=days)
    dtend = dtstart + event_duration
    summary = f"{username} 来到地球已经 {days} 天啦! (age: {age})"

    event = Event()
    event.add("summary", summary)
    event.add("dtstart", vDatetime(dtstart))
    event.add("dtend", vDatetime(dtend))
    add_reminders_to_event(event, reminders, summary)
    add_attendees_to_event(event, attendees)

    calendar.add_component(event)


def add_birthday_event_to_calendar(
    calendar: Calendar,
    startdate: datetime.date,
    timezone: zoneinfo.ZoneInfo,
    event_time: datetime.time,
    event_duration: datetime.timedelta,
    reminders: list[int],
    attendees: list[str],
    username: str,
    age: int,
    lunar_birthday: bool,
):
    if lunar_birthday:
        event_date = get_future_lunar_equivalent_date(startdate, age)
        summary = f"{username} {event_date.year} 年农历生日快乐 (age: {age})"
    else:
        event_date = datetime.date(startdate.year + age, startdate.month, startdate.day)
        summary = f"{username} {event_date.year} 年生日快乐 (age: {age})"

    # 强制转换为 UTC 时间后保存
    dtstart = local_datetime_to_utc_datetime(event_date, event_time, timezone)
    dtend = dtstart + event_duration

    event = Event()
    event.add("summary", summary)
    event.add("dtstart", vDatetime(dtstart))
    event.add("dtend", vDatetime(dtend))
    add_reminders_to_event(event, reminders, summary)
    add_attendees_to_event(event, attendees)

    calendar.add_component(event)


def create_calendar(config: dict, output: Path):
    calendar_name = config.get("global").get("calendar_name")
    timezone_name = config.get("global").get("timezone")
    try:
        timezone = zoneinfo.ZoneInfo(timezone_name)
    except Exception:
        logger.error("Invalid timezone: %s", timezone_name)

    calendar = Calendar()
    calendar.add("PRODID", "-//Google Inc//Google Calendar//EN")
    calendar.add("VERSION", "2.0")
    calendar.add("CALSCALE", "GREGORIAN")
    calendar.add("X-WR-CALNAME", calendar_name)
    calendar.add("X-WR-TIMEZONE", timezone)

    for item in config.get("startdate_list"):
        username = item.get("username")
        startdate = item.get("startdate")

        birthday = item.get("birthday") or config.get("global").get("birthday")
        lunar_birthday = item.get("lunar_birthday") or config.get("global").get(
            "lunar_birthday"
        )
        max_ages = item.get("max_ages") or config.get("global").get("max_ages")
        max_days = item.get("max_days") or config.get("global").get("max_days")
        interval = item.get("interval") or config.get("global").get("interval")
        reminders = item.get("reminders") or config.get("global").get("reminders")
        attendees = item.get("attendees") or config.get("global").get("attendees")

        event_time = datetime.datetime.strptime(
            item.get("event_time") or config.get("global").get("event_time"), "%H:%M:%S"
        ).time()
        event_duration = datetime.timedelta(
            hours=item.get("event_duration")
            or config.get("global").get("event_duration")
        )

        for days in range(interval, max_days + 1, interval):
            add_days_event_to_calendar(
                calendar=calendar,
                startdate=startdate,
                timezone=timezone,
                event_time=event_time,
                event_duration=event_duration,
                reminders=reminders,
                attendees=attendees,
                username=username,
                days=days,
            )

        # 是否添加公历生日事件
        if birthday:
            for age in range(0, max_ages + 1):
                add_birthday_event_to_calendar(
                    calendar=calendar,
                    startdate=startdate,
                    timezone=timezone,
                    event_time=event_time,
                    event_duration=event_duration,
                    reminders=reminders,
                    attendees=attendees,
                    username=username,
                    age=age,
                    lunar_birthday=False,
                )

        # 是否添加农历生日事件
        if lunar_birthday:
            for age in range(0, max_ages + 1):
                add_birthday_event_to_calendar(
                    calendar=calendar,
                    startdate=startdate,
                    timezone=timezone,
                    event_time=event_time,
                    event_duration=event_duration,
                    reminders=reminders,
                    attendees=attendees,
                    username=username,
                    age=age,
                    lunar_birthday=lunar_birthday,
                )

    calendar_data = calendar.to_ical()
    with output.open("wb") as f:
        f.write(calendar_data)
    logger.info("iCal file saved to %s", output)

    if config.get("global").get("pastebin"):
        pastebin_helper(config, output)
