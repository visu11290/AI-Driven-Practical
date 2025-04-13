import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShifts, setCurrentShift } from '@/store/shiftsSlice';
import { RootState } from '@/store/store';
import MaterialUIShiftCard from '@/components/MaterialUIShiftCard';
import BootstrapStyleFilters from '@/components/BootstrapStyleFilters';
import ShiftFormDrawer from '@/components/ShiftFormDrawer';
import { Plus, Loader2, LayoutGrid, List, Calendar as CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

// Material UI / Bootstrap inspired design
const MaterialUIShiftManagement = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { filteredShifts, loading, error } = useSelector((state: RootState) => state.shifts);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid');
  const isMobile = useIsMobile();

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
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header - Material UI Inspired */}
      <header className="bg-primary shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CalendarIcon className="h-6 w-6 text-white mr-2" />
              <h1 className="text-xl font-medium text-white">Shift Management System</h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center">
                <span className="font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Secondary Navigation - Material UI Tabs */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex border-b border-gray-200">
            <button 
              className={`py-4 px-6 text-sm font-medium flex items-center border-b-2 ${
                viewMode === 'grid' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Grid View
            </button>
            <button 
              className={`py-4 px-6 text-sm font-medium flex items-center border-b-2 ${
                viewMode === 'list' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List View
            </button>
            <button 
              className={`py-4 px-6 text-sm font-medium flex items-center border-b-2 ${
                viewMode === 'calendar' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setViewMode('calendar')}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendar View
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar - Filters */}
          <aside className="w-full md:w-80">
            <div className="sticky top-6">
              <BootstrapStyleFilters className="w-full mb-4" />
              
              {/* Quick Actions Card */}
              <div className="bg-white shadow-sm rounded-lg p-4 mb-4">
                <h3 className="text-lg font-medium mb-3">Quick Actions</h3>
                <Button 
                  className="w-full justify-center"
                  onClick={handleAddShift}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Shift
                </Button>
              </div>
              
              {/* Stats Card */}
              <div className="bg-white shadow-sm rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">Overview</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-md">
                    <div className="text-xs text-blue-500 font-medium">Total Shifts</div>
                    <div className="text-2xl font-bold text-blue-700">{filteredShifts.length}</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-md">
                    <div className="text-xs text-green-500 font-medium">Upcoming</div>
                    <div className="text-2xl font-bold text-green-700">{filteredShifts.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
          
          {/* Main content area */}
          <div className="flex-1">
            {/* Page Header */}
            <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
              <div>
                <h1 className="text-2xl font-medium text-gray-900">All Shifts</h1>
                <p className="text-gray-500 mt-1">
                  {filteredShifts.length} shift{filteredShifts.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="flex items-center">
                {!isMobile && (
                  <Button 
                    className="gradient-btn"
                    onClick={handleAddShift}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Shift
                  </Button>
                )}
              </div>
            </div>

            {/* Shifts Display */}
            {loading ? (
              <div className="flex justify-center items-center py-12 bg-white rounded-lg shadow-sm">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-gray-500">Loading shifts...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            ) : filteredShifts.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-sm">
                <div className="bg-gray-100 w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4">
                  <CalendarIcon className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No shifts found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  There are no shifts matching your current filters. Try adjusting your filter settings or create a new shift.
                </p>
                <Button onClick={handleAddShift} className="px-6">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Shift
                </Button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredShifts.map((shift) => (
                  <MaterialUIShiftCard
                    key={shift.id}
                    shift={shift}
                    onOpenDrawer={() => setDrawerOpen(true)}
                  />
                ))}
              </div>
            ) : viewMode === 'list' ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200 font-medium text-gray-500 text-sm">
                  <div className="col-span-5">Title & Type</div>
                  <div className="col-span-3">Dates</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                {filteredShifts.map((shift) => (
                  <div key={shift.id} className="grid grid-cols-12 p-4 border-b border-gray-100 hover:bg-gray-50 items-center">
                    <div className="col-span-5">
                      <div className="font-medium text-gray-900">{shift.title}</div>
                      <div className="text-sm text-gray-500">{shift.type}</div>
                    </div>
                    <div className="col-span-3 text-sm text-gray-600">
                      {shift.dates.length} date{shift.dates.length !== 1 ? 's' : ''}
                      <div className="text-xs text-gray-500">
                        Next: {shift.dates[0]?.date}
                      </div>
                    </div>
                    <div className="col-span-2 font-medium text-primary">
                      ${shift.price}
                    </div>
                    <div className="col-span-2 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          dispatch(setCurrentShift(shift));
                          setDrawerOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <h3 className="text-lg font-medium mb-4">Calendar View</h3>
                <p className="text-gray-500">
                  Calendar view is not implemented in this demo.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile FAB for adding shift */}
      {isMobile && (
        <div className="fixed bottom-6 right-6">
          <Button 
            size="lg" 
            className="rounded-full h-14 w-14 shadow-lg"
            onClick={handleAddShift}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Shift Form Drawer */}
      <ShiftFormDrawer 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen} 
      />

      {/* CSS for gradient button is added in global styles */}
    </div>
  );
};

export default MaterialUIShiftManagement;