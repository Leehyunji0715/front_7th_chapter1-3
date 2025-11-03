import { FormControl, FormLabel, Stack, TextField } from '@mui/material';

import { RepeatType } from '../types';
import { RepeatTypeSelect } from './select/RepeatTypeSelect';

type Props = {
  repeatType: RepeatType;
  setRepeatType: (_value: RepeatType) => void;
  repeatInterval: number;
  setRepeatInterval: (_value: number) => void;
  repeatEndDate: string;
  setRepeatEndDate: (_value: string) => void;
};

export function RepeatInputForm({
  repeatType,
  setRepeatType,
  repeatInterval,
  setRepeatInterval,
  repeatEndDate,
  setRepeatEndDate,
}: Props) {
  return (
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
  );
}
