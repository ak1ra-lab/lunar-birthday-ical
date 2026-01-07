import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TagInput } from '@/components/ui/tag-input';
import { COMMON_TIMEZONES } from '@/lib/constants';
import { lunarToSolar, solarToLunar } from '@/lib/lunar';
import { cn } from '@/lib/utils';
import { EventConfig } from '@/types';

const LUNAR_MONTHS = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];

const LUNAR_DAYS = [
  '初一',
  '初二',
  '初三',
  '初四',
  '初五',
  '初六',
  '初七',
  '初八',
  '初九',
  '初十',
  '十一',
  '十二',
  '十三',
  '十四',
  '十五',
  '十六',
  '十七',
  '十八',
  '十九',
  '二十',
  '廿一',
  '廿二',
  '廿三',
  '廿四',
  '廿五',
  '廿六',
  '廿七',
  '廿八',
  '廿九',
  '三十',
];

const CHINESE_NUMBERS = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
function toChineseYear(year: number): string {
  return year
    .toString()
    .split('')
    .map((d) => CHINESE_NUMBERS[parseInt(d)] || d)
    .join('');
}

interface EventFormProps {
  initialData?: EventConfig;
  onSave: (event: EventConfig) => void;
  onCancel: () => void;
}

export function EventForm({ initialData, onSave, onCancel }: EventFormProps) {
  const { t } = useTranslation();
  const { register, handleSubmit, watch, setValue, control } = useForm<EventConfig>({
    defaultValues: initialData || {
      id: crypto.randomUUID(),
      name: '',
      start_date: '',
      event_keys: ['lunar_birthday'],
      summary: '',
      description: '',
      reminders: [],
      attendees: [],
    },
  });

  const startDate = watch('start_date');
  const [lunarDate, setLunarDate] = useState<string>('');
  const [inputMethod, setInputMethod] = useState<'solar' | 'lunar'>('solar');

  // Lunar Input State
  const [lunarYear, setLunarYear] = useState<number>(1990);
  const [lunarMonth, setLunarMonth] = useState<number>(1);
  const [lunarDay, setLunarDay] = useState<number>(1);
  const [isLeap, setIsLeap] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (startDate) {
      try {
        setLunarDate(solarToLunar(startDate));
      } catch {
        setLunarDate('Invalid Date');
      }
    }
  }, [startDate]);

  const handleLunarConvert = () => {
    setError(null);
    try {
      const solarDate = lunarToSolar(lunarYear, lunarMonth, lunarDay, isLeap);
      setValue('start_date', solarDate);
    } catch (e) {
      console.error(e);
      setError(t('eventForm.errorInvalidDate'));
      setValue('start_date', '');
    }
  };

  // When lunar inputs change, auto convert if in lunar mode
  useEffect(() => {
    if (inputMethod === 'lunar') {
      handleLunarConvert();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lunarYear, lunarMonth, lunarDay, isLeap, inputMethod]);

  const onSubmit = (data: EventConfig) => {
    const processedData = {
      ...data,
      event_keys: Array.isArray(data.event_keys) ? data.event_keys : data.event_keys ? [data.event_keys] : [],
      reminders: data.reminders?.map(Number).filter((n) => !isNaN(n)) || [],
    };
    onSave(processedData);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateReminder = (reminder: string) => {
    return !isNaN(Number(reminder));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? t('eventForm.titleEdit') : t('eventForm.titleAdd')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>{t('eventForm.name')}</Label>
            <Input id='name' {...register('name', { required: true })} placeholder={t('eventForm.namePlaceholder')} />
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label>{t('eventForm.startDate')}</Label>
              <div className='flex space-x-2 text-xs'>
                <button
                  type='button'
                  onClick={() => setInputMethod('solar')}
                  className={cn(
                    'px-2 py-1 rounded',
                    inputMethod === 'solar' ? 'bg-slate-900 text-white' : 'bg-slate-100',
                  )}
                >
                  {t('eventForm.solarInput')}
                </button>
                <button
                  type='button'
                  onClick={() => setInputMethod('lunar')}
                  className={cn(
                    'px-2 py-1 rounded',
                    inputMethod === 'lunar' ? 'bg-slate-900 text-white' : 'bg-slate-100',
                  )}
                >
                  {t('eventForm.lunarInput')}
                </button>
              </div>
            </div>

            {inputMethod === 'solar' ? (
              <Input type='date' id='start_date' {...register('start_date', { required: true })} />
            ) : (
              <div className='p-4 border rounded-md bg-slate-50 space-y-3'>
                <div className='grid grid-cols-2 gap-2'>
                  <div className='col-span-2 sm:col-span-1'>
                    <Label className='text-xs'>{t('eventForm.year')}</Label>
                    <div className='flex items-center gap-2'>
                      <Input
                        type='number'
                        value={lunarYear}
                        onChange={(e) => setLunarYear(Number(e.target.value))}
                        className='w-24'
                      />
                      <span className='text-sm text-muted-foreground whitespace-nowrap'>
                        {toChineseYear(lunarYear)}年
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className='text-xs'>{t('eventForm.month')}</Label>
                    <select
                      className='flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm'
                      value={lunarMonth}
                      onChange={(e) => setLunarMonth(Number(e.target.value))}
                    >
                      {LUNAR_MONTHS.map((name, i) => (
                        <option key={i + 1} value={i + 1}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className='text-xs'>{t('eventForm.day')}</Label>
                    <select
                      className='flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm'
                      value={lunarDay}
                      onChange={(e) => setLunarDay(Number(e.target.value))}
                    >
                      {LUNAR_DAYS.map((name, i) => (
                        <option key={i + 1} value={i + 1}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='flex items-end pb-2'>
                    <label className='flex items-center space-x-2 cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={isLeap}
                        onChange={(e) => setIsLeap(e.target.checked)}
                        className='h-4 w-4 rounded border-gray-300'
                      />
                      <span className='text-sm'>{t('eventForm.leapMonth')}</span>
                    </label>
                  </div>
                </div>
                <div className='text-xs text-muted-foreground'>
                  {t('eventForm.convertedSolar')}: {startDate || '...'}
                </div>
                {error && <div className='text-xs text-red-500 font-medium'>{error}</div>}
              </div>
            )}

            {/* Hidden input to ensure form submission works with the value */}
            {inputMethod === 'lunar' && <input type='hidden' {...register('start_date', { required: true })} />}

            {startDate && inputMethod === 'solar' && (
              <p className='text-sm text-muted-foreground'>
                {t('eventForm.lunarDate')}: {lunarDate}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label>{t('configForm.eventTime')} (HH:MM:SS)</Label>
            <Input type='time' step='1' {...register('event_time')} placeholder={t('configForm.eventTime')} />
          </div>

          <div className='space-y-2'>
            <Label>{t('configForm.timezone')}</Label>
            <Input list='timezones' {...register('timezone')} placeholder='Select or type timezone' />
            <datalist id='timezones'>
              {COMMON_TIMEZONES.map((tz) => (
                <option key={tz} value={tz} />
              ))}
            </datalist>
          </div>

          <div className='space-y-2'>
            <Label>{t('eventForm.eventTypes')}</Label>
            <div className='flex flex-col space-y-2'>
              <label className='flex items-center space-x-2'>
                <input type='checkbox' value='lunar_birthday' {...register('event_keys')} />
                <span>{t('eventForm.lunarBirthday')}</span>
              </label>
              <label className='flex items-center space-x-2'>
                <input type='checkbox' value='solar_birthday' {...register('event_keys')} />
                <span>{t('eventForm.solarBirthday')}</span>
              </label>
              <label className='flex items-center space-x-2'>
                <input type='checkbox' value='integer_days' {...register('event_keys')} />
                <span>{t('eventForm.integerDays')}</span>
              </label>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='reminders'>{t('eventForm.reminders')}</Label>
            <Controller
              control={control}
              name='reminders' // Ensure 'reminders' is initialized as [] in your defaultValues
              render={({ field }) => (
                <TagInput
                  value={(field.value || []).map(String)}
                  onChange={(tags) => field.onChange(tags.map(Number))}
                  validate={validateReminder}
                  placeholder={t('eventForm.remindersPlaceholder')}
                  errorMessage='Must be a number'
                />
              )}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='attendees'>{t('eventForm.attendees')}</Label>
            <Controller
              control={control}
              name='attendees' // Ensure 'attendees' is initialized as [] in your defaultValues
              render={({ field }) => (
                <TagInput
                  value={field.value || []}
                  onChange={field.onChange}
                  validate={validateEmail}
                  placeholder={t('eventForm.attendeesPlaceholder')}
                  errorMessage='Invalid email address'
                />
              )}
            />
          </div>

          <div className='flex justify-end space-x-2'>
            <Button type='button' variant='outline' onClick={onCancel}>
              {t('common.cancel')}
            </Button>
            <Button type='submit'>{t('common.save')}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
