import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from '../entities/car.entity';

@Injectable()
export class CarsSeeder {
    constructor(
        @InjectRepository(Car) private readonly carRepo: Repository<Car>
    ) {}

    async seed(userId: number = 1) {
        const cars = [
            {
                brand: 'Audi',
                model: 'A6',
                vin_code: 'WAUZZZ4GZHN0001',
                license_plate: 'KA1234BK',
                year: 2018,
                color: 'Grey',
                fuel_type: 'Diesel',
                engine_capacity: 2.0,
                transmission: 'S-tronic',
                current_mileage: 125000,
                user_id: userId,
                features: { quattro: true, matrix_led: true }
            },
            {
                brand: 'Volkswagen',
                model: 'Golf GTI',
                vin_code: 'WVWZZZAUZJW0002',
                license_plate: 'BC5566HT',
                year: 2020,
                color: 'Red',
                fuel_type: 'Petrol',
                engine_capacity: 2.0,
                transmission: 'DSG',
                current_mileage: 45000,
                user_id: userId,
                features: { stage1: true, sport_exhaust: true }
            }
        ];

        for (const carData of cars) {
            const exists = await this.carRepo.findOne({ where: { vin_code: carData.vin_code } });
            if (!exists) {
                await this.carRepo.save(this.carRepo.create(carData));
            }
        }
        return { message: 'Cars seeded' };
    }
}