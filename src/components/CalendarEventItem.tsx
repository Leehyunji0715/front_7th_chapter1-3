import { Notifications, Repeat } from '@mui/icons-material';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import React from 'react';

import { Event } from '../types';
import { getRepeatTypeLabel } from '../utils/repeatUtils';

type Props = {
  isNotified: boolean;
  isRepeating: boolean;
  event: Event;
  onDragStart: (_e: React.DragEvent<HTMLDivElement>) => void;
};

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

export function CalendarEventItem({ isNotified, isRepeating, event, onDragStart }: Props) {
  return (
    <Box
      key={event.id}
      draggable={true}
      onDragStart={onDragStart}
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
      <Stack draggable={true} direction="row" spacing={1} alignItems="center">
        {isNotified && <Notifications fontSize="small" />}
        {/* ! TEST CASE */}
        {isRepeating && (
          <Tooltip
            title={`${event.repeat.interval}${getRepeatTypeLabel(event.repeat.type)}마다 반복${
              event.repeat.endDate ? ` (종료: ${event.repeat.endDate})` : ''
            }`}
          >
            <Repeat fontSize="small" />
          </Tooltip>
        )}
        <Typography variant="caption" noWrap sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
          {event.title}
        </Typography>
      </Stack>
    </Box>
  );
}
