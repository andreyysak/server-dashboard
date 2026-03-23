import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { Trip } from '../trip/entities/trip.entity';
import { Fuel } from '../fuel/entities/fuel.entity';
import { Maintenance } from '../maintenance/entities/maintenance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, Fuel, Maintenance])],
  controllers: [AnalysisController],
  providers: [AnalysisService],
  exports: [AnalysisService],
})
export class AnalysisModule {}
