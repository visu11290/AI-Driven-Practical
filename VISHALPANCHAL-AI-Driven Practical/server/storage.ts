import { shifts, shiftDates, type Shift, type ShiftDate, type InsertShift, type InsertShiftDate, type ShiftWithDates, type CreateShiftWithDates, type User, users, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, inArray } from "drizzle-orm";

// Storage interface for CRUD operations
export interface IStorage {
  // User operations (keeping existing ones)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Shift operations
  getAllShifts(): Promise<ShiftWithDates[]>;
  getShift(id: number): Promise<ShiftWithDates | undefined>;
  getShiftsByPriceRange(min: number, max: number): Promise<ShiftWithDates[]>;
  getShiftsByType(type: string): Promise<ShiftWithDates[]>;
  createShift(data: CreateShiftWithDates): Promise<ShiftWithDates>;
  updateShift(id: number, data: CreateShiftWithDates): Promise<ShiftWithDates>;
  deleteShift(id: number): Promise<boolean>;
  
  // Validation
  hasOverlappingShifts(date: string, startTime: string, endTime: string, type: string, excludeShiftId?: number): Promise<boolean>;
}

// Database implementation of storage interface
export class DatabaseStorage implements IStorage {
  // User operations (keeping existing ones)
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Shift operations
  async getAllShifts(): Promise<ShiftWithDates[]> {
    const shiftsData = await db.select().from(shifts);
    return await this.attachDatesToShifts(shiftsData);
  }
  
  async getShift(id: number): Promise<ShiftWithDates | undefined> {
    const [shift] = await db.select().from(shifts).where(eq(shifts.id, id));
    if (!shift) return undefined;
    
    const datesForShift = await db.select().from(shiftDates).where(eq(shiftDates.shiftId, id));
    return {
      ...shift,
      dates: datesForShift
    };
  }
  
  async getShiftsByPriceRange(min: number, max: number): Promise<ShiftWithDates[]> {
    const shiftsInRange = await db.select()
      .from(shifts)
      .where(and(
        gte(shifts.price, min),
        lte(shifts.price, max)
      ));
    
    return await this.attachDatesToShifts(shiftsInRange);
  }
  
  async getShiftsByType(type: string): Promise<ShiftWithDates[]> {
    const shiftsOfType = await db.select()
      .from(shifts)
      .where(eq(shifts.type, type));
    
    return await this.attachDatesToShifts(shiftsOfType);
  }
  
  async createShift(data: CreateShiftWithDates): Promise<ShiftWithDates> {
    // Start a transaction
    return await db.transaction(async (tx) => {
      // Insert the shift
      const [newShift] = await tx.insert(shifts)
        .values(data.shift)
        .returning();
      
      // Insert the dates
      const shiftDatesWithShiftId = data.dates.map(date => ({
        ...date,
        shiftId: newShift.id
      }));
      
      const dates = await tx.insert(shiftDates)
        .values(shiftDatesWithShiftId)
        .returning();
      
      return {
        ...newShift,
        dates
      };
    });
  }
  
  async updateShift(id: number, data: CreateShiftWithDates): Promise<ShiftWithDates> {
    return await db.transaction(async (tx) => {
      // Update the shift
      const [updatedShift] = await tx.update(shifts)
        .set(data.shift)
        .where(eq(shifts.id, id))
        .returning();
      
      // Delete all dates for this shift
      await tx.delete(shiftDates)
        .where(eq(shiftDates.shiftId, id));
      
      // Insert the new dates
      const shiftDatesWithShiftId = data.dates.map(date => ({
        ...date,
        shiftId: id
      }));
      
      const dates = await tx.insert(shiftDates)
        .values(shiftDatesWithShiftId)
        .returning();
      
      return {
        ...updatedShift,
        dates
      };
    });
  }
  
  async deleteShift(id: number): Promise<boolean> {
    return await db.transaction(async (tx) => {
      // Delete all dates for this shift
      await tx.delete(shiftDates)
        .where(eq(shiftDates.shiftId, id));
      
      // Delete the shift
      const deleted = await tx.delete(shifts)
        .where(eq(shifts.id, id))
        .returning();
      
      return deleted.length > 0;
    });
  }
  
  async hasOverlappingShifts(date: string, startTime: string, endTime: string, type: string, excludeShiftId?: number): Promise<boolean> {
    // Get all shift dates for the given date and type
    const shiftsOnDate = await db.select({
      shiftId: shiftDates.shiftId,
      startTime: shiftDates.startTime,
      endTime: shiftDates.endTime,
      type: shifts.type
    })
    .from(shiftDates)
    .innerJoin(shifts, eq(shiftDates.shiftId, shifts.id))
    .where(and(
      eq(shiftDates.date, date),
      eq(shifts.type, type)
    ));
    
    // Filter out the shift being excluded (for updates)
    const filteredShifts = excludeShiftId ? 
      shiftsOnDate.filter(s => s.shiftId !== excludeShiftId) : 
      shiftsOnDate;
    
    // Check for time overlap
    return filteredShifts.some(shift => {
      return (
        (startTime >= shift.startTime && startTime < shift.endTime) || // Start time is within another shift
        (endTime > shift.startTime && endTime <= shift.endTime) || // End time is within another shift
        (startTime <= shift.startTime && endTime >= shift.endTime) // This shift completely contains another shift
      );
    });
  }
  
  // Helper method to attach dates to multiple shifts
  private async attachDatesToShifts(shiftsData: Shift[]): Promise<ShiftWithDates[]> {
    if (shiftsData.length === 0) return [];
    
    // Get all shift IDs
    const shiftIds = shiftsData.map(shift => shift.id);
    
    // Get all dates for these shifts
    const allDates = await db.select()
      .from(shiftDates)
      .where(inArray(shiftDates.shiftId, shiftIds));
    
    // Group dates by shift ID
    const datesByShiftId: Record<number, ShiftDate[]> = {};
    allDates.forEach(date => {
      if (!datesByShiftId[date.shiftId]) {
        datesByShiftId[date.shiftId] = [];
      }
      datesByShiftId[date.shiftId].push(date);
    });
    
    // Combine shifts with their dates
    return shiftsData.map(shift => ({
      ...shift,
      dates: datesByShiftId[shift.id] || []
    }));
  }
}

// Export database storage instance
export const storage = new DatabaseStorage();
