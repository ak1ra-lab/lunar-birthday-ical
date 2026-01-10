import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TagInput } from '@/components/ui/tag-input';
import { ObservanceConfig } from '@/types';

interface ObservanceFormProps {
  initialData?: ObservanceConfig;
  onSave: (observance: ObservanceConfig) => void;
  onCancel: () => void;
}

const PRESETS = [
  { key: 'mothers_day', name: "Mother's Day", week: 2, weekday: 0, month: 5 },
  { key: 'fathers_day', name: "Father's Day", week: 3, weekday: 0, month: 6 },
  { key: 'thanksgiving_day', name: 'Thanksgiving Day', week: 4, weekday: 4, month: 11 },
];

export function ObservanceForm({ initialData, onSave, onCancel }: ObservanceFormProps) {
  const { t } = useTranslation();
  const { register, handleSubmit, control, setValue } = useForm<ObservanceConfig>({
    defaultValues: initialData || {
      id: crypto.randomUUID(),
      name: '',
      month: 1,
      week: 1,
      weekday: 0,
      summary: '',
      description: '',
      reminders: [],
      attendees: [],
    },
  });

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetKey = e.target.value;
    if (!presetKey) return;
    const preset = PRESETS.find((p) => p.key === presetKey);
    if (preset) {
      // Use translation for name if available, or fallback to preset.name (English)
      // But usually we want the name to be in the current language?
      // Actually, let's keep name as the English key or translation?
      // If we use translation, switching language might be weird if name is saved.
      // But 'name' is just a string. Let's use the translated holiday name (without date info).
      const translatedName = t(`holidays.${preset.key}`).split('(')[0].trim();
      setValue('name', translatedName);
      setValue('week', preset.week);
      setValue('weekday', preset.weekday);
      setValue('month', preset.month);
      setValue('summary', translatedName);
      setValue('description', `${translatedName}`);
    }
  };

  const onSubmit = (data: ObservanceConfig) => {
    onSave({
      ...data,
      month: Number(data.month),
      week: Number(data.week),
      weekday: Number(data.weekday),
      reminders: data.reminders?.map(Number).filter((n) => !isNaN(n)) || [],
    });
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
          {!initialData && (
            <div className='space-y-2 p-3 bg-slate-50 rounded-md border text-sm'>
              <Label className='text-muted-foreground'>{t('observanceForm.loadPreset')}</Label>
              <select
                className='flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors'
                onChange={handlePresetChange}
                defaultValue=''
              >
                <option value=''>{t('observanceForm.selectPreset')}</option>
                {PRESETS.map((p) => (
                  <option key={p.key} value={p.key}>
                    {t(`holidays.${p.key}`)}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className='space-y-2'>
            <Label htmlFor='name'>{t('observanceForm.title')}</Label>
            <Input
              id='name'
              {...register('name', { required: true })}
              placeholder={t('observanceForm.titlePlaceholder')}
            />
          </div>

          <div className='grid grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <Label>{t('observanceForm.week')}</Label>
              <select
                {...register('week')}
                className='flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm'
              >
                {[1, 2, 3, 4].map((w) => (
                  <option key={w} value={w}>
                    {t(`observanceForm.weeks.${w}`)}
                  </option>
                ))}
              </select>
            </div>
            <div className='space-y-2'>
              <Label>{t('observanceForm.weekday')}</Label>
              <select
                {...register('weekday')}
                className='flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm'
              >
                {[0, 1, 2, 3, 4, 5, 6].map((w) => (
                  <option key={w} value={w}>
                    {t(`observanceForm.weekdays.${w}`)}
                  </option>
                ))}
              </select>
            </div>
            <div className='space-y-2'>
              <Label>{t('observanceForm.month')}</Label>
              <select
                {...register('month')}
                className='flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm'
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {t(`observanceForm.months.${m}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className='text-xs text-muted-foreground'>{t('observanceForm.example')}</div>

          <div className='space-y-2'>
            <Label htmlFor='reminders'>{t('eventForm.reminders')}</Label>
            <Controller
              control={control}
              name='reminders'
              render={({ field }) => (
                <TagInput
                  value={(field.value || []).map(String)}
                  onChange={(tags) => field.onChange(tags.map(Number))}
                  validate={validateReminder}
                  placeholder={t('eventForm.remindersPlaceholder')}
                  errorMessage={t('common.errorMustBeNumber')}
                />
              )}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='attendees'>{t('eventForm.attendees')}</Label>
            <Controller
              control={control}
              name='attendees'
              render={({ field }) => (
                <TagInput
                  value={field.value || []}
                  onChange={field.onChange}
                  validate={validateEmail}
                  placeholder={t('eventForm.attendeesPlaceholder')}
                  errorMessage={t('common.errorInvalidEmail')}
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
