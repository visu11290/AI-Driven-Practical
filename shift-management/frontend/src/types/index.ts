export enum ShiftType {
  CONSULTATION = 'Consultation',
  TELEPHONE = 'Telephone',
  AMBULANCE = 'Ambulance'
}

export interface ShiftDate {
  id?: string;
  date: Date | string;
  startTime: string;
  endTime: string;
  price: number;
  type: ShiftType;
  shiftId?: string;
}

export interface Shift {
  id?: string;
  title: string;
  description?: string;
  dates: ShiftDate[];
  createdAt?: Date;
  updatedAt?: Date;
} 