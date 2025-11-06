import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import Notifications from '@mui/icons-material/Notifications';
import Repeat from '@mui/icons-material/Repeat';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import { Event } from '../types';
import { getNotificationOptions } from '../utils/notificationUtils';
import { getRepeatTypeLabel } from '../utils/repeatUtils';

type Props = {
  event: Event;
  isNotifiedEvent: boolean;
  handleEditEvent(_event: Event): void;
  handleDeleteEvent(_event: Event): void;
};

const notificationOptions = getNotificationOptions();

export function ScheduleCard({
  event,
  isNotifiedEvent,
  handleEditEvent,
  handleDeleteEvent,
}: Props) {
  return (
    <Box key={event.id} sx={{ border: 1, borderRadius: 2, p: 3, width: '100%' }}>
      <Stack direction="row" justifyContent="space-between">
        <Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            {isNotifiedEvent && <Notifications color="error" />}
            {event.repeat.type !== 'none' && (
              <Tooltip
                title={`${event.repeat.interval}${getRepeatTypeLabel(event.repeat.type)}마다 반복${
                  event.repeat.endDate ? ` (종료: ${event.repeat.endDate})` : ''
                }`}
              >
                <Repeat fontSize="small" />
              </Tooltip>
            )}
            <Typography
              fontWeight={isNotifiedEvent ? 'bold' : 'normal'}
              color={isNotifiedEvent ? 'error' : 'inherit'}
            >
              {event.title}
            </Typography>
          </Stack>
          <Typography>{event.date}</Typography>
          <Typography>
            {event.startTime} - {event.endTime}
          </Typography>
          <Typography>{event.description}</Typography>
          <Typography>{event.location}</Typography>
          <Typography>카테고리: {event.category}</Typography>
          {event.repeat.type !== 'none' && (
            <Typography>
              반복: {event.repeat.interval}
              {event.repeat.type === 'daily' && '일'}
              {event.repeat.type === 'weekly' && '주'}
              {event.repeat.type === 'monthly' && '월'}
              {event.repeat.type === 'yearly' && '년'}
              마다
              {event.repeat.endDate && ` (종료: ${event.repeat.endDate})`}
            </Typography>
          )}
          <Typography>
            알림:{' '}
            {notificationOptions.find((option) => option.value === event.notificationTime)?.label}
          </Typography>
        </Stack>
        <Stack>
          <IconButton aria-label="Edit event" onClick={() => handleEditEvent(event)}>
            <Edit />
          </IconButton>
          <IconButton aria-label="Delete event" onClick={() => handleDeleteEvent(event)}>
            <Delete />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
}
