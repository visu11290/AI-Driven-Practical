import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsTimeString, IsNumber, IsEnum, Min } from 'class-validator';
import { ShiftType } from '../enums/shift-type.enum';

export class CreateShiftDateDto {
  @ApiProperty({
    description: 'Date of the shift in YYYY-MM-DD format',
    example: '2024-03-20'
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Start time in HH:mm format',
    example: '09:00'
  })
  @IsTimeString()
  startTime: string;

  @ApiProperty({
    description: 'End time in HH:mm format (must be greater than start time)',
    example: '17:00'
  })
  @IsTimeString()
  endTime: string;

  @ApiProperty({
    description: 'Price for the shift',
    minimum: 0,
    example: 100
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Type of the shift',
    enum: ShiftType,
    example: ShiftType.CONSULTATION
  })
  @IsEnum(ShiftType)
  type: ShiftType;
} 