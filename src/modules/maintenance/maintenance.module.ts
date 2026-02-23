import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { Maintenance } from './entities/maintenance.entity';
import { Car } from '../car/entities/car.entity';
import {MaintenanceSeeder} from "./seeders/maintenance.seeder";

@Module({
  imports: [
    TypeOrmModule.forFeature([Maintenance, Car]),
  ],
  controllers: [MaintenanceController],
  providers: [MaintenanceService, MaintenanceSeeder],
})
export class MaintenanceModule {}