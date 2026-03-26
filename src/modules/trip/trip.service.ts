import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { Repository } from 'typeorm';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { CarService } from '../car/car.service';
import { Car } from '../car/entities/car.entity';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip) private readonly tripRepository: Repository<Trip>,
    @InjectRepository(Car) private readonly carRepository: Repository<Car>,
    private readonly carService: CarService,
  ) {}

  async getAllTrips(userId: number, carId?: number): Promise<Trip[]> {
    const where: any = { user_id: userId };

    if (carId) {
      await this.carService.validateCarOwnership(userId, carId);
      where.car_id = carId;
    }

    return await this.tripRepository.find({
      where,
      order: { created_at: 'DESC' },
      relations: ['car'],
    });
  }

  async getTrip(userId: number, tripId: number): Promise<Trip> {
    const trip = await this.tripRepository.findOne({
      where: {
        user_id: userId,
        trip_id: tripId,
      },
      relations: ['car'],
    });

    if (!trip) {
      throw new NotFoundException(
        `Trip with ID ${tripId} for user ${userId} not found`,
      );
    }

    return trip;
  }

  async createTrip(
    userId: number,
    createTripDto: CreateTripDto,
  ): Promise<Trip> {
    const { kilometres, direction, car_id } = createTripDto;

    await this.carService.validateCarOwnership(userId, car_id);

    try {
      const newTrip = this.tripRepository.create({
        user_id: userId,
        car_id,
        kilometres,
        direction,
        distance: 0,
      });

      const savedTrip = await this.tripRepository.save(newTrip);
      await this.recalculateDistances(car_id, userId);

      return await this.getTrip(userId, savedTrip.trip_id);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create trip: ${error.message}`,
      );
    }
  }

  async deleteTrip(userId: number, tripId: number): Promise<void> {
    const trip = await this.getTrip(userId, tripId);
    const carId = trip.car_id;

    const result = await this.tripRepository.delete({
      trip_id: tripId,
      user_id: userId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Trip not found or access denied`);
    }

    await this.recalculateDistances(carId, userId);
  }

  async updateTrip(
    userId: number,
    tripId: number,
    updateTripDto: UpdateTripDto,
  ): Promise<Trip> {
    const trip = await this.getTrip(userId, tripId);
    const originalCarId = trip.car_id;

    if (updateTripDto.car_id && updateTripDto.car_id !== trip.car_id) {
      await this.carService.validateCarOwnership(userId, updateTripDto.car_id);
    }

    try {
      Object.assign(trip, updateTripDto);
      await this.tripRepository.save(trip);

      await this.recalculateDistances(trip.car_id, userId);

      if (updateTripDto.car_id && updateTripDto.car_id !== originalCarId) {
        await this.recalculateDistances(originalCarId, userId);
      }

      return await this.getTrip(userId, tripId);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update trip: ${error.message}`,
      );
    }
  }

  async getTripDirections(userId: number, carId?: number): Promise<string[]> {
    if (carId) {
      await this.carService.validateCarOwnership(userId, carId);
    }

    const query = this.tripRepository
      .createQueryBuilder('trip')
      .select('DISTINCT trip.direction', 'direction')
      .where('trip.user_id = :userId', { userId });

    if (carId) {
      query.andWhere('trip.car_id = :carId', { carId });
    }

    const result = await query.orderBy('trip.direction', 'ASC').getRawMany();
    return result.map((item) => item.direction);
  }

  async recalculateDistances(carId: number, userId: number): Promise<void> {
    const trips = await this.tripRepository.find({
      where: { car_id: carId, user_id: userId },
      order: { kilometres: 'ASC' },
    });

    for (let i = 0; i < trips.length; i++) {
      if (i === 0) {
        trips[i].distance = 0;
      } else {
        trips[i].distance = trips[i].kilometres - trips[i - 1].kilometres;
      }
    }

    await this.tripRepository.save(trips);
  }

  async recalculateAllUsersDistances(): Promise<void> {
    const cars = await this.carRepository.find();
    for (const car of cars) {
      await this.recalculateDistances(car.car_id, car.user_id);
    }
  }
}
