import { Module } from '@nestjs/common';
import { FuelService } from './fuel.service';
import { FuelController } from './fuel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fuel } from './entities/fuel.entity';
import { FuelSeeder } from './seeders/fuel.seeder';
import { CarModule } from '../car/car.module';
import { Car } from '../car/entities/car.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fuel, Car]), CarModule],
  controllers: [FuelController],
  providers: [FuelService, FuelSeeder],
})
export class FuelModule {}
