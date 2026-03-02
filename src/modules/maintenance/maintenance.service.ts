import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Maintenance } from './entities/maintenance.entity';
import { Repository } from 'typeorm';
import { Car } from '../car/entities/car.entity';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(Maintenance)
    private readonly maintenanceRepository: Repository<Maintenance>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  async create(userId: number, dto: CreateMaintenanceDto) {
    const car = await this.carRepository.findOne({
      where: { car_id: dto.car_id, user_id: userId },
    });

    if (!car) throw new ForbiddenException('Car not found or access denied');

    const maintenance = this.maintenanceRepository.create({
      ...dto,
      user_id: userId,
    });

    return await this.maintenanceRepository.save(maintenance);
  }

  async findAll(userId: number, carId?: number) {
    return await this.maintenanceRepository.find({
      where: { user_id: userId, ...(carId && { car_id: carId }) },
      order: { date: 'DESC' },
      relations: ['car'],
    });
  }

  async findOne(userId: number, id: number) {
    const maintenance = await this.maintenanceRepository.findOne({
      where: { maintenance_id: id, user_id: userId },
      relations: ['car'],
    });

    if (!maintenance)
      throw new NotFoundException('Maintenance record not found');
    return maintenance;
  }

  async update(userId: number, id: number, dto: UpdateMaintenanceDto) {
    const maintenance = await this.findOne(userId, id);
    Object.assign(maintenance, dto);
    return await this.maintenanceRepository.save(maintenance);
  }

  async remove(userId: number, id: number) {
    const result = await this.maintenanceRepository.delete({
      maintenance_id: id,
      user_id: userId,
    });

    if (result.affected === 0) throw new NotFoundException('Record not found');
    return { success: true };
  }
}
