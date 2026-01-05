import * as ics from 'ics';
import {AppConfig, EventConfig, GlobalConfig} from '../types';
import {getFutureSolarDate} from './lunar';
import {getMothersDay, getFathersDay, getThanksgivingDay} from './holidays';
import {addDays, parseISO} from 'date-fns';

// Helper to merge config
function mergeConfig(global: GlobalConfig, event: EventConfig) {
  return {
    timezone: event.timezone || global.timezone,
    event_time: event.event_time || global.event_time,
    event_hours: event.event_hours || global.event_hours,
    reminders: event.reminders || global.reminders,
    attendees: event.attendees || global.attendees,
    ...event,
  };
}

function createDateArray(date: Date, timeStr: string): [number, number, number, number, number] {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    hours,
    minutes,
  ];
}

function formatDescription(template: string, data: Record<string, string | number | undefined>): string {
  return template.replace(/{(\w+)}/g, (match, key) => {
    return typeof data[key] !== 'undefined' ? String(data[key]) : match;
  });
}

export async function generateICal(config: AppConfig): Promise<string> {
  const events: ics.EventAttributes[] = [];
  const {global} = config;

  // Process Events
  for (const eventConfig of config.events) {
    const cfg = mergeConfig(global, eventConfig);
    const startDate = parseISO(cfg.start_date);

    // Integer Days
    if (cfg.event_keys.includes('integer_days')) {
      const daysMax = global.days_max;
      const daysInterval = global.days_interval;

      for (let days = daysInterval; days <= daysMax; days += daysInterval) {
        const eventDate = addDays(startDate, days);
        const year = eventDate.getFullYear();

        if (year < global.year_start || year > global.year_end) continue;

        const start = createDateArray(eventDate, cfg.event_time);
        const duration = {hours: cfg.event_hours};

        const age = (days / 365.25).toFixed(2);

        const defaultSummary = '{name} 降临地球🌏已经 {days} 天啦!';
        const defaultDesc = '{name} 降临地球🌏已经 {days} 天啦! (age: {age}, birthday: {birthday})';

        const data = {
          name: cfg.name,
          days,
          age,
          birthday: cfg.start_date,
        };

        events.push({
          start,
          duration,
          title: formatDescription(cfg.summary || defaultSummary, data),
          description: formatDescription(cfg.description || defaultDesc, data),
          alarms: cfg.reminders.map((r) => ({
            action: 'display',
            trigger: {before: true, days: r, minutes: 0},
          })),
          attendees: cfg.attendees.map((email) => ({name: email.split('@')[0], email, rsvp: true})),
          calName: 'Lunar Birthday Calendar',
        });
      }
    }

    // Birthdays
    const birthdayTypes = ['solar_birthday', 'lunar_birthday'];
    for (const type of birthdayTypes) {
      if (!cfg.event_keys.includes(type)) continue;

      for (let year = global.year_start; year <= global.year_end; year++) {
        let eventDate: Date;
        if (type === 'solar_birthday') {
          eventDate = new Date(startDate);
          eventDate.setFullYear(year);
        } else {
          // Lunar Birthday
          try {
            eventDate = getFutureSolarDate(cfg.start_date, year);
            // For description, we might want to show the lunar date string, but let's keep it simple for now
          } catch (e) {
            console.error(`Error calculating lunar birthday for ${year}`, e);
            continue;
          }
        }

        const start = createDateArray(eventDate, cfg.event_time);
        const duration = {hours: cfg.event_hours};
        const age = year - startDate.getFullYear();

        let defaultSummary = '';
        let defaultDesc = '';

        if (type === 'solar_birthday') {
          defaultSummary = '{name} {year} 年生日🎂快乐!';
          defaultDesc = '{name} {year} 年生日🎂快乐! (age: {age}, birthday: {birthday})';
        } else {
          defaultSummary = '{name} {year} 年农历生日🎂快乐!';
          defaultDesc = '{name} {year} 年农历生日🎂快乐! (age: {age}, birthday: {birthday})';
        }

        const data = {
          name: cfg.name,
          year,
          age,
          birthday: cfg.start_date,
        };

        events.push({
          start,
          duration,
          title: formatDescription(cfg.summary || defaultSummary, data),
          description: formatDescription(cfg.description || defaultDesc, data),
          alarms: cfg.reminders.map((r) => ({
            action: 'display',
            trigger: {before: true, days: r, minutes: 0},
          })),
          attendees: cfg.attendees.map((email) => ({name: email.split('@')[0], email, rsvp: true})),
        });
      }
    }
  }

  // Process Holidays
  if (global.holiday_keys && global.holiday_keys.length > 0) {
    for (let year = global.year_start; year <= global.year_end; year++) {
      if (global.holiday_keys.includes('mothers_day')) {
        const date = getMothersDay(year);
        const start = createDateArray(date, global.event_time);
        events.push({
          start,
          duration: {hours: global.event_hours},
          title: 'Mother\'s Day',
          description: 'Mother\'s Day',
          alarms: global.reminders.map((r) => ({
            action: 'display',
            trigger: {before: true, days: r, minutes: 0},
          })),
        });
      }
      if (global.holiday_keys.includes('fathers_day')) {
        const date = getFathersDay(year);
        const start = createDateArray(date, global.event_time);
        events.push({
          start,
          duration: {hours: global.event_hours},
          title: 'Father\'s Day',
          description: 'Father\'s Day',
          alarms: global.reminders.map((r) => ({
            action: 'display',
            trigger: {before: true, days: r, minutes: 0},
          })),
        });
      }
      if (global.holiday_keys.includes('thanksgiving_day')) {
        const date = getThanksgivingDay(year);
        const start = createDateArray(date, global.event_time);
        events.push({
          start,
          duration: {hours: global.event_hours},
          title: 'Thanksgiving Day',
          description: 'Thanksgiving Day',
          alarms: global.reminders.map((r) => ({
            action: 'display',
            trigger: {before: true, days: r, minutes: 0},
          })),
        });
      }
    }
  }

  return new Promise((resolve, reject) => {
    ics.createEvents(events, (error, value) => {
      if (error) {
        reject(error);
      } else {
        resolve(value);
      }
    });
  });
}
