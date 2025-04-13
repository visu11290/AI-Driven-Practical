import { FC, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RefreshCw } from 'lucide-react';
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

const FilterSection: FC<FilterSectionProps> = ({ className }) => {
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
    <Card className={`shadow-sm ${className}`}>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <h2 className="text-lg font-medium mb-2 md:mb-0">Filters</h2>
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-wrap items-center gap-1">
              <Button 
                variant={activeType === null ? "default" : "ghost"}
                size="sm"
                onClick={() => handleTypeFilter(null)}
              >
                All Types
              </Button>
              <Button 
                variant={activeType === ShiftType.Consultation ? "default" : "ghost"}
                size="sm"
                onClick={() => handleTypeFilter(ShiftType.Consultation)}
              >
                Consultation
              </Button>
              <Button 
                variant={activeType === ShiftType.Telephone ? "default" : "ghost"}
                size="sm"
                onClick={() => handleTypeFilter(ShiftType.Telephone)}
              >
                Telephone
              </Button>
              <Button 
                variant={activeType === ShiftType.Ambulance ? "default" : "ghost"}
                size="sm"
                onClick={() => handleTypeFilter(ShiftType.Ambulance)}
              >
                Ambulance
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleResetFilters}
              className="text-primary"
              title="Reset Filters"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Price Range</span>
            <span className="text-sm font-medium">
              {formatCurrency(priceRange.min)} - {formatCurrency(priceRange.current)}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSection;
