import { storage } from '../storage';
import { CreateShiftDtoType, UpdateShiftDtoType, CheckOverlappingShiftsDtoType } from '../dtos/shift.dto';
import { ShiftWithDates } from '@shared/schema';

export class ShiftsService {
  // Get all shifts
  async getAllShifts(): Promise<ShiftWithDates[]> {
    return await storage.getAllShifts();
  }
  
  // Get shift by ID
  async getShift(id: number): Promise<ShiftWithDates | undefined> {
    return await storage.getShift(id);
  }
  
  // Get shifts by price range
  async getShiftsByPriceRange(min: number, max: number): Promise<ShiftWithDates[]> {
    return await storage.getShiftsByPriceRange(min, max);
  }
  
  // Get shifts by type
  async getShiftsByType(type: string): Promise<ShiftWithDates[]> {
    return await storage.getShiftsByType(type);
  }
  
  // Create shift with dates
  async createShift(data: CreateShiftDtoType): Promise<ShiftWithDates> {
    // Check for overlapping shifts
    for (const date of data.dates) {
      const hasOverlap = await storage.hasOverlappingShifts(
        date.date,
        date.startTime,
        date.endTime,
        data.shift.type
      );
      
      if (hasOverlap) {
        throw new Error(`Overlapping shift exists for date ${date.date} with type ${data.shift.type}`);
      }
    }
    
    return await storage.createShift(data);
  }
  
  // Update shift
  async updateShift(id: number, data: UpdateShiftDtoType): Promise<ShiftWithDates> {
    // Check if shift exists
    const existingShift = await storage.getShift(id);
    if (!existingShift) {
      throw new Error(`Shift with ID ${id} not found`);
    }
    
    // Check for overlapping shifts (excluding the current shift)
    for (const date of data.dates) {
      const hasOverlap = await storage.hasOverlappingShifts(
        date.date,
        date.startTime,
        date.endTime,
        data.shift.type,
        id
      );
      
      if (hasOverlap) {
        throw new Error(`Overlapping shift exists for date ${date.date} with type ${data.shift.type}`);
      }
    }
    
    return await storage.updateShift(id, data);
  }
  
  // Delete shift
  async deleteShift(id: number): Promise<boolean> {
    // Check if shift exists
    const existingShift = await storage.getShift(id);
    if (!existingShift) {
      throw new Error(`Shift with ID ${id} not found`);
    }
    
    return await storage.deleteShift(id);
  }
  
  // Check if a shift would overlap with existing shifts
  async checkOverlappingShifts(data: CheckOverlappingShiftsDtoType): Promise<{ hasOverlap: boolean }> {
    const hasOverlap = await storage.hasOverlappingShifts(
      data.date,
      data.startTime,
      data.endTime,
      data.type,
      data.excludeShiftId
    );
    
    return { hasOverlap };
  }
}

// Export a singleton instance
export const shiftsService = new ShiftsService();
