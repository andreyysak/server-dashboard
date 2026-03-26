import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Fuel } from './entities/fuel.entity';
import { Repository } from 'typeorm';
import { CreateFuelDto } from './dto/create-fuel.dto';
import { UpdateFuelDto } from './dto/update-fuel.dto';
import { CarService } from '../car/car.service';

@Injectable()
export class FuelService {
  constructor(
    @InjectRepository(Fuel) private readonly fuelRepository: Repository<Fuel>,
    private readonly carService: CarService,
  ) {}

  async getAll(userId: number, carId?: number): Promise<Fuel[]> {
    const where: any = { user_id: userId };

    if (carId) {
      await this.carService.validateCarOwnership(userId, carId);
      where.car_id = carId;
    }

    return await this.fuelRepository.find({
      where,
      order: { created_at: 'DESC' },
      relations: ['car'],
    });
  }

  async getOne(userId: number, fuelId: number): Promise<Fuel> {
    const fuel = await this.fuelRepository.findOne({
      where: {
        user_id: userId,
        gas_id: fuelId,
      },
    });

    if (!fuel) {
      throw new NotFoundException(
        `Fuel with ID ${fuelId} for user ${userId} not found`,
      );
    }

    return fuel;
  }

  async createFuel(
    userId: number,
    createFuelDto: CreateFuelDto,
  ): Promise<Fuel> {
    const { car_id, station, price, liters } = createFuelDto;

    await this.carService.validateCarOwnership(userId, car_id);

    try {
      const newFuel = this.fuelRepository.create({
        user_id: userId,
        car_id,
        liters,
        price,
        station,
      });

      return await this.fuelRepository.save(newFuel);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create fuel: ${error.message}`,
      );
    }
  }

  async deleteFull(userId: number, fuelId: number): Promise<void> {
    const result = await this.fuelRepository.delete({
      gas_id: fuelId,
      user_id: userId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Fuel not found or access denied`);
    }
  }

  async updateFuel(
    userId: number,
    fuelId: number,
    updateFuelDto: UpdateFuelDto,
  ): Promise<Fuel> {
    const fuel = await this.getOne(userId, fuelId);

    if (updateFuelDto.car_id) {
      await this.carService.validateCarOwnership(userId, updateFuelDto.car_id);
    }

    try {
      Object.assign(fuel, updateFuelDto);
      return await this.fuelRepository.save(fuel);
    } catch (e) {
      throw new InternalServerErrorException(
        `Failed to update fuel: ${e.message}`,
      );
    }
  }
}
