import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ShiftService } from '../services/shift.service';
import { CreateShiftDto } from '../dto/create-shift.dto';
import { Shift } from '../entities/shift.entity';

@ApiTags('shifts')
@Controller('shifts')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shift' })
  @ApiResponse({ status: 201, description: 'The shift has been successfully created.', type: Shift })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createShiftDto: CreateShiftDto) {
    return this.shiftService.create(createShiftDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shifts' })
  @ApiResponse({ status: 200, description: 'Return all shifts.', type: [Shift] })
  findAll() {
    return this.shiftService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a shift by id' })
  @ApiParam({ name: 'id', description: 'Shift ID' })
  @ApiResponse({ status: 200, description: 'Return the shift.', type: Shift })
  @ApiResponse({ status: 404, description: 'Shift not found.' })
  findOne(@Param('id') id: string) {
    return this.shiftService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a shift' })
  @ApiParam({ name: 'id', description: 'Shift ID' })
  @ApiResponse({ status: 200, description: 'The shift has been successfully updated.', type: Shift })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Shift not found.' })
  update(@Param('id') id: string, @Body() updateShiftDto: CreateShiftDto) {
    return this.shiftService.update(id, updateShiftDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shift' })
  @ApiParam({ name: 'id', description: 'Shift ID' })
  @ApiResponse({ status: 200, description: 'The shift has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Shift not found.' })
  remove(@Param('id') id: string) {
    return this.shiftService.remove(id);
  }

  @Get('price-range')
  @ApiOperation({ summary: 'Get min and max prices' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return min and max prices.',
    schema: {
      type: 'object',
      properties: {
        min: { type: 'number', example: 0 },
        max: { type: 'number', example: 1000 }
      }
    }
  })
  getPriceRange() {
    return this.shiftService.getPriceRange();
  }
} 