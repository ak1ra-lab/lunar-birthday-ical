import {useForm, Controller} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {GlobalConfig} from '@/types';
import {COMMON_TIMEZONES} from '@/lib/constants';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {TagInput} from '@/components/ui/tag-input';

interface ConfigFormProps {
  config: GlobalConfig;
  onSave: (config: GlobalConfig) => void;
}

export function ConfigForm({config, onSave}: ConfigFormProps) {
  const {t} = useTranslation();
  const {register, handleSubmit, control} = useForm<GlobalConfig>({
    defaultValues: config,
  });

  const onSubmit = (data: GlobalConfig) => {
    // Convert string inputs to numbers where necessary
    const processedData = {
      ...data,
      year_start: Number(data.year_start),
      year_end: Number(data.year_end),
      days_max: Number(data.days_max),
      days_interval: Number(data.days_interval),
      event_hours: Number(data.event_hours),
      // Reminders and attendees are already arrays via TagInput and Controller
      reminders: data.reminders.map(Number).filter(n => !isNaN(n)),
      attendees: data.attendees,
      holiday_keys: data.holiday_keys || [],
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
        <CardTitle>{t('configForm.globalSettings')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">{t('configForm.timezone')}</Label>
              <Input 
                id="timezone" 
                list="timezones" 
                {...register('timezone', {required: true})} 
                placeholder="Select or type timezone"
              />
              <datalist id="timezones">
                {COMMON_TIMEZONES.map(tz => (
                  <option key={tz} value={tz} />
                ))}
              </datalist>
            </div>
            <div className="space-y-2">
              <Label htmlFor="event_time">{t('configForm.eventTime')} (HH:MM:SS)</Label>
              <Input 
                id="event_time" 
                type="time" 
                step="1"
                {...register('event_time', {required: true})} 
              />
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
              <Controller
                control={control}
                name="reminders"
                render={({field}) => (
                  <TagInput
                    value={field.value.map(String)}
                    onChange={(tags) => field.onChange(tags.map(Number))}
                    validate={validateReminder}
                    placeholder={t('eventForm.remindersPlaceholder')}
                    errorMessage="Must be a number"
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attendees">{t('eventForm.attendees')}</Label>
               <Controller
                control={control}
                name="attendees"
                render={({field}) => (
                  <TagInput
                    value={field.value}
                    onChange={field.onChange}
                    validate={validateEmail}
                    placeholder={t('eventForm.attendeesPlaceholder')}
                    errorMessage="Invalid email address"
                  />
                )}
              />
            </div>
          </div>


          <Button type="submit">{t('common.save')}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
