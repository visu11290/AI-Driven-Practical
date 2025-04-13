import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShifts, setCurrentShift } from '@/store/shiftsSlice';
import { RootState } from '@/store/store';
import ShiftCard from '@/components/ShiftCard';
import FilterSection from '@/components/FilterSection';
import ShiftFormDrawer from '@/components/ShiftFormDrawer';
import { Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ShiftManagement = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { filteredShifts, loading, error } = useSelector((state: RootState) => state.shifts);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch shifts on component mount
  useEffect(() => {
    const loadShifts = async () => {
      try {
        await dispatch(fetchShifts() as any);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load shifts',
          variant: 'destructive',
        });
      }
    };
    
    loadShifts();
  }, [dispatch, toast]);

  // Handle adding a new shift
  const handleAddShift = () => {
    dispatch(setCurrentShift(null));
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-medium">Shift Management System</h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-primary/90">
              <span className="sr-only">Notifications</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-primary/90">
              <span className="sr-only">Settings</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </Button>
            <div className="ml-2 flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary-light text-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="ml-2 hidden md:inline">Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6 max-w-6xl">
        {/* Page Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-medium text-gray-900">Shift Management</h1>
            <p className="text-gray-500 mt-1">Manage your shifts and schedules</p>
          </div>
          <Button 
            className="mt-4 sm:mt-0"
            onClick={handleAddShift}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Shift
          </Button>
        </div>

        {/* Filters */}
        <FilterSection className="mb-6" />

        {/* Shifts Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p>Error: {error}</p>
          </div>
        ) : filteredShifts.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No shifts found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filters or create a new shift</p>
            <Button onClick={handleAddShift}>
              <Plus className="mr-2 h-4 w-4" />
              Add Shift
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShifts.map((shift) => (
              <ShiftCard
                key={shift.id}
                shift={shift}
                onOpenDrawer={() => setDrawerOpen(true)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Shift Form Drawer */}
      <ShiftFormDrawer 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen} 
      />
    </div>
  );
};

export default ShiftManagement;
