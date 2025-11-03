import { MenuItem, Select } from '@mui/material';

import { RepeatType } from '../../types';

type Props = {
  value: RepeatType;
  onChange: (_value: RepeatType) => void;
};

export function RepeatTypeSelect({ value, onChange }: Props) {
  return (
    <Select
      size="small"
      value={value}
      aria-label="반복 유형"
      onChange={(e) => onChange(e.target.value as RepeatType)}
    >
      <MenuItem value="daily" aria-label="daily-option">
        매일
      </MenuItem>
      <MenuItem value="weekly" aria-label="weekly-option">
        매주
      </MenuItem>
      <MenuItem value="monthly" aria-label="monthly-option">
        매월
      </MenuItem>
      <MenuItem value="yearly" aria-label="yearly-option">
        매년
      </MenuItem>
    </Select>
  );
}
