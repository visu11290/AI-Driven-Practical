import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Shift } from './shift.entity';
import { ShiftType } from '../enums/shift-type.enum';

@Entity('shift_dates')
export class ShiftDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: ShiftType,
    default: ShiftType.CONSULTATION
  })
  type: ShiftType;

  @ManyToOne(() => Shift, shift => shift.dates, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shiftId' })
  shift: Shift;

  @Column()
  shiftId: string;
} 