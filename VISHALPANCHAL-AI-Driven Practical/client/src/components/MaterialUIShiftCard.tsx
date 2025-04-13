import { FC } from 'react';
import { ShiftWithDates } from '@shared/schema';
import { useDispatch } from 'react-redux';
import { setCurrentShift, deleteShift } from '@/store/shiftsSlice';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Calendar, Clock, DollarSign, Edit, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';

interface ShiftCardProps {
  shift: ShiftWithDates;
  onOpenDrawer: () => void;
}

const MaterialUIShiftCard: FC<ShiftCardProps> = ({ shift, onOpenDrawer }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleEdit = () => {
    dispatch(setCurrentShift(shift));
    onOpenDrawer();
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteShift(shift.id) as any);
      toast({
        title: "Success",
        description: "Shift deleted successfully",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "An error occurred while deleting the shift",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Get badge variant based on shift type
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'Consultation':
        return 'default';
      case 'Telephone':
        return 'secondary';
      case 'Ambulance':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="overflow-hidden rounded-lg transition-all hover:shadow-md bg-white border-0 shadow">
      {/* Color bar at top based on shift type */}
      <div className={`h-2 ${
        shift.type === 'Consultation' ? 'bg-blue-500' : 
        shift.type === 'Telephone' ? 'bg-violet-500' : 
        'bg-red-500'
      }`} />
      
      <div className="flex justify-between items-start p-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 line-clamp-1">{shift.title}</h3>
          <Badge variant={getBadgeVariant(shift.type) as any} className="mt-1">
            {shift.type}
          </Badge>
        </div>
        <div className="flex items-center text-lg font-semibold text-primary">
          <DollarSign className="h-4 w-4" />
          {formatCurrency(shift.price).replace('$', '')}
        </div>
      </div>
      
      <CardContent className="p-4 pt-0">
        {shift.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{shift.description}</p>
        )}
        
        <div className="space-y-2">
          {shift.dates.slice(0, 3).map((date, index) => (
            <div key={index} className="flex gap-2 items-center text-sm border-l-2 border-primary pl-2">
              <div className="flex flex-col">
                <div className="flex items-center text-gray-700 gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>{date.date}</span>
                </div>
                <div className="flex items-center text-gray-500 gap-1.5 mt-0.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>{date.startTime} - {date.endTime}</span>
                </div>
              </div>
            </div>
          ))}
          
          {shift.dates.length > 3 && (
            <div className="text-xs text-primary font-medium">
              +{shift.dates.length - 3} more dates
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="h-8 px-3"
          >
            <Edit className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="h-8 px-3"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  shift and all associated dates.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialUIShiftCard;