import {useForm} from 'react-hook-form';
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
      reminders: Array.isArray(data.reminders) ? data.reminders : String(data.reminders).split(',').map(Number),
      attendees: Array.isArray(data.attendees) ? data.attendees : String(data.attendees).split(',').map((s) => s.trim()).filter(Boolean),
      holiday_keys: data.holiday_keys || [],
    };
    onSave(processedData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" {...register('timezone', {required: true})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event_time">Event Time (HH:MM:SS)</Label>
              <Input id="event_time" {...register('event_time', {required: true})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year_start">Start Year</Label>
              <Input type="number" id="year_start" {...register('year_start', {required: true})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year_end">End Year</Label>
              <Input type="number" id="year_end" {...register('year_end', {required: true})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="days_max">Max Days (Integer Days)</Label>
              <Input type="number" id="days_max" {...register('days_max')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="days_interval">Interval (Integer Days)</Label>
              <Input type="number" id="days_interval" {...register('days_interval')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event_hours">Duration (Hours)</Label>
              <Input type="number" id="event_hours" {...register('event_hours')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminders">Reminders (days before, comma separated)</Label>
              <Input id="reminders" {...register('reminders')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attendees">Attendees (emails, comma separated)</Label>
              <Input id="attendees" {...register('attendees')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Public Holidays</Label>
            <div className="flex flex-wrap gap-4">
              {AVAILABLE_HOLIDAYS.map((holiday) => (
                <div key={holiday.key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={holiday.key}
                    {...register('holiday_keys')}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <Label className="font-normal">{holiday.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit">Save Global Settings</Button>
        </form>
      </CardContent>
    </Card>
  );
}
