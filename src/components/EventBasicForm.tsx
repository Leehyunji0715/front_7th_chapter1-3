import { FormControl, FormLabel, MenuItem, Select, Stack, TextField, Tooltip } from '@mui/material';
import { ChangeEvent } from 'react';

import { getTimeErrorMessage } from '../utils/timeValidation';

type Props = {
  title: string;
  setTitle: (_value: string) => void;
  date: string;
  setDate: (_value: string) => void;
  startTime: string;
  setStartTime: (_e: ChangeEvent<HTMLInputElement>) => void;
  startTimeError: string | null;
  endTime: string;
  setEndTime: (_e: ChangeEvent<HTMLInputElement>) => void;
  endTimeError: string | null;
  description: string;
  setDescription: (_value: string) => void;
  location: string;
  setLocation: (_value: string) => void;
  category: string;
  setCategory: (_value: string) => void;
};

const categories = ['업무', '개인', '가족', '기타'];

export function EventBasicForm({
  title,
  setTitle,
  date,
  setDate,
  startTime,
  setStartTime,
  startTimeError,
  endTime,
  setEndTime,
  endTimeError,
  description,
  setDescription,
  location,
  setLocation,
  category,
  setCategory,
}: Props) {
  return (
    <>
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
              onChange={setStartTime}
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
              onChange={setEndTime}
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
    </>
  );
}
