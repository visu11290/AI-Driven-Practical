import React from 'react';
import { Card, CardContent, Typography, IconButton, Box, Stack } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { Shift, ShiftDate } from '../types';

interface ShiftCardProps {
  shift: Shift;
  onEdit: (shift: Shift) => void;
}

const ShiftCard: React.FC<ShiftCardProps> = ({ shift, onEdit }) => {
  return (
    <Card sx={{ mb: 2, boxShadow: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h2">
            {shift.title}
          </Typography>
          <IconButton onClick={() => onEdit(shift)} size="small">
            <EditIcon />
          </IconButton>
        </Box>
        
        {shift.description && (
          <Typography color="textSecondary" gutterBottom>
            {shift.description}
          </Typography>
        )}

        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Dates
        </Typography>

        <Stack spacing={1}>
          {shift.dates.map((date: ShiftDate) => (
            <Box
              key={date.id}
              sx={{
                bgcolor: 'grey.800',
                color: 'white',
                p: 1.5,
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Typography>
                {format(new Date(date.date), 'dd MMM yyyy')}
              </Typography>
              <Typography>
                {date.startTime} - {date.endTime}
              </Typography>
              <Typography>
                {date.type}
              </Typography>
              <Typography>
                €{date.price}
              </Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ShiftCard; 