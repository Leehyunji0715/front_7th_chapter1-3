import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';

import { useEventForm } from '../hooks/useEventForm';
import { Event, EventForm } from '../types';
import { getTimeErrorMessage } from '../utils/timeValidation';
import { RepeatTypeSelect } from './select/RepeatTypeSelect';
import { getNotificationOptions } from '../utils/notificationUtils';

type Props = {
  editingEvent: Event | null;
  addOrUpdateEvent: (_eventData: Event | EventForm, _isRepeating: boolean) => Promise<void>;
};

const notificationOptions = getNotificationOptions();
const categories = ['업무', '개인', '가족', '기타'];

export function EventFormComponent({ addOrUpdateEvent, editingEvent }: Props) {
  const {
    title,
    setTitle,
    date,
    setDate,
    startTime,
    handleStartTimeChange,
    endTime,
    handleEndTimeChange,
    description,
    setDescription,
    location,
    setLocation,
    category,
    setCategory,
    isRepeating,
    setIsRepeating,
    repeatType,
    setRepeatType,
    repeatInterval,
    setRepeatInterval,
    repeatEndDate,
    setRepeatEndDate,
    notificationTime,
    setNotificationTime,
    startTimeError,
    endTimeError,
    resetForm,
  } = useEventForm(editingEvent ? editingEvent : undefined);
  const { enqueueSnackbar } = useSnackbar();
  return (
    <>
      <Typography variant="h4">{editingEvent ? '일정 수정' : '일정 추가'}</Typography>

      <FormControl fullWidth>
        <FormLabel htmlFor="title">제목</FormLabel>
        <TextField
          id="title"
          size="small"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FormControl>

      <FormControl fullWidth>
        <FormLabel htmlFor="date">날짜</FormLabel>
        <TextField
          id="date"
          size="small"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </FormControl>

      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <FormLabel htmlFor="start-time">시작 시간</FormLabel>
          <Tooltip title={startTimeError || ''} open={!!startTimeError} placement="top">
            <TextField
              id="start-time"
              size="small"
              type="time"
              value={startTime}
              onChange={handleStartTimeChange}
              onBlur={() => getTimeErrorMessage(startTime, endTime)}
              error={!!startTimeError}
            />
          </Tooltip>
        </FormControl>
        <FormControl fullWidth>
          <FormLabel htmlFor="end-time">종료 시간</FormLabel>
          <Tooltip title={endTimeError || ''} open={!!endTimeError} placement="top">
            <TextField
              id="end-time"
              size="small"
              type="time"
              value={endTime}
              onChange={handleEndTimeChange}
              onBlur={() => getTimeErrorMessage(startTime, endTime)}
              error={!!endTimeError}
            />
          </Tooltip>
        </FormControl>
      </Stack>

      <FormControl fullWidth>
        <FormLabel htmlFor="description">설명</FormLabel>
        <TextField
          id="description"
          size="small"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormControl>

      <FormControl fullWidth>
        <FormLabel htmlFor="location">위치</FormLabel>
        <TextField
          id="location"
          size="small"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </FormControl>

      <FormControl fullWidth>
        <FormLabel id="category-label">카테고리</FormLabel>
        <Select
          id="category"
          size="small"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-labelledby="category-label"
          aria-label="카테고리"
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat} aria-label={`${cat}-option`}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {!editingEvent && (
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={isRepeating}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setIsRepeating(checked);
                  if (checked) {
                    setRepeatType('daily');
                  } else {
                    setRepeatType('none');
                  }
                }}
              />
            }
            label="반복 일정"
          />
        </FormControl>
      )}

      {/* ! TEST CASE */}
      {isRepeating && !editingEvent && (
        <Stack spacing={2}>
          <FormControl fullWidth>
            <FormLabel>반복 유형</FormLabel>
            <RepeatTypeSelect value={repeatType} onChange={setRepeatType} />
          </FormControl>
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <FormLabel htmlFor="repeat-interval">반복 간격</FormLabel>
              <TextField
                id="repeat-interval"
                size="small"
                type="number"
                value={repeatInterval}
                onChange={(e) => setRepeatInterval(Number(e.target.value))}
                slotProps={{ htmlInput: { min: 1 } }}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel htmlFor="repeat-end-date">반복 종료일</FormLabel>
              <TextField
                id="repeat-end-date"
                size="small"
                type="date"
                value={repeatEndDate}
                onChange={(e) => setRepeatEndDate(e.target.value)}
              />
            </FormControl>
          </Stack>
        </Stack>
      )}

      <FormControl fullWidth>
        <FormLabel htmlFor="notification">알림 설정</FormLabel>
        <Select
          id="notification"
          size="small"
          value={notificationTime}
          onChange={(e) => setNotificationTime(Number(e.target.value))}
        >
          {notificationOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        data-testid="event-submit-button"
        onClick={async () => {
          if (!title || !date || !startTime || !endTime) {
            enqueueSnackbar('필수 정보를 모두 입력해주세요.', { variant: 'error' });
            return;
          }
          if (startTimeError || endTimeError) {
            enqueueSnackbar('시간 설정을 확인해주세요.', { variant: 'error' });
            return;
          }

          const eventData: Event | EventForm = {
            id: editingEvent ? editingEvent.id : undefined,
            title,
            date,
            startTime,
            endTime,
            description,
            location,
            category,
            repeat: editingEvent
              ? editingEvent.repeat // Keep original repeat settings for recurring event detection
              : {
                  type: isRepeating ? repeatType : 'none',
                  interval: repeatInterval,
                  endDate: repeatEndDate || undefined,
                },
            notificationTime,
          };

          await addOrUpdateEvent(eventData, isRepeating);
          resetForm();
        }}
        variant="contained"
        color="primary"
      >
        {editingEvent ? '일정 수정' : '일정 추가'}
      </Button>
    </>
  );
}
