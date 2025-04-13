import React, { useState } from 'react';
import {
  Drawer,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Stack,
  MenuItem,
  InputAdornment
} from '@mui/material';
import { Close as CloseIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Shift, ShiftDate, ShiftType } from '../types';

interface ShiftDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (shift: Partial<Shift>) => void;
  onDelete?: () => void;
  shift?: Shift;
}

const ShiftDrawer: React.FC<ShiftDrawerProps> = ({
  open,
  onClose,
  onSave,
  onDelete,
  shift
}) => {
  const [title, setTitle] = useState(shift?.title || '');
  const [description, setDescription] = useState(shift?.description || '');
  const [dates, setDates] = useState<Partial<ShiftDate>[]>(
    shift?.dates || [{ date: new Date(), startTime: '09:00', endTime: '17:00', price: 0, type: ShiftType.CONSULTATION }]
  );

  const handleAddDate = () => {
    setDates([...dates, { date: new Date(), startTime: '09:00', endTime: '17:00', price: 0, type: ShiftType.CONSULTATION }]);
  };

  const handleRemoveDate = (index: number) => {
    setDates(dates.filter((_, i) => i !== index));
  };

  const handleDateChange = (index: number, field: keyof ShiftDate, value: any) => {
    const newDates = [...dates];
    newDates[index] = { ...newDates[index], [field]: value };
    setDates(newDates);
  };

  const handleSubmit = () => {
    onSave({
      title,
      description,
      dates: dates as ShiftDate[]
    });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ '& .MuiDrawer-paper': { width: 400 } }}
    >
      <Box sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">
            {shift ? 'Edit Shift' : 'Create Shift'}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Stack spacing={3}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />

          <Typography variant="subtitle1">Dates</Typography>

          {dates.map((date, index) => (
            <Box key={index} sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Stack spacing={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2">Date {index + 1}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveDate(index)}
                    disabled={dates.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <DatePicker
                  label="Date"
                  value={date.date}
                  onChange={(newDate) => handleDateChange(index, 'date', newDate)}
                />

                <Box display="flex" gap={2}>
                  <TimePicker
                    label="Start Time"
                    value={date.startTime}
                    onChange={(newTime) => handleDateChange(index, 'startTime', newTime)}
                  />
                  <TimePicker
                    label="End Time"
                    value={date.endTime}
                    onChange={(newTime) => handleDateChange(index, 'endTime', newTime)}
                  />
                </Box>

                <TextField
                  label="Price"
                  type="number"
                  value={date.price}
                  onChange={(e) => handleDateChange(index, 'price', parseFloat(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                  }}
                />

                <TextField
                  select
                  label="Type"
                  value={date.type}
                  onChange={(e) => handleDateChange(index, 'type', e.target.value)}
                  fullWidth
                >
                  {Object.values(ShiftType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Box>
          ))}

          <Button variant="outlined" onClick={handleAddDate}>
            Add Date
          </Button>

          <Box display="flex" gap={2}>
            {onDelete && (
              <Button
                variant="outlined"
                color="error"
                onClick={onDelete}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleSubmit}
              fullWidth={!onDelete}
            >
              Save
            </Button>
          </Box>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default ShiftDrawer; 