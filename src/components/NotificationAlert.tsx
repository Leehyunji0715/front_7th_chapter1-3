import { Close } from '@mui/icons-material';
import { Alert, AlertTitle, IconButton } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

import { Notification } from '../types';

type Props = {
  notification: Notification;
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
};

export function NotificationAlert({ notification, setNotifications }: Props) {
  return (
    <Alert
      severity="info"
      sx={{ width: 'auto' }}
      action={
        <IconButton
          size="small"
          onClick={() =>
            setNotifications((prev) => prev.filter((item) => item.id !== notification.id))
          }
        >
          <Close />
        </IconButton>
      }
    >
      <AlertTitle>{notification.message}</AlertTitle>
    </Alert>
  );
}
