import { Module } from '@nestjs/common';
import { FuelService } from './fuel.service';
import { FuelController } from './fuel.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Car} from "../car/entities/car.entity";
import {Fuel} from "./entities/fuel.entity";
import {FuelSeeder} from "./seeders/fuel.seeder";

@Module({
  imports: [TypeOrmModule.forFeature([Fuel, Car])],
  controllers: [FuelController, FuelSeeder],
  providers: [FuelService],
})
export class FuelModule {}
