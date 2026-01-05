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
