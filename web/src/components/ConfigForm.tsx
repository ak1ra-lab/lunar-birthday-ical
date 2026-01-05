import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {GlobalConfig, AVAILABLE_HOLIDAYS} from '@/types';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';

interface ConfigFormProps {
  config: GlobalConfig;
  onSave: (config: GlobalConfig) => void;
}

export function ConfigForm({config, onSave}: ConfigFormProps) {
  const {t} = useTranslation();
  const {register, handleSubmit} = useForm<GlobalConfig>({
    defaultValues: config,
  });

  const onSubmit = (data: GlobalConfig) => {
    // Convert string inputs to numbers/arrays where necessary
    const processedData = {
      ...data,
      year_start: Number(data.year_start),
      year_end: Number(data.year_end),
      days_max: Number(data.days_max),
      days_interval: Number(data.days_interval),
      event_hours: Number(data.event_hours),
      reminders: Array.isArray(data.reminders) ? data.reminders : String(data.reminders).split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)),
      attendees: Array.isArray(data.attendees) ? data.attendees : String(data.attendees).split(',').map((s) => s.trim()).filter(Boolean),
      holiday_keys: data.holiday_keys || [],
    };
    onSave(processedData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('configForm.globalSettings')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">{t('configForm.timezone')}</Label>
              <Input id="timezone" {...register('timezone', {required: true})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event_time">{t('configForm.eventTime')} (HH:MM:SS)</Label>
              <Input id="event_time" {...register('event_time', {required: true})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year_start">{t('configForm.yearRange')} ({t('eventForm.year')})</Label>
              <div className="flex items-center space-x-2">
                <Input type="number" id="year_start" {...register('year_start', {required: true})} />
                <span>{t('configForm.to')}</span>
                <Input type="number" id="year_end" {...register('year_end', {required: true})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="days_max">{t('eventForm.integerDays')} (Max)</Label>
              <Input type="number" id="days_max" {...register('days_max')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="days_interval">{t('eventForm.integerDays')} (Interval)</Label>
              <Input type="number" id="days_interval" {...register('days_interval')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event_hours">{t('configForm.duration')}</Label>
              <Input type="number" id="event_hours" {...register('event_hours')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminders">{t('eventForm.reminders')}</Label>
              <Input id="reminders" {...register('reminders')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attendees">{t('eventForm.attendees')}</Label>
              <Input id="attendees" {...register('attendees')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('configForm.holidays')}</Label>
            <div className="flex flex-wrap gap-4">
              {AVAILABLE_HOLIDAYS.map((holiday) => (
                <div key={holiday.key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={holiday.key}
                    {...register('holiday_keys')}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <Label className="font-normal">{t(`holidays.${holiday.key}`)}</Label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit">{t('common.save')}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
