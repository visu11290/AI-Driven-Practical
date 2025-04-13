import { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Clock, Tag, FileText } from 'lucide-react';
import { ShiftWithDates } from '@shared/schema';
import { useDispatch } from 'react-redux';
import { setCurrentShift, deleteShift } from '@/store/shiftsSlice';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

interface ShiftCardProps {
  shift: ShiftWithDates;
  onOpenDrawer: () => void;
}

const ShiftCard: FC<ShiftCardProps> = ({ shift, onOpenDrawer }) => {
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
        title: 'Success',
        description: 'Shift deleted successfully',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete shift',
        variant: 'destructive',
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-medium text-gray-900">{shift.title}</h3>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-gray-500 hover:text-primary"
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-gray-500 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the shift "{shift.title}". This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        {shift.description && (
          <p className="text-gray-500 text-sm mb-3">{shift.description}</p>
        )}
        
        <div className="flex items-center mb-3">
          <Clock className="h-4 w-4 text-primary mr-2" />
          {shift.dates.length > 0 && (
            <span className="text-sm font-medium">
              {shift.dates[0].startTime} - {shift.dates[0].endTime}
            </span>
          )}
        </div>
        
        <div className="flex items-center mb-3">
          <Tag className="h-4 w-4 text-primary mr-2" />
          <span className="text-sm font-medium">{formatCurrency(shift.price)}</span>
        </div>
        
        <div className="flex items-center mb-4">
          <FileText className="h-4 w-4 text-primary mr-2" />
          <span className="text-sm font-medium">{shift.type}</span>
        </div>
        
        <div className="border-t border-gray-200 pt-3">
          <p className="text-sm text-gray-500 mb-2">Scheduled Dates:</p>
          <div className="flex flex-wrap gap-2">
            {shift.dates.map((date) => (
              <span 
                key={date.id}
                className="inline-flex items-center px-3 py-1 bg-gray-100 text-sm rounded-full transition-transform hover:scale-105"
              >
                {date.date}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShiftCard;
