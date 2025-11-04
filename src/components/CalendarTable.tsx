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

import { useCalendarView } from '../hooks/useCalendarView.ts';
import { Event } from '../types.ts';
import { formatDate, formatWeek, getEventsForDay, getWeeksAtMonth } from '../utils/dateUtils.ts';
import { getRepeatTypeLabel } from '../utils/repeatUtils.ts';

type Props = {
  viewType: 'week' | 'month';
  events: Event[];
  notifiedEventIds: string[];
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
  },
};

export function CalendarTable({ viewType, events, notifiedEventIds }: Props) {
  const { currentDate, holidays } = useCalendarView();
  const todayDate = currentDate.getDate();
  const weeks =
    viewType === 'month'
      ? getWeeksAtMonth(currentDate)
      : getWeeksAtMonth(currentDate).filter((week) => week.includes(todayDate)); // month

  return (
    <Stack data-testid={`${viewType}-view`} spacing={4} sx={{ width: '100%' }}>
      <Typography variant="h5">{formatWeek(currentDate)}</Typography>
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
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => console.log(e.currentTarget)}
                      key={dayIndex}
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
                                draggable={true}
                                onDragStart={(e) => console.log(e.target)}
                                key={event.id}
                                sx={{
                                  ...eventBoxStyles.common,
                                  ...(isNotified ? eventBoxStyles.notified : eventBoxStyles.normal),
                                }}
                              >
                                <Stack direction="row" spacing={1} alignItems="center">
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
