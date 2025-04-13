import { z } from 'zod';
import { ShiftType, createShiftWithDatesSchema } from '@shared/schema';

// DTO for creating a shift
export const CreateShiftDto = createShiftWithDatesSchema;

// DTO for updating a shift
export const UpdateShiftDto = createShiftWithDatesSchema;

// DTO for filtering shifts by price range
export const FilterShiftsByPriceDto = z.object({
  minPrice: z.number().min(0).default(0),
  maxPrice: z.number().min(0)
});

// DTO for filtering shifts by type
export const FilterShiftsByTypeDto = z.object({
  type: z.enum([
    ShiftType.Consultation,
    ShiftType.Telephone,
    ShiftType.Ambulance
  ])
});

// DTO for checking overlapping shifts
export const CheckOverlappingShiftsDto = z.object({
  date: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, "Date must be in dd-mm-yyyy format"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Start time must be in hh:mm format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "End time must be in hh:mm format"),
  type: z.enum([
    ShiftType.Consultation,
    ShiftType.Telephone,
    ShiftType.Ambulance
  ]),
  excludeShiftId: z.number().optional()
});

export type CreateShiftDtoType = z.infer<typeof CreateShiftDto>;
export type UpdateShiftDtoType = z.infer<typeof UpdateShiftDto>;
export type FilterShiftsByPriceDtoType = z.infer<typeof FilterShiftsByPriceDto>;
export type FilterShiftsByTypeDtoType = z.infer<typeof FilterShiftsByTypeDto>;
export type CheckOverlappingShiftsDtoType = z.infer<typeof CheckOverlappingShiftsDto>;
