import { FC, useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createShiftWithDatesSchema, ShiftType } from '@shared/schema';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setCurrentShift, 
  createShift, 
  updateShift, 
  checkOverlappingShifts 
} from '@/store/shiftsSlice';
import { RootState } from '@/store/store';
import { useToast } from '@/hooks/use-toast';
import DateCard from './DateCard';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose
} from '@/components/ui/drawer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';

// Extend the schema with specific validations
const formSchema = createShiftWithDatesSchema
  .extend({
    selectedDate: z.date().optional(),
  })
  .refine(
    (data) => data.dates.length > 0,
    {
      message: "Please select at least one date",
      path: ["dates"],
    }
  )
  .superRefine((data, ctx) => {
    // Check that all dates have valid start and end times
    data.dates.forEach((date, index) => {
      const startTime = date.startTime;
      const endTime = date.endTime;
      
      if (startTime >= endTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End time must be greater than start time",
          path: [`dates.${index}.endTime`],
        });
      }
    });
  });

type FormValues = z.infer<typeof formSchema>;

interface ShiftFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShiftFormDrawer: FC<ShiftFormDrawerProps> = ({ open, onOpenChange }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { currentShift, loading } = useSelector((state: RootState) => state.shifts);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const isEditing = !!currentShift;

  // Initialize form with default values or current shift data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shift: {
        title: '',
        description: '',
        price: 0,
        type: ShiftType.Consultation
      },
      dates: [],
      selectedDate: undefined
    }
  });

  // Field array for managing dates
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "dates"
  });

  // Set form values when editing
  useEffect(() => {
    if (currentShift && open) {
      form.reset({
        shift: {
          title: currentShift.title,
          description: currentShift.description || '',
          price: currentShift.price,
          type: currentShift.type
        },
        dates: currentShift.dates.map(date => ({
          date: date.date,
          startTime: date.startTime,
          endTime: date.endTime
        }))
      });
    } else if (!open) {
      // Reset form when drawer closes
      form.reset({
        shift: {
          title: '',
          description: '',
          price: 0,
          type: ShiftType.Consultation
        },
        dates: []
      });
      setSelectedDate(undefined);
    }
  }, [currentShift, open, form]);

  // Handle date selection
  const handleDateSelect = async (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    
    // Format the date as dd-mm-yyyy
    const formattedDate = format(date, 'dd-MM-yyyy');
    
    // Check if date already exists
    const dateExists = form.getValues().dates.some(d => d.date === formattedDate);
    
    if (dateExists) {
      toast({
        title: "Date already added",
        description: "This date has already been added",
        variant: "destructive"
      });
      return;
    }
    
    // Add date to form
    append({
      date: formattedDate,
      startTime: "09:00",
      endTime: "17:00"
    });
  };

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    try {
      // Check for overlapping shifts for each date
      for (const date of data.dates) {
        const overlapCheckData = {
          date: date.date,
          startTime: date.startTime,
          endTime: date.endTime,
          type: data.shift.type,
          excludeShiftId: currentShift?.id
        };
        
        const overlapResponse = await dispatch(checkOverlappingShifts(overlapCheckData) as any);
        
        if (overlapResponse.payload.hasOverlap) {
          toast({
            title: "Validation Error",
            description: `Overlapping shift exists for date ${date.date} with type ${data.shift.type}`,
            variant: "destructive"
          });
          return;
        }
      }
      
      // Create or update shift
      if (isEditing && currentShift) {
        await dispatch(updateShift({ id: currentShift.id, data }) as any);
        toast({
          title: "Success",
          description: "Shift updated successfully",
          variant: "default"
        });
      } else {
        await dispatch(createShift(data) as any);
        toast({
          title: "Success",
          description: "Shift created successfully",
          variant: "default"
        });
      }
      
      // Close drawer and reset current shift
      onOpenChange(false);
      dispatch(setCurrentShift(null));
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "An error occurred while saving the shift",
        variant: "destructive"
      });
    }
  };

  // Close drawer handler
  const handleCloseDrawer = () => {
    onOpenChange(false);
    dispatch(setCurrentShift(null));
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] overflow-auto">
        <DrawerHeader>
          <DrawerTitle>{isEditing ? 'Edit Shift' : 'Add New Shift'}</DrawerTitle>
          <DrawerDescription>
            {isEditing 
              ? 'Edit shift details and dates below'
              : 'Create a new shift by filling out the form below'}
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                
                <FormField
                  control={form.control}
                  name="shift.title"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Title<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter shift title" 
                          maxLength={100}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="shift.description"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Description <span className="text-gray-500">(optional)</span></FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter description" 
                          maxLength={500}
                          className="resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <FormField
                    control={form.control}
                    name="shift.type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type<span className="text-red-500">*</span></FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select shift type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={ShiftType.Consultation}>Consultation</SelectItem>
                            <SelectItem value={ShiftType.Telephone}>Telephone</SelectItem>
                            <SelectItem value={ShiftType.Ambulance}>Ambulance</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="shift.price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price<span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                            <Input 
                              type="number" 
                              placeholder="0.00" 
                              min="0" 
                              step="0.01"
                              className="pl-8"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Shift Dates Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Shift Dates</h3>
                
                <FormField
                  control={form.control}
                  name="selectedDate"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Select Dates<span className="text-red-500">*</span></FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? (
                                format(selectedDate, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dates"
                  render={() => (
                    <FormItem>
                      <div className="mb-2">
                        <FormLabel>Selected Dates:</FormLabel>
                        {form.formState.errors.dates?.message && (
                          <p className="text-sm font-medium text-red-500 mt-1">
                            {form.formState.errors.dates.message}
                          </p>
                        )}
                      </div>
                      
                      {fields.length === 0 ? (
                        <p className="text-sm text-gray-500 mb-4">No dates selected yet</p>
                      ) : (
                        <div id="selected-dates-container">
                          {fields.map((field, index) => (
                            <DateCard
                              key={field.id}
                              index={index}
                              form={form}
                              onRemove={remove}
                            />
                          ))}
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </div>
              
              <DrawerFooter className="px-0">
                <div className="flex justify-end space-x-2">
                  <DrawerClose asChild>
                    <Button variant="outline" onClick={handleCloseDrawer}>
                      Cancel
                    </Button>
                  </DrawerClose>
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEditing ? 'Update Shift' : 'Save Shift'}
                  </Button>
                </div>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ShiftFormDrawer;
