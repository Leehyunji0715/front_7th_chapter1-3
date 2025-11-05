import Notifications from '@mui/icons-material/Notifications';
import Repeat from '@mui/icons-material/Repeat';
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { Event } from '../types.ts';
import {
  formatDate,
  formatMonth,
  formatWeek,
  getEventsForDay,
  getWeekDates,
  getWeeksAtMonth,
} from '../utils/dateUtils.ts';
import { getRepeatTypeLabel } from '../utils/repeatUtils.ts';

type Props = {
  viewType: 'week' | 'month';
  currentDate: Date;
  holidays: { [key: string]: string };
  events: Event[];
  notifiedEventIds: string[];
  setDate: (dateString: string) => void;
  saveEvent: (_event: Event) => Promise<void>;
  deleteEvent: (_eventId: string) => Promise<void>;
};

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
const eventBoxStyles = {
  notified: {
    backgroundColor: '#ffebee',
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  normal: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'normal',
    color: 'inherit',
  },
  common: {
    p: 0.5,
    my: 0.5,
    borderRadius: 1,
    minHeight: '18px',
    width: '100%',
    overflow: 'hidden',
    cursor: 'pointer',
  },
};

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
                    <TableCell
                      key={dayIndex}
                      onClick={() => {
                        setDate(dateString);
                      }}
                      onDragOver={(e) => e.preventDefault()}
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
                      sx={{
                        height: '120px',
                        verticalAlign: 'top',
                        width: '14.28%',
                        padding: 1,
                        border: '1px solid #e0e0e0',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      {day && (
                        <>
                          <Typography variant="body2" fontWeight="bold">
                            {day}
                          </Typography>
                          {holiday && (
                            <Typography variant="body2" color="error">
                              {holiday}
                            </Typography>
                          )}
                          {getEventsForDay(events, day).map((event) => {
                            const isNotified = notifiedEventIds.includes(event.id);
                            const isRepeating = event.repeat.type !== 'none';

                            return (
                              <Box
                                key={event.id}
                                draggable={true}
                                onDragStart={(e) => {
                                  e.dataTransfer.setData('text/plain', event.id);
                                  setDraggedEvent(event);
                                }}
                                sx={{
                                  ...eventBoxStyles.common,
                                  ...(isNotified ? eventBoxStyles.notified : eventBoxStyles.normal),
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    backgroundColor: isNotified ? '#ffcdd2' : '#e0e0e0',
                                    transform: 'scale(1.02)',
                                  },
                                }}
                              >
                                <Stack
                                  draggable={true}
                                  onDragStart={(e) => {
                                    // e.dataTransfer.setData('event', '');
                                    console.log('onDragStart', e.target, e.dataTransfer);
                                  }}
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                >
                                  {isNotified && <Notifications fontSize="small" />}
                                  {/* ! TEST CASE */}
                                  {isRepeating && (
                                    <Tooltip
                                      title={`${event.repeat.interval}${getRepeatTypeLabel(
                                        event.repeat.type
                                      )}마다 반복${
                                        event.repeat.endDate
                                          ? ` (종료: ${event.repeat.endDate})`
                                          : ''
                                      }`}
                                    >
                                      <Repeat fontSize="small" />
                                    </Tooltip>
                                  )}
                                  <Typography
                                    variant="caption"
                                    noWrap
                                    sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}
                                  >
                                    {event.title}
                                  </Typography>
                                </Stack>
                              </Box>
                            );
                          })}
                        </>
                      )}
                    </TableCell>
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
