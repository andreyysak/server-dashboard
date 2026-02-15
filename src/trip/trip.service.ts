import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Trip } from "./entities/trip.entity";
import { Repository } from "typeorm";
import { CreateTripDto } from "./dto/create-trip.dto";
import { UpdateTripDto } from "./dto/update-trip.dto";
import { Car } from "../car/entities/car.entity";

@Injectable()
export class TripService {
    constructor(
        @InjectRepository(Trip) private readonly tripRepository: Repository<Trip>,
        @InjectRepository(Car) private readonly carRepository: Repository<Car>,
    ) {}

    async getAllTrips(userId: number, carId?: number): Promise<Trip[]> {
        const where: any = { user_id: userId };

        if (carId) {
            where.car_id = carId;
        }

        return await this.tripRepository.find({
            where,
            order: { created_at: 'DESC' },
            relations: ['car']
        });
    }

    async getTrip(userId: number, tripId: number): Promise<Trip> {
        const trip = await this.tripRepository.findOne({
            where: {
                user_id: userId,
                trip_id: tripId
            },
            relations: ['car']
        });

        if (!trip) {
            throw new NotFoundException(`Trip with ID ${tripId} for user ${userId} not found`);
        }

        return trip;
    }

    async createTrip(userId: number, createTripDto: CreateTripDto): Promise<Trip> {
        const { kilometres, direction, car_id } = createTripDto;

        const car = await this.carRepository.findOne({
            where: { car_id, user_id: userId }
        });

        if (!car) {
            throw new ForbiddenException(`Access denied to car with ID ${car_id}`);
        }

        try {
            const newTrip = this.tripRepository.create({
                user_id: userId,
                car_id,
                kilometres,
                direction
            });

            return await this.tripRepository.save(newTrip);
        } catch (error) {
            throw new InternalServerErrorException(`Failed to create trip: ${error.message}`);
        }
    }

    async deleteTrip(userId: number, tripId: number): Promise<void> {
        const result = await this.tripRepository.delete({
            trip_id: tripId,
            user_id: userId
        });

        if (result.affected === 0) {
            throw new NotFoundException(`Trip not found or access denied`);
        }
    }

    async updateTrip(userId: number, tripId: number, updateTripDto: UpdateTripDto): Promise<Trip> {
        const trip = await this.getTrip(userId, tripId);

        if (updateTripDto.car_id && updateTripDto.car_id !== trip.car_id) {
            const car = await this.carRepository.findOne({
                where: { car_id: updateTripDto.car_id, user_id: userId }
            });
            if (!car) {
                throw new ForbiddenException(`Access denied to car with ID ${updateTripDto.car_id}`);
            }
        }

        try {
            Object.assign(trip, updateTripDto);
            return await this.tripRepository.save(trip);
        } catch (error) {
            throw new InternalServerErrorException(`Failed to update trip: ${error.message}`);
        }
    }

    async getTripDirections(userId: number, carId?: number): Promise<string[]> {
        const query = this.tripRepository
            .createQueryBuilder('trip')
            .select('DISTINCT trip.direction', 'direction')
            .where('trip.user_id = :userId', { userId });

        if (carId) {
            query.andWhere('trip.car_id = :carId', { carId });
        }

        const result = await query.orderBy('trip.direction', 'ASC').getRawMany();
        return result.map(item => item.direction);
    }
}