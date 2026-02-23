import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from '../entities/trip.entity';
import { Car } from '../../car/entities/car.entity';

@Injectable()
export class TripSeeder {
    constructor(
        @InjectRepository(Trip)
        private readonly tripRepo: Repository<Trip>,
        @InjectRepository(Car)
        private readonly carRepo: Repository<Car>,
    ) {}

    async seed(userId: number = 1) {
        const car = await this.carRepo.findOne({ where: { user_id: userId } });

        if (!car) {
            return { message: 'Спочатку запустіть CarsSeeder. Авто не знайдено.' };
        }

        const destinations = [
            'Київ - Ірпінь',
            'Офіс - Дім',
            'Львів - Буковель',
            'Київ - Житомир',
            'Дім - СТО',
            'Київ - Львів',
            'Центр - ТРЦ Ocean Plaza',
            'Київ - Одеса'
        ];

        const tripsData: Trip[] = [];

        for (let i = 0; i < 30; i++) {
            const tripDate = new Date();
            tripDate.setDate(tripDate.getDate() - i);

            const trip = this.tripRepo.create({
                user_id: userId,
                car_id: car.car_id,
                kilometres: parseFloat((Math.random() * (150 - 5) + 5).toFixed(1)),
                direction: destinations[Math.floor(Math.random() * destinations.length)],
                created_at: tripDate,
                updated_at: tripDate
            });

            tripsData.push(trip);
        }

        await this.tripRepo.save(tripsData);

        return { message: 'Trip history seeded successfully', count: tripsData.length };
    }
}