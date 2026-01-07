import { Lunar, LunarYear, Solar } from 'lunar-typescript';

export function getFutureSolarDate(solarDateStr: string, targetYear: number): Date {
  // solarDateStr is YYYY-MM-DD
  const [year, month, day] = solarDateStr.split('-').map(Number);
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();

  const targetLunarYear = LunarYear.fromYear(targetYear);
  const leapMonth = targetLunarYear.getLeapMonth();

  let targetLunarMonth;
  const lunarMonth = lunar.getMonth();

  // Logic from python:
  // if lunar_date.getMonth() > 0: target_lunar_month = target_lunar_year.getMonth(lunar_date.getMonth())
  // elif abs(lunar_date.getMonth()) == leap_month:
  //     target_lunar_month = target_lunar_year.getMonth(lunar_date.getMonth())
  // else: target_lunar_month = target_lunar_year.getMonth(abs(lunar_date.getMonth()))

  // In lunar-typescript, getMonth() returns negative for leap month?
  // Let's check standard behavior. Usually negative means leap.

  if (lunarMonth > 0) {
    targetLunarMonth = targetLunarYear.getMonth(lunarMonth);
  } else if (Math.abs(lunarMonth) === leapMonth) {
    targetLunarMonth = targetLunarYear.getMonth(lunarMonth);
  } else {
    targetLunarMonth = targetLunarYear.getMonth(Math.abs(lunarMonth));
  }

  if (!targetLunarMonth) {
    // Fallback if something goes wrong, though shouldn't happen with valid inputs
    throw new Error(`Could not find target lunar month for year ${targetYear}`);
  }

  const targetLunarDay = Math.min(lunar.getDay(), targetLunarMonth.getDayCount());

  // Note: Lunar.fromYmd takes (lunarYear, lunarMonth, lunarDay)
  // If month is negative, it handles it as leap month if valid.
  const targetLunarDate = Lunar.fromYmd(targetYear, targetLunarMonth.getMonth(), targetLunarDay);

  const targetSolar = targetLunarDate.getSolar();
  return new Date(targetSolar.getYear(), targetSolar.getMonth() - 1, targetSolar.getDay());
}

export function solarToLunar(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();
  return lunar.toString();
}

export function lunarToSolar(year: number, month: number, day: number, isLeap: boolean): string {
  // This is a bit tricky without a direct "Lunar to Solar" input form that matches exactly.
  // But usually we start from Solar in this app.
  // If we need a converter, we can implement it.
  const lunar = Lunar.fromYmd(year, isLeap ? -month : month, day);
  const solar = lunar.getSolar();
  return solar.toYmd();
}
