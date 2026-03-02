import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { CarPicture } from './entities/car-picture.entity';
import { CarsSeeder } from './seeders/car.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Car, CarPicture])],
  controllers: [CarController],
  providers: [CarService, CarsSeeder],
  exports: [CarService],
})
export class CarModule {}
