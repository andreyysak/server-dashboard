import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { TripSeeder } from './seeders/trip.seeder';
import { CarModule } from '../car/car.module';
import { Car } from '../car/entities/car.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, Car]), CarModule],
  controllers: [TripController],
  providers: [TripService, TripSeeder],
})
export class TripModule {}
