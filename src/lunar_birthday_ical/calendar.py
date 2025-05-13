import calendar
import datetime


# calendar on Python 3.11 has not implement calendar.Month yet
# https://github.com/python/cpython/blob/3.11/Lib/calendar.py#L40
class Month:
    JANUARY = 1
    FEBRUARY = 2
    MARCH = 3
    APRIL = 4
    MAY = 5
    JUNE = 6
    JULY = 7
    AUGUST = 8
    SEPTEMBER = 9
    OCTOBER = 10
    NOVEMBER = 11
    DECEMBER = 12


def get_weekdays_in_month(
    weekday: int = calendar.SUNDAY,
    year: int = datetime.date.today().year,
    month: int = datetime.date.today().month,
) -> datetime.date:
    cal = calendar.Calendar(calendar.SUNDAY)
    monthcal = cal.monthdatescalendar(year, month)
    month_weekdays = [
        day
        for week in monthcal
        for day in week
        if day.month == month and day.weekday() == weekday
    ]

    return month_weekdays


def get_mothers_day(year: int = datetime.date.today().year) -> datetime.date:
    """
    2nd Sunday in May
    """
    return get_weekdays_in_month(calendar.SUNDAY, year, Month.MAY)[1]


def get_fathers_day(year: int = datetime.date.today().year) -> datetime.date:
    """
    3rd Sunday in June
    """
    return get_weekdays_in_month(calendar.SUNDAY, year, Month.JUNE)[2]


def get_thanksgiving_day(year: int = datetime.date.today().year) -> datetime.date:
    """
    4th Thursday in November (United States and Brazil)
    """
    return get_weekdays_in_month(calendar.THURSDAY, year, Month.NOVEMBER)[3]


def get_thanksgiving_day_by_region(
    year: int = datetime.date.today().year, region="US"
) -> datetime.date:
    """
    Return Thanksgiving day by Region,

    1st Sunday in October (Germany)
    2nd Monday in October (Canada)
    1st Thursday in November (Liberia)
    Last Wednesday in November (Norfolk Island)
    4th Thursday in November (United States and Brazil)
    """
    # weekday, month, weekday_index (0-index) region_rules
    region_rules = {
        "DE": (calendar.SUNDAY, Month.OCTOBER, 0),
        "CA": (calendar.MONDAY, Month.OCTOBER, 1),
        "LR": (calendar.THURSDAY, Month.NOVEMBER, 0),
        "NF": (calendar.WEDNESDAY, Month.NOVEMBER, -1),
        "US": (calendar.THURSDAY, Month.NOVEMBER, 3),
        "BR": (calendar.THURSDAY, Month.NOVEMBER, 3),
    }

    weekday, month, weekday_index = region_rules[region]
    return get_weekdays_in_month(weekday, year, month)[weekday_index]


holiday_callout = {
    "mothers_day": {
        "summary": "Mother's Day",
        "description": "Not a public holiday, but a legal national holiday observed on the second Sunday in May in the United States.",
        "callout": get_mothers_day,
    },
    "fathers_day": {
        "summary": "Father's Day",
        "description": "Father's Day is a celebration that honours the role of fathers and forefathers.",
        "callout": get_fathers_day,
    },
    "thanksgiving_day": {
        "summary": "Thanksgiving Day",
        "description": "Traditionally, this holiday celebrates the giving of thanks for the autumn harvest.",
        "callout": get_thanksgiving_day,
    },
}
