export enum ShiftType {
  CONSULTATION = 'Consultation',
  TELEPHONE = 'Telephone',
  AMBULANCE = 'Ambulance'
}

export interface ShiftDate {
  id?: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  type: ShiftType;
}

export interface Shift {
  id?: string;
  title: string;
  description?: string;
  dates: ShiftDate[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PriceRange {
  min: number;
  max: number;
} 