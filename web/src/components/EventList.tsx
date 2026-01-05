import {EventConfig} from '@/types';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Trash2, Edit} from 'lucide-react';

interface EventListProps {
  events: EventConfig[];
  onEdit: (event: EventConfig) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function EventList({events, onEdit, onDelete, onAdd}: EventListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Events</CardTitle>
        <Button onClick={onAdd}>Add Event</Button>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No events added yet.</p>
        ) : (
          <div className="space-y-2">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 border rounded-md bg-slate-50">
                <div>
                  <h4 className="font-medium">{event.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {event.start_date} - {event.event_keys.join(', ')}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(event)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(event.id)} className="text-red-500 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
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
