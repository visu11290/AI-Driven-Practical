import { pgTable, text, serial, integer, boolean, timestamp, json, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Shift Types enum
export const ShiftType = {
  Consultation: "Consultation",
  Telephone: "Telephone",
  Ambulance: "Ambulance",
} as const;

// ShiftDate table to store dates for each shift
export const shiftDates = pgTable("shift_dates", {
  id: serial("id").primaryKey(),
  shiftId: integer("shift_id").notNull(),
  date: text("date").notNull(), // Format: dd-mm-yyyy
  startTime: text("start_time").notNull(), // Format: hh:mm
  endTime: text("end_time").notNull(), // Format: hh:mm
  createdAt: timestamp("created_at").defaultNow(),
});

// Shifts table
export const shifts = pgTable("shifts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // max 100 chars
  description: text("description"), // max 500 chars, optional
  price: real("price").notNull().default(0),
  type: text("type").notNull(), // one of: Consultation, Telephone, Ambulance
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Shift schema with validation
export const shiftSchema = createInsertSchema(shifts)
  .extend({
    title: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    price: z.number().min(0),
    type: z.enum([
      ShiftType.Consultation,
      ShiftType.Telephone,
      ShiftType.Ambulance
    ])
  });

// ShiftDate schema with validation
export const shiftDateSchema = createInsertSchema(shiftDates)
  .extend({
    date: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, "Date must be in dd-mm-yyyy format"),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Start time must be in hh:mm format"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "End time must be in hh:mm format")
  });

// Schema for creating a shift with dates
export const createShiftWithDatesSchema = z.object({
  shift: shiftSchema,
  dates: z.array(shiftDateSchema.omit({ shiftId: true })).min(1).max(10)
});

export type InsertShift = z.infer<typeof shiftSchema>;
export type Shift = typeof shifts.$inferSelect;
export type InsertShiftDate = z.infer<typeof shiftDateSchema>;
export type ShiftDate = typeof shiftDates.$inferSelect;
export type CreateShiftWithDates = z.infer<typeof createShiftWithDatesSchema>;

// Schema for shift with dates response
export const shiftWithDatesSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  type: z.enum([
    ShiftType.Consultation,
    ShiftType.Telephone,
    ShiftType.Ambulance
  ]),
  createdAt: z.date(),
  updatedAt: z.date(),
  dates: z.array(z.object({
    id: z.number(),
    shiftId: z.number(),
    date: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    createdAt: z.date()
  }))
});

export type ShiftWithDates = z.infer<typeof shiftWithDatesSchema>;
