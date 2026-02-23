import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workout } from './entities/workout.entity';
import { Exercise } from './entities/exercise.entity';
import { CreateWorkoutDto } from './dto/create-workout.dto';

@Injectable()
export class WorkoutsService {
  constructor(
      @InjectRepository(Workout) private readonly workoutRepository: Repository<Workout>,
      @InjectRepository(Exercise) private readonly exerciseRepository: Repository<Exercise>,
  ) {}

  async create(userId: number, dto: CreateWorkoutDto): Promise<Workout> {
    const workout = this.workoutRepository.create({
      ...dto,
      user_id: userId,
      exercises: dto.exercises.map((ex, index) => ({
        ...ex,
        order: ex.order ?? index
      }))
    });

    return await this.workoutRepository.save(workout);
  }

  async findAll(userId: number): Promise<Workout[]> {
    return await this.workoutRepository.find({
      where: { user_id: userId },
      relations: ['exercises'],
      order: { workout_date: 'DESC' }
    });
  }

  async findOne(userId: number, id: number): Promise<Workout> {
    const workout = await this.workoutRepository.findOne({
      where: { id, user_id: userId },
      relations: ['exercises']
    });

    if (!workout) throw new NotFoundException('Тренування не знайдено');
    return workout;
  }

  async remove(userId: number, id: number): Promise<void> {
    const result = await this.workoutRepository.delete({ id, user_id: userId });
    if (result.affected === 0) throw new NotFoundException('Тренування не знайдено');
  }
}