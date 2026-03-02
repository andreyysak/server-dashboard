import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  async create(userId: number, createCarDto: CreateCarDto): Promise<Car> {
    try {
      const car = this.carRepository.create({
        ...createCarDto,
        user_id: userId,
      });

      return await this.carRepository.save(car);
    } catch (error) {
      if (error.code === '23505') {
        throw new ForbiddenException('Car with this VIN code already exists');
      }
      throw new InternalServerErrorException(
        `Failed to create car: ${error.message}`,
      );
    }
  }

  async findAll(userId: number): Promise<Car[]> {
    return await this.carRepository.find({
      where: { user_id: userId },
      relations: ['pictures', 'trips'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(userId: number, carId: number): Promise<Car> {
    const car = await this.carRepository.findOne({
      where: { car_id: carId, user_id: userId },
      relations: ['pictures', 'trips'],
    });

    if (!car) {
      throw new NotFoundException(`Car with ID ${carId} not found`);
    }

    return car;
  }

  async update(
    userId: number,
    carId: number,
    updateCarDto: UpdateCarDto,
  ): Promise<Car> {
    const car = await this.findOne(userId, carId);

    try {
      Object.assign(car, updateCarDto);
      return await this.carRepository.save(car);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update car: ${error.message}`,
      );
    }
  }

  async remove(userId: number, carId: number): Promise<void> {
    const result = await this.carRepository.delete({
      car_id: carId,
      user_id: userId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Car with ID ${carId} not found or access denied`,
      );
    }
  }

  async updateMileage(
    userId: number,
    carId: number,
    additionalKm: number,
  ): Promise<Car> {
    const car = await this.findOne(userId, carId);
    car.current_mileage += additionalKm;
    return await this.carRepository.save(car);
  }
}
