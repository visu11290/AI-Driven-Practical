import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftController } from './controllers/shift.controller';
import { ShiftService } from './services/shift.service';
import { Shift } from './entities/shift.entity';
import { ShiftDate } from './entities/shift-date.entity';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => databaseConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Shift, ShiftDate]),
  ],
  controllers: [ShiftController],
  providers: [ShiftService],
})
export class AppModule {} 