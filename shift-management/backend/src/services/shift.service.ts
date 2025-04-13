import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shift } from '../entities/shift.entity';
import { ShiftDate } from '../entities/shift-date.entity';
import { CreateShiftDto } from '../dto/create-shift.dto';

@Injectable()
export class ShiftService {
  constructor(
    @InjectRepository(Shift)
    private shiftRepository: Repository<Shift>,
    @InjectRepository(ShiftDate)
    private shiftDateRepository: Repository<ShiftDate>
  ) {}

  async create(createShiftDto: CreateShiftDto): Promise<Shift> {
    // Validate time overlaps
    for (const dateDto of createShiftDto.dates) {
      const overlappingShift = await this.checkTimeOverlap(
        dateDto.date,
        dateDto.startTime,
        dateDto.endTime,
        dateDto.type
      );

      if (overlappingShift) {
        throw new BadRequestException(
          `Time overlap detected for date ${dateDto.date} and type ${dateDto.type}`
        );
      }
    }

    const shift = this.shiftRepository.create(createShiftDto);
    return this.shiftRepository.save(shift);
  }

  async findAll(): Promise<Shift[]> {
    return this.shiftRepository.find({
      relations: ['dates'],
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async findOne(id: string): Promise<Shift> {
    return this.shiftRepository.findOneOrFail({
      where: { id },
      relations: ['dates']
    });
  }

  async update(id: string, updateShiftDto: CreateShiftDto): Promise<Shift> {
    const shift = await this.findOne(id);

    // Validate time overlaps excluding current shift
    for (const dateDto of updateShiftDto.dates) {
      const overlappingShift = await this.checkTimeOverlap(
        dateDto.date,
        dateDto.startTime,
        dateDto.endTime,
        dateDto.type,
        id
      );

      if (overlappingShift) {
        throw new BadRequestException(
          `Time overlap detected for date ${dateDto.date} and type ${dateDto.type}`
        );
      }
    }

    // Remove old dates
    await this.shiftDateRepository.delete({ shift: { id } });

    // Update shift
    Object.assign(shift, updateShiftDto);
    return this.shiftRepository.save(shift);
  }

  async remove(id: string): Promise<void> {
    await this.shiftRepository.delete(id);
  }

  async getPriceRange(): Promise<{ min: number; max: number }> {
    const result = await this.shiftDateRepository
      .createQueryBuilder('shiftDate')
      .select('MIN(shiftDate.price)', 'min')
      .addSelect('MAX(shiftDate.price)', 'max')
      .getRawOne();

    return {
      min: parseFloat(result.min) || 0,
      max: parseFloat(result.max) || 0
    };
  }

  private async checkTimeOverlap(
    date: string,
    startTime: string,
    endTime: string,
    type: string,
    excludeShiftId?: string
  ): Promise<boolean> {
    const query = this.shiftDateRepository
      .createQueryBuilder('shiftDate')
      .where('shiftDate.date = :date', { date })
      .andWhere('shiftDate.type = :type', { type })
      .andWhere(
        '(shiftDate.startTime <= :endTime AND shiftDate.endTime >= :startTime)',
        { startTime, endTime }
      );

    if (excludeShiftId) {
      query.andWhere('shiftDate.shift.id != :excludeShiftId', { excludeShiftId });
    }

    const count = await query.getCount();
    return count > 0;
  }
} 