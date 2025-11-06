import { TableCell, Typography } from '@mui/material';
import React from 'react';

import { CalendarEventItem } from './CalendarEventItem';
import { Event } from '../types';
import { getEventsForDay } from '../utils/dateUtils';

type Props = {
  day: number | null;
  holiday: string;
  dateString: string;
  events: Event[];
  notifiedEventIds: string[];
  setDate: (_dateString: string) => void;
  setDraggedEvent: (_event: Event) => void;
  onDrop: (_e: React.DragEvent<HTMLTableCellElement>) => Promise<void>;
};

export function CalendarCell({
  day,
  holiday,
  dateString,
  events,
  notifiedEventIds,
  setDate,
  setDraggedEvent,
  onDrop,
}: Props) {
  return (
    <TableCell
      onClick={() => {
        setDate(dateString);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      sx={{
        height: '120px',
        verticalAlign: 'top',
        width: '14.28%',
        padding: '8px', // 좌우 균등한 여백
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
          <div
            style={{
              overflowX: 'hidden',
            }}
          >
            {getEventsForDay(events, day).map((event) => {
              const isNotified = notifiedEventIds.includes(event.id);
              const isRepeating = event.repeat.type !== 'none';

              return (
                <CalendarEventItem
                  key={event.id}
                  isNotified={isNotified}
                  isRepeating={isRepeating}
                  event={event}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', event.id);
                    setDraggedEvent(event);
                  }}
                />
              );
            })}
          </div>
        </>
      )}
    </TableCell>
  );
}
