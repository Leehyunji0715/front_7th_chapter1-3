import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import { Event } from '../types';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onApply: () => void;
  overlappingEvents: Event[];
};

export function OverlappedEventDialog({ overlappingEvents, open, setOpen, onApply }: Props) {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>일정 겹침 경고</DialogTitle>
      <DialogContent>
        <DialogContentText>다음 일정과 겹칩니다:</DialogContentText>
        {overlappingEvents.map((event) => (
          <Typography key={event.id} sx={{ ml: 1, mb: 1 }}>
            {event.title} ({event.date} {event.startTime}-{event.endTime})
          </Typography>
        ))}
        <DialogContentText>계속 진행하시겠습니까?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>취소</Button>
        <Button color="error" onClick={onApply}>
          계속 진행
        </Button>
      </DialogActions>
    </Dialog>
  );
}
