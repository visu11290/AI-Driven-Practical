import { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, X } from 'lucide-react';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface DateCardProps {
  index: number;
  form: UseFormReturn<any>;
  onRemove: (index: number) => void;
}

const DateCard: FC<DateCardProps> = ({ index, form, onRemove }) => {
  const handleRemove = () => {
    onRemove(index);
  };

  return (
    <Card className="mb-4 bg-white border animate-in fade-in">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-primary mr-2" />
            <span className="font-medium">
              {form.getValues(`dates.${index}.date`)}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRemove} 
            className="h-8 w-8 text-gray-500 hover:text-red-500"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove Date</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`dates.${index}.startTime`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time<span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    type="time" 
                    placeholder="Start Time" 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name={`dates.${index}.endTime`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time<span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    type="time" 
                    placeholder="End Time" 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DateCard;
