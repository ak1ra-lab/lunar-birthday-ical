export function getMothersDay(year: number): Date {
  // 2nd Sunday in May
  const may = new Date(year, 4, 1); // Month is 0-indexed, 4 is May
  const dayOfWeek = may.getDay(); // 0 is Sunday
  // If May 1st is Sunday (0), then 1st Sunday is May 1st. 2nd Sunday is May 8th.
  // If May 1st is Monday (1), then 1st Sunday is May 7th. 2nd Sunday is May 14th.
  // Offset to first Sunday: (7 - dayOfWeek) % 7
  const offsetToFirstSunday = (7 - dayOfWeek) % 7;
  const firstSundayDate = 1 + offsetToFirstSunday;
  const secondSundayDate = firstSundayDate + 7;
  return new Date(year, 4, secondSundayDate);
}

export function getFathersDay(year: number): Date {
  // 3rd Sunday in June
  const june = new Date(year, 5, 1); // Month is 0-indexed, 5 is June
  const dayOfWeek = june.getDay();
  const offsetToFirstSunday = (7 - dayOfWeek) % 7;
  const firstSundayDate = 1 + offsetToFirstSunday;
  const thirdSundayDate = firstSundayDate + 14;
  return new Date(year, 5, thirdSundayDate);
}

export function getThanksgivingDay(year: number): Date {
  // 4th Thursday in November
  const november = new Date(year, 10, 1); // Month is 0-indexed, 10 is November
  const dayOfWeek = november.getDay(); // 0 is Sunday, 4 is Thursday
  // Target is Thursday (4)
  // If Nov 1st is Thursday (4), then 1st Thursday is Nov 1st.
  // If Nov 1st is Friday (5), then 1st Thursday is Nov 7th.
  // Offset to first Thursday: (4 - dayOfWeek + 7) % 7
  const offsetToFirstThursday = (4 - dayOfWeek + 7) % 7;
  const firstThursdayDate = 1 + offsetToFirstThursday;
  const fourthThursdayDate = firstThursdayDate + 21;
  return new Date(year, 10, fourthThursdayDate);
}

export interface HolidayInfo {
  key: string;
  label: string;
  summary: string;
  description: string;
  getDate: (year: number) => Date;
}

export const HOLIDAYS: Record<string, HolidayInfo> = {
  mothers_day: {
    key: 'mothers_day',
    label: "Mother's Day (2nd Sunday in May)",
    summary: "Mother's Day",
    description: "Mother's Day is a celebration honoring the mother of the family or individual, as well as motherhood, maternal bonds, and the influence of mothers in society. It is celebrated on different days in many parts of the world, most commonly in the months of March or May.",
    getDate: getMothersDay,
  },
  fathers_day: {
    key: 'fathers_day',
    label: "Father's Day (3rd Sunday in June)",
    summary: "Father's Day",
    description: "Father's Day is a holiday of honoring fatherhood and paternal bonds, as well as the influence of fathers in society. In Catholic countries of Europe, it has been celebrated on March 19 as Saint Joseph's Day since the Middle Ages. In the United States, Father's Day was founded by Sonora Smart Dodd, and celebrated on the third Sunday of June for the first time in 1910.",
    getDate: getFathersDay,
  },
  thanksgiving_day: {
    key: 'thanksgiving_day',
    label: "Thanksgiving Day (4th Thursday in November)",
    summary: "Thanksgiving Day",
    description: "Thanksgiving is a national holiday celebrated on various dates in the United States, Canada, Grenada, Saint Lucia, and Liberia. It began as a day of giving thanks for the blessing of the harvest and of the preceding year.",
    getDate: getThanksgivingDay,
  },
};
