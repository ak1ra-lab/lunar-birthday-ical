import datetime

from lunar_python import Lunar, LunarYear

from lunar_birthday_ical.utils import get_logger

logger = get_logger()


def get_future_lunar_equivalent_date(
    past_solar_date: datetime.date, age: int
) -> datetime.date:
    """
    Calculate the equivalent future solar date for a given past solar date and a target lunar year.
    """
    # 获取输入日期对应的农历
    past_solar_datetime = datetime.datetime.combine(
        past_solar_date, datetime.time(0, 0, 0)
    )
    # .fromDate 所接受的类型为 datetime.datetime, 实际上处理后会把 time 部分丢弃
    lunar = Lunar.fromDate(past_solar_datetime)
    year = lunar.getYear() + age
    lunar_year = LunarYear.fromYear(year)

    # 获取闰月
    leap_month = lunar_year.getLeapMonth()

    # 确定目标年份的农历月
    if lunar.getMonth() > 0:
        lunar_month = lunar_year.getMonth(lunar.getMonth())
    elif abs(lunar.getMonth()) == leap_month:
        lunar_month = lunar_year.getMonth(lunar.getMonth())
    else:
        lunar_month = lunar_year.getMonth(abs(lunar.getMonth()))

    # 确定农历日
    lunar_day = min(lunar.getDay(), lunar_month.getDayCount())

    # 创建目标年份的农历日期
    future_lunar = Lunar.fromYmd(year, lunar_month.getMonth(), lunar_day)

    # 转换为公历日期
    future_solar_date = datetime.datetime.strptime(
        future_lunar.getSolar().toYmd(), "%Y-%m-%d"
    ).date()
    return future_solar_date
