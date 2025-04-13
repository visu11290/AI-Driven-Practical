import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ValidateNested, MaxLength, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateShiftDateDto } from './create-shift-date.dto';

export class CreateShiftDto {
  @ApiProperty({
    description: 'Title of the shift',
    maxLength: 100,
    example: 'Morning Consultation Shift'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: 'Description of the shift',
    maxLength: 500,
    required: false,
    example: 'Morning shift for general consultations'
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'Array of shift dates',
    type: [CreateShiftDateDto],
    minItems: 1,
    maxItems: 10
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateShiftDateDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  dates: CreateShiftDateDto[];
} 