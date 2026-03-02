import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fuel } from '../entities/fuel.entity';
import { Car } from '../../car/entities/car.entity';
import { FuelStation } from '../enums/fuel-station.enum';

@Injectable()
export class FuelSeeder {
  constructor(
    @InjectRepository(Fuel) private readonly fuelRepo: Repository<Fuel>,
    @InjectRepository(Car) private readonly carRepo: Repository<Car>,
  ) {}

  async seed(userId: number = 1) {
    const car = await this.carRepo.findOne({ where: { user_id: userId } });
    if (!car) return { message: 'No car found for fuel seeding' };

    const fuelEntries: Fuel[] = [];

    const stations = Object.values(FuelStation);

    for (let i = 0; i < 25; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i * 7);

      const fuelEntry = this.fuelRepo.create({
        user_id: userId,
        car_id: car.car_id,
        liters: parseFloat((Math.random() * (55 - 30) + 30).toFixed(2)),
        price: parseFloat((Math.random() * (54 - 50) + 50).toFixed(2)),
        station: stations[Math.floor(Math.random() * stations.length)],
        created_at: date,
      });

      fuelEntries.push(fuelEntry);
    }

    await this.fuelRepo.save(fuelEntries);
    return { message: 'Fuel history seeded' };
  }
}
