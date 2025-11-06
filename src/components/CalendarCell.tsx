import { TableCell, Typography } from '@mui/material';
import React from 'react';

type Props = {
  day: number | null;
  holiday: string;
  dateString: string;
  setDate: (_dateString: string) => void;
  onDrop: (_e: React.DragEvent<HTMLTableCellElement>) => Promise<void>;
  children: React.ReactNode;
};

export function CalendarCell({ day, holiday, dateString, setDate, onDrop, children }: Props) {
  return (
    <TableCell
      onClick={() => {
        setDate(dateString);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
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
        </>
      )}
      {children}
    </TableCell>
  );
}
