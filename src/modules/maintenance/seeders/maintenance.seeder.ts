import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Maintenance } from '../entities/maintenance.entity';
import { Car } from '../../car/entities/car.entity';

@Injectable()
export class MaintenanceSeeder {
    constructor(
        @InjectRepository(Maintenance) private readonly maintRepo: Repository<Maintenance>,
        @InjectRepository(Car) private readonly carRepo: Repository<Car>
    ) {}

    async seed(userId: number = 1) {
        const car = await this.carRepo.findOne({ where: { user_id: userId } });
        if (!car) return { message: 'No car found for maintenance seeding' };

        const tasks = [
            { desc: 'Заміна мастила та фільтрів', gap: 10000 },
            { desc: 'Діагностика ходової', gap: 20000 },
            { desc: 'Заміна гальмівних колодок', gap: 30000 },
            { desc: 'Перезаправка кондиціонера', gap: 15000 },
            { desc: 'Заміна свічок запалювання', gap: 45000 }
        ];

        const maintenanceData = tasks.map((task, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - (i * 4));

            return this.maintRepo.create({
                user_id: userId,
                car_id: car.car_id,
                date: date,
                description: task.desc,
                odometer: car.current_mileage - (i * 5000),
            });
        });

        await this.maintRepo.save(maintenanceData);
        return { message: 'Maintenance history seeded' };
    }
}