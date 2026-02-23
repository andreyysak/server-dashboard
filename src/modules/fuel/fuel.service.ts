import {ForbiddenException, Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Fuel} from "./entities/fuel.entity";
import {Car} from "../car/entities/car.entity";
import {Repository} from "typeorm";
import {CreateFuelDto} from "./dto/create-fuel.dto";
import {UpdateFuelDto} from "./dto/update-fuel.dto";

@Injectable()
export class FuelService {
  constructor(
      @InjectRepository(Fuel) private readonly fuelRepository: Repository<Fuel>,
      @InjectRepository(Car) private readonly carRepository: Repository<Car>
  ) {}

  async getAll(userId: number, carId?: number): Promise<Fuel[]> {
    const where: any = { user_id: userId };

    if (carId) {
      where.car_id = carId;
    }

    return await this.fuelRepository.find({
      where,
      order: { created_at: 'DESC' },
      relations: ['car']
    });
  }

  async getOne(userId: number, fuelId: number): Promise<Fuel> {
    const fuel = await this.fuelRepository.findOne({
      where: {
        user_id: userId,
        gas_id: fuelId
      }
    });

    if (!fuel) {
      throw new NotFoundException(`Fuel with ID ${fuelId} for user ${userId} not found`);
    }

    return fuel;
  }

  async createFuel(userId: number, createFuelDto: CreateFuelDto): Promise<Fuel> {
    const { car_id, station, price, liters } = createFuelDto;

    const car = await this.carRepository.findOne({
      where: { car_id, user_id: userId }
    });

    if (!car) {
      throw new ForbiddenException(`Access denied to car with ID ${car_id}`);
    }

    try {
      const newFuel = this.fuelRepository.create({
        user_id: userId,
        car_id,
        liters,
        price,
        station
      });

      return await this.fuelRepository.save(newFuel);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to create fuel: ${error.message}`);
    }
  }

  async deleteFull(userId: number, fuelId: number): Promise<void> {
    const result = await this.fuelRepository.delete({
      gas_id: fuelId,
      user_id: userId
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Fuel not found or access denied`);
    }
  }

  async updateFuel(userId: number, fuelId: number, updateFuelDto: UpdateFuelDto): Promise<Fuel> {
    const fuel = await this.fuelRepository.findOne({
      where: {
        gas_id: fuelId,
        user_id: userId
      }
    });

    if (!fuel) {
      throw new NotFoundException(`Fuel record with ID ${fuelId} not found`);
    }

    if (updateFuelDto.car_id) {
      const car = await this.carRepository.findOne({
        where: { car_id: updateFuelDto.car_id, user_id: userId }
      });

      if (!car) {
        throw new ForbiddenException(`Access denied to car with ID ${updateFuelDto.car_id}`);
      }
    }

    try {
      Object.assign(fuel, updateFuelDto);
      return await this.fuelRepository.save(fuel);
    } catch (e) {
      throw new InternalServerErrorException(`Failed to update fuel: ${e.message}`);
    }
  }
}