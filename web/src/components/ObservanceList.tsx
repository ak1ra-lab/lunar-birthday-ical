import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ObservanceConfig } from '@/types';

interface ObservanceListProps {
  observances: ObservanceConfig[];
  onEdit: (observance: ObservanceConfig) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function ObservanceList({ observances, onEdit, onDelete, onAdd }: ObservanceListProps) {
  const { t } = useTranslation();

  const getWeekLabel = (week: number) => {
    if (week === 1) return '1st';
    if (week === 2) return '2nd';
    if (week === 3) return '3rd';
    if (week === 4) return '4th';
    return `${week}th`;
  };

  const getWeekdayLabel = (weekday: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[weekday];
  };

  const getMonthLabel = (month: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle>{t('configForm.observances')}</CardTitle>
        <Button size='sm' onClick={onAdd}>
          <Plus className='mr-2 h-4 w-4' /> {t('common.add')}
        </Button>
      </CardHeader>
      <CardContent>
        {!observances || observances.length === 0 ? (
          <p className='text-sm text-slate-500'>{t('eventList.noEvents')}</p>
        ) : (
          <div className='space-y-4'>
            {observances.map((obs) => (
              <div key={obs.id} className='flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm'>
                <div>
                  <h3 className='font-medium text-slate-900'>{obs.name}</h3>
                  <p className='text-sm text-slate-500'>
                    {getWeekLabel(obs.week)} {getWeekdayLabel(obs.weekday)} of {getMonthLabel(obs.month)}
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  <Button variant='ghost' size='icon' onClick={() => onEdit(obs)}>
                    <Edit2 className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='text-red-500 hover:text-red-600'
                    onClick={() => onDelete(obs.id)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
