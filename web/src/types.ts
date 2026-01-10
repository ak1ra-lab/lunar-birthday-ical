export interface GlobalConfig {
  timezone: string;
  year_start: number;
  year_end: number;
  days_max: number;
  days_interval: number;
  event_time: string;
  event_hours: number;
  reminders: number[];
  attendees: string[];
  holiday_keys: string[];
  calendar_name?: string;
}

export interface EventConfig {
  id: string;
  name: string;
  start_date: string; // YYYY-MM-DD
  event_keys: string[]; // 'lunar_birthday' | 'solar_birthday' | 'integer_days'
  summary?: string;
  description?: string;
  reminders?: number[];
  attendees?: string[];
  // Override global settings if needed
  timezone?: string;
  event_time?: string;
  event_hours?: number;
}

export interface ObservanceConfig {
  id: string;
  name: string;
  month: number; // 1-12
  week: number; // 1-5 (5 could denote Last, or handle separately. For now, 1-4 supported as specific Nth)
  weekday: number; // 0 (Sun) - 6 (Sat)
  summary?: string;
  description?: string;
  reminders?: number[];
  attendees?: string[];
}

export interface AppConfig {
  global: GlobalConfig;
  events: EventConfig[];
  observances: ObservanceConfig[];
}

export const DEFAULT_CONFIG: AppConfig = {
  global: {
    timezone: 'Asia/Shanghai',
    year_start: new Date().getFullYear(),
    year_end: new Date().getFullYear() + 5,
    days_max: 30000,
    days_interval: 1000,
    event_time: '10:00:00',
    event_hours: 2,
    reminders: [1, 3],
    attendees: [],
    holiday_keys: [],
    calendar_name: 'Lunar Birthday iCalendar',
  },
  events: [],
  observances: [],
};
