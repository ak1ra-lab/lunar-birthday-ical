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

export interface AppConfig {
  global: GlobalConfig;
  events: EventConfig[];
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
  },
  events: [],
};

export const AVAILABLE_HOLIDAYS = [
  {key: 'mothers_day', label: 'Mother\'s Day (2nd Sunday in May)'},
  {key: 'fathers_day', label: 'Father\'s Day (3rd Sunday in June)'},
  {key: 'thanksgiving_day', label: 'Thanksgiving Day (4th Thursday in November)'},
];
