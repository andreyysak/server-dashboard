import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Trip} from "./entities/trip.entity";
import {Car} from "../car/entities/car.entity";
import {TripSeeder} from "./seeders/trip.seeder";

@Module({
  imports: [TypeOrmModule.forFeature([Trip, Car])],
  controllers: [TripController],
  providers: [TripService, TripSeeder],
})
export class TripModule {}
