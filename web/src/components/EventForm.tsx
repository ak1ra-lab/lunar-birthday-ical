import {useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {EventConfig} from '@/types';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {solarToLunar, lunarToSolar} from '@/lib/lunar';
import {cn} from '@/lib/utils';

interface EventFormProps {
  initialData?: EventConfig;
  onSave: (event: EventConfig) => void;
  onCancel: () => void;
}

export function EventForm({initialData, onSave, onCancel}: EventFormProps) {
  const {register, handleSubmit, watch, setValue} = useForm<EventConfig>({
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
    try {
      const solarDate = lunarToSolar(lunarYear, lunarMonth, lunarDay, isLeap);
      setValue('start_date', solarDate);
    } catch (e) {
      console.error(e);
      // alert("Invalid Lunar Date"); // Avoid alert in render loop
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
      event_keys: Array.isArray(data.event_keys) ? data.event_keys : (data.event_keys ? [data.event_keys] : []),
    };
    onSave(processedData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Event' : 'Add New Event'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name', {required: true})} placeholder="Name (e.g. Zhang San)" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Start Date (Birthday)</Label>
              <div className="flex space-x-2 text-xs">
                <button
                  type="button"
                  onClick={() => setInputMethod('solar')}
                  className={cn('px-2 py-1 rounded', inputMethod === 'solar' ? 'bg-slate-900 text-white' : 'bg-slate-100')}
                >
                        Solar Input
                </button>
                <button
                  type="button"
                  onClick={() => setInputMethod('lunar')}
                  className={cn('px-2 py-1 rounded', inputMethod === 'lunar' ? 'bg-slate-900 text-white' : 'bg-slate-100')}
                >
                        Lunar Input
                </button>
              </div>
            </div>

            {inputMethod === 'solar' ? (
                <Input type="date" id="start_date" {...register('start_date', {required: true})} />
            ) : (
                <div className="p-4 border rounded-md bg-slate-50 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Year</Label>
                      <Input
                        type="number"
                        value={lunarYear}
                        onChange={(e) => setLunarYear(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Month</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                        value={lunarMonth}
                        onChange={(e) => setLunarMonth(Number(e.target.value))}
                      >
                        {Array.from({length: 12}, (_, i) => i + 1).map((m) => (
                          <option key={m} value={m}>{m}月</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs">Day</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                        value={lunarDay}
                        onChange={(e) => setLunarDay(Number(e.target.value))}
                      >
                        {Array.from({length: 30}, (_, i) => i + 1).map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end pb-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isLeap}
                          onChange={(e) => setIsLeap(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <span className="text-sm">Leap Month (闰月)</span>
                      </label>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                        Converted Solar Date: {startDate || '...'}
                  </div>
                </div>
            )}

            {/* Hidden input to ensure form submission works with the value */}
            {inputMethod === 'lunar' && (
              <input type="hidden" {...register('start_date', {required: true})} />
            )}

            {startDate && inputMethod === 'solar' && (
              <p className="text-sm text-muted-foreground">Lunar Date: {lunarDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Event Types</Label>
            <div className="flex flex-col space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" value="lunar_birthday" {...register('event_keys')} />
                <span>Lunar Birthday</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" value="solar_birthday" {...register('event_keys')} />
                <span>Solar Birthday</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" value="integer_days" {...register('event_keys')} />
                <span>Integer Days (e.g. 10000 days)</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary Template (Optional)</Label>
            <Input id="summary" {...register('summary')} placeholder="{name} {year} Lunar Birthday" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description Template (Optional)</Label>
            <Textarea id="description" {...register('description')} placeholder="Details..." />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save Event</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
