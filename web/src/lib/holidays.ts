export function getNthWeekdayOfMonth(year: number, month: number, nth: number, weekday: number): Date {
  // month is 1-based (1=January)
  const date = new Date(year, month - 1, 1);
  const dayOfWeek = date.getDay(); // 0-6 (Sun-Sat)
  
  // Calculate offset to the first occurrence of 'weekday'
  const offset = (weekday - dayOfWeek + 7) % 7;
  const firstOccurrence = 1 + offset;
  
  const targetDate = firstOccurrence + (nth - 1) * 7;
  return new Date(year, month - 1, targetDate);
}

// Deprecated: Logic moved to dynamic calculation via ObservanceConfig
export const HOLIDAYS = {}; 

