import { FC, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RefreshCw, Filter } from 'lucide-react';
import { 
  useDispatch, 
  useSelector 
} from 'react-redux';
import { 
  filterShiftsByPrice, 
  filterShiftsByType, 
  clearTypeFilter, 
  setCurrentPrice,
  calculatePriceRange
} from '@/store/shiftsSlice';
import { RootState } from '@/store/store';
import { ShiftType } from '@shared/schema';

interface FilterSectionProps {
  className?: string;
}

const BootstrapStyleFilters: FC<FilterSectionProps> = ({ className }) => {
  const dispatch = useDispatch();
  const { priceRange, activeType, shifts } = useSelector((state: RootState) => state.shifts);

  // Calculate price range whenever shifts change
  useEffect(() => {
    if (shifts.length > 0) {
      dispatch(calculatePriceRange());
    }
  }, [shifts, dispatch]);

  const handlePriceChange = (value: number[]) => {
    const newPrice = value[0];
    dispatch(setCurrentPrice(newPrice));
    dispatch(filterShiftsByPrice({
      minPrice: priceRange.min,
      maxPrice: newPrice
    }) as any);
  };

  const handleTypeFilter = (type: string | null) => {
    if (type === null) {
      dispatch(clearTypeFilter());
    } else {
      dispatch(filterShiftsByType(type) as any);
    }
  };

  const handleResetFilters = () => {
    dispatch(clearTypeFilter());
    dispatch(setCurrentPrice(priceRange.max));
    dispatch(filterShiftsByPrice({
      minPrice: priceRange.min,
      maxPrice: priceRange.max
    }) as any);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <Card className={`shadow-sm border-0 ${className}`}>
      <CardContent className="p-0">
        {/* Header - Bootstrap style */}
        <div className="bg-primary text-white p-3 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-medium m-0">Filters</h2>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleResetFilters}
            className="bg-white text-primary hover:bg-slate-100"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
        
        {/* Filter content */}
        <div className="p-4">
          {/* Type filter - Bootstrap tab style */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shift Type
            </label>
            <div className="flex flex-wrap gap-1">
              <Button 
                variant={activeType === null ? "default" : "outline"}
                size="sm"
                className={`rounded-full px-4 ${activeType === null ? 'bg-primary text-white' : ''}`}
                onClick={() => handleTypeFilter(null)}
              >
                All Types
              </Button>
              <Button 
                variant={activeType === ShiftType.Consultation ? "default" : "outline"}
                size="sm"
                className={`rounded-full px-4 ${activeType === ShiftType.Consultation ? 'bg-blue-500 text-white' : ''}`}
                onClick={() => handleTypeFilter(ShiftType.Consultation)}
              >
                Consultation
              </Button>
              <Button 
                variant={activeType === ShiftType.Telephone ? "default" : "outline"}
                size="sm"
                className={`rounded-full px-4 ${activeType === ShiftType.Telephone ? 'bg-violet-500 text-white' : ''}`}
                onClick={() => handleTypeFilter(ShiftType.Telephone)}
              >
                Telephone
              </Button>
              <Button 
                variant={activeType === ShiftType.Ambulance ? "default" : "outline"}
                size="sm"
                className={`rounded-full px-4 ${activeType === ShiftType.Ambulance ? 'bg-red-500 text-white' : ''}`}
                onClick={() => handleTypeFilter(ShiftType.Ambulance)}
              >
                Ambulance
              </Button>
            </div>
          </div>
          
          {/* Price range slider */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="bg-gray-100 p-3 rounded-md">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-primary">
                  {formatCurrency(priceRange.min)}
                </span>
                <span className="text-sm font-medium text-primary">
                  {formatCurrency(priceRange.current)}
                </span>
              </div>
              <Slider
                defaultValue={[priceRange.max]}
                max={priceRange.max}
                min={priceRange.min}
                step={1}
                value={[priceRange.current]}
                onValueChange={handlePriceChange}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-2 text-center">
                Drag the slider to filter shifts by maximum price
              </div>
            </div>
          </div>
          
          {/* Active filters */}
          {activeType && (
            <div className="mt-4 bg-gray-50 p-3 rounded-md border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-2">Active Filters:</div>
              <div className="flex flex-wrap gap-2">
                <div className="bg-white text-sm px-3 py-1 rounded-full border border-gray-200 flex items-center">
                  <span className="mr-1">Type:</span>
                  <span className="font-medium">{activeType}</span>
                  <button 
                    className="ml-2 text-gray-500 hover:text-red-500"
                    onClick={() => handleTypeFilter(null)}
                  >
                    ×
                  </button>
                </div>
                <div className="bg-white text-sm px-3 py-1 rounded-full border border-gray-200 flex items-center">
                  <span className="mr-1">Max Price:</span>
                  <span className="font-medium">{formatCurrency(priceRange.current)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BootstrapStyleFilters;