import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Slider,
  Paper,
  Stack
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ShiftCard from './components/ShiftCard';
import ShiftDrawer from './components/ShiftDrawer';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  fetchShifts,
  createShift,
  updateShift,
  deleteShift,
  fetchPriceRange
} from './store/shiftSlice';
import { Shift } from './types';

function App() {
  const dispatch = useAppDispatch();
  const { shifts, priceRange, loading } = useAppSelector((state) => state.shifts);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | undefined>();
  const [priceFilter, setPriceFilter] = useState<[number, number]>([0, 1000]);

  useEffect(() => {
    dispatch(fetchShifts());
    dispatch(fetchPriceRange()).then((action) => {
      if (fetchPriceRange.fulfilled.match(action)) {
        setPriceFilter([action.payload.min, action.payload.max]);
      }
    });
  }, [dispatch]);

  const handleCreateShift = () => {
    setSelectedShift(undefined);
    setDrawerOpen(true);
  };

  const handleEditShift = (shift: Shift) => {
    setSelectedShift(shift);
    setDrawerOpen(true);
  };

  const handleSaveShift = async (shiftData: Partial<Shift>) => {
    if (selectedShift) {
      await dispatch(updateShift({ id: selectedShift.id!, shift: shiftData }));
    } else {
      await dispatch(createShift(shiftData));
    }
    setDrawerOpen(false);
    setSelectedShift(undefined);
  };

  const handleDeleteShift = async () => {
    if (selectedShift) {
      await dispatch(deleteShift(selectedShift.id!));
      setDrawerOpen(false);
      setSelectedShift(undefined);
    }
  };

  const filteredShifts = shifts.filter((shift) =>
    shift.dates.some((date) => date.price >= priceFilter[0] && date.price <= priceFilter[1])
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1">
              Shift Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateShift}
            >
              Add Shift
            </Button>
          </Box>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Filter
            </Typography>
            <Box sx={{ px: 2 }}>
              <Typography gutterBottom>Filter on price</Typography>
              <Slider
                value={priceFilter}
                onChange={(_, newValue) => setPriceFilter(newValue as [number, number])}
                valueLabelDisplay="auto"
                min={priceRange.min}
                max={priceRange.max}
                marks={[
                  { value: priceRange.min, label: `€${priceRange.min}` },
                  { value: priceRange.max, label: `€${priceRange.max}` }
                ]}
              />
            </Box>
          </Paper>

          <Typography variant="h6">Shifts</Typography>

          {loading ? (
            <Typography>Loading...</Typography>
          ) : filteredShifts.length === 0 ? (
            <Typography color="text.secondary">No shifts found</Typography>
          ) : (
            filteredShifts.map((shift) => (
              <ShiftCard
                key={shift.id}
                shift={shift}
                onEdit={handleEditShift}
              />
            ))
          )}
        </Stack>

        <ShiftDrawer
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setSelectedShift(undefined);
          }}
          onSave={handleSaveShift}
          onDelete={selectedShift ? handleDeleteShift : undefined}
          shift={selectedShift}
        />
      </Container>
    </LocalizationProvider>
  );
}

export default App; 