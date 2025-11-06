import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { Event } from '../types.ts';
import { CalendarCell } from './CalendarCell.tsx';
// import { CalendarEventItem } from './CalendarEventItem.tsx';
import {
  formatDate,
  formatMonth,
  formatWeek,
  getEventsForDay,
  getWeekDates,
  getWeeksAtMonth,
} from '../utils/dateUtils.ts';

type Props = {
  viewType: 'week' | 'month';
  currentDate: Date;
  holidays: { [key: string]: string };
  events: Event[];
  notifiedEventIds: string[];
  setDate: (_dateString: string) => void;
  saveEvent: (_event: Event) => Promise<void>;
  deleteEvent: (_eventId: string) => Promise<void>;
};

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

export function CalendarTable({
  viewType,
  events,
  notifiedEventIds,
  currentDate,
  holidays,
  setDate,
  saveEvent,
  deleteEvent,
}: Props) {
  const weeks: (number | null)[][] =
    viewType === 'month'
      ? getWeeksAtMonth(currentDate)
      : [getWeekDates(currentDate).map((date) => date.getDate())];
  const [draggedEvent, setDraggedEvent] = useState<Event | null>(null);

  return (
    <Stack data-testid={`${viewType}-view`} spacing={4} sx={{ width: '100%' }}>
      <Typography variant="h5">
        {viewType === 'month' ? formatMonth(currentDate) : formatWeek(currentDate)}
      </Typography>
      <TableContainer>
        <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
          <TableHead>
            <TableRow>
              {weekDays.map((day) => (
                <TableCell key={day} sx={{ width: '14.28%', padding: 1, textAlign: 'center' }}>
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {weeks.map((week, weekIndex) => (
              <TableRow key={weekIndex}>
                {week.map((day, dayIndex) => {
                  const dateString = day ? formatDate(currentDate, day) : '';
                  const holiday = holidays[dateString];

                  return (
                    <CalendarCell
                      key={dayIndex}
                      day={day}
                      holiday={holiday}
                      dateString={dateString}
                      events={events}
                      notifiedEventIds={notifiedEventIds}
                      setDate={setDate}
                      setDraggedEvent={setDraggedEvent}
                      onDrop={async (e) => {
                        if (!day) return;
                        const involvedEvents = getEventsForDay(events, day);
                        if (involvedEvents.some((iEvent) => iEvent.id === draggedEvent?.id)) return;

                        const deletedEventId = e.dataTransfer.getData('text/plain');
                        await deleteEvent(deletedEventId);
                        if (draggedEvent) {
                          const id = crypto.randomUUID();
                          const newEvent: Event = {
                            ...draggedEvent,
                            id,
                            repeat: { type: 'none', interval: 0 },
                            date: dateString,
                          };
                          await saveEvent(newEvent);
                        }
                      }}
                    />
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
