import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Car} from "./entities/car.entity";
import {CarPicture} from "./entities/car-picture.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Car, CarPicture])
  ],
  controllers: [CarController],
  providers: [CarService],
  exports: [CarService]
})
export class CarModule {}
