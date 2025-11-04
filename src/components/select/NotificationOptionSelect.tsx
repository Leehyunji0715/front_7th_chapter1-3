import { MenuItem, Select } from '@mui/material';

import { getNotificationOptions } from '../../utils/notificationUtils';

type Props = {
  value: number;
  setValue: (_value: number) => void;
};

const notificationOptions = getNotificationOptions();

export function NotificationOptionSelect({ value, setValue }: Props) {
  return (
    <Select
      id="notification"
      size="small"
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
    >
      {notificationOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
}
