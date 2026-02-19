import { Module } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Maintenance} from "./entities/maintenance.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Maintenance])],
  controllers: [MaintenanceController],
  providers: [MaintenanceService],
})
export class MaintenanceModule {}
