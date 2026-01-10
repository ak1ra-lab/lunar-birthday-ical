import { addDays, parseISO } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { TFunction } from 'i18next';
import * as ics from 'ics';

import { AppConfig, EventConfig, GlobalConfig } from '../types';
import { getNthWeekdayOfMonth } from './holidays';
import { getFutureSolarDate } from './lunar';

// Helper to merge config
function mergeConfig(global: GlobalConfig, event: EventConfig) {
  return {
    ...event,
    timezone: event.timezone || global.timezone,
    event_time: event.event_time || global.event_time,
    event_hours: event.event_hours || global.event_hours,
    // Treat empty array as "inherit from global" because UI defaults to empty
    reminders: event.reminders && event.reminders.length > 0 ? event.reminders : global.reminders,
    attendees: event.attendees && event.attendees.length > 0 ? event.attendees : global.attendees,
  };
}

function createUtcStartArray(date: Date, timeStr: string, timezone?: string): [number, number, number, number, number] {
  const [hours, minutes] = timeStr.split(':').map(Number);

  let utcDate: Date;
  if (timezone) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const isoStr = `${y}-${m}-${d}T${hh}:${mm}:00`;
    try {
      utcDate = fromZonedTime(isoStr, timezone);
    } catch (e) {
      console.warn('Invalid timezone:', timezone);
      utcDate = new Date(date);
      utcDate.setHours(hours, minutes, 0, 0);
      console.error(e);
    }
  } else {
    utcDate = new Date(date);
    utcDate.setHours(hours, minutes, 0, 0);
  }

  return [
    utcDate.getUTCFullYear(),
    utcDate.getUTCMonth() + 1,
    utcDate.getUTCDate(),
    utcDate.getUTCHours(),
    utcDate.getUTCMinutes(),
  ];
}

function formatDescription(template: string, data: Record<string, string | number | undefined>): string {
  return template.replace(/{(\w+)}/g, (match, key) => {
    return typeof data[key] !== 'undefined' ? String(data[key]) : match;
  });
}

export async function generateICal(config: AppConfig, t: TFunction): Promise<string> {
  const events: ics.EventAttributes[] = [];
  const { global } = config;

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

        const start = createUtcStartArray(eventDate, cfg.event_time, cfg.timezone);
        const duration = { hours: cfg.event_hours };

        const age = (days / 365.25).toFixed(2);

        const defaultSummary = t('ical.integerDaysSummary');
        const defaultDesc = t('ical.integerDaysDescription');

        const data = {
          name: cfg.name,
          days,
          age,
          birthday: cfg.start_date,
        };

        const title = formatDescription(cfg.summary || defaultSummary, data);
        const description = formatDescription(cfg.description || defaultDesc, data);

        events.push({
          start,
          startInputType: 'utc',
          duration,
          title,
          description,
          alarms: cfg.reminders.map((r) => ({
            action: 'display',
            description: `Reminder: ${title}`,
            trigger: { before: true, days: r, minutes: 0 },
          })),
          attendees: cfg.attendees.map((email) => ({
            name: email.split('@')[0],
            email,
            rsvp: true,
            role: 'REQ-PARTICIPANT',
          })),
          calName: global.calendar_name || 'Lunar Birthday iCalendar',
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

        const start = createUtcStartArray(eventDate, cfg.event_time, cfg.timezone);
        const duration = { hours: cfg.event_hours };
        const age = year - startDate.getFullYear();

        let defaultSummary = '';
        let defaultDesc = '';

        if (type === 'solar_birthday') {
          defaultSummary = t('ical.solarBirthdaySummary');
          defaultDesc = t('ical.solarBirthdayDescription');
        } else {
          defaultSummary = t('ical.lunarBirthdaySummary');
          defaultDesc = t('ical.lunarBirthdayDescription');
        }

        const data = {
          name: cfg.name,
          year,
          age,
          birthday: cfg.start_date,
        };

        const title = formatDescription(cfg.summary || defaultSummary, data);
        const description = formatDescription(cfg.description || defaultDesc, data);

        events.push({
          start,
          startInputType: 'utc',
          duration,
          title,
          description,
          alarms: cfg.reminders.map((r) => ({
            action: 'display',
            description: `Reminder: ${title}`,
            trigger: { before: true, days: r, minutes: 0 },
          })),
          attendees: cfg.attendees.map((email) => ({
            name: email.split('@')[0],
            email,
            rsvp: true,
            role: 'REQ-PARTICIPANT',
          })),
          calName: global.calendar_name || 'Lunar Birthday iCalendar',
        });
      }
    }
  }

  // Observances
  if (config.observances && config.observances.length > 0) {
    for (const obs of config.observances) {
      for (let year = global.year_start; year <= global.year_end; year++) {
        const date = getNthWeekdayOfMonth(year, obs.month, obs.week, obs.weekday);

        const start = createUtcStartArray(date, global.event_time, global.timezone);
        const duration = { hours: global.event_hours };

        // Use translated title if it matches a key, otherwise use name
        // Actually, let's just use the name from config, allowing user to edit it.
        const title = obs.summary || obs.name;
        const description = obs.description || obs.name;

        const reminders = obs.reminders && obs.reminders.length > 0 ? obs.reminders : global.reminders;
        const attendees = obs.attendees && obs.attendees.length > 0 ? obs.attendees : global.attendees;

        events.push({
          start,
          startInputType: 'utc',
          duration,
          title,
          description,
          alarms: reminders.map((r) => ({
            action: 'display',
            description: `Reminder: ${title}`,
            trigger: { before: true, days: r, minutes: 0 },
          })),
          attendees: attendees.map((email) => ({
            name: email.split('@')[0],
            email,
            rsvp: true,
            role: 'REQ-PARTICIPANT',
          })),
          calName: global.calendar_name || 'Lunar Birthday iCalendar',
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
