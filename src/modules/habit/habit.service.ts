import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Habit } from './entities/habit.entity';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';

@Injectable()
export class HabitService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitRepo: Repository<Habit>,
  ) {}

  async create(userId: number, dto: CreateHabitDto): Promise<Habit> {
    const habit = this.habitRepo.create({ ...dto, user_id: userId });
    return await this.habitRepo.save(habit);
  }

  async update(userId: number, id: number, dto: UpdateHabitDto): Promise<Habit> {
    const habit = await this.habitRepo.findOne({
      where: { habit_id: id, user_id: userId },
    });
    if (!habit) throw new NotFoundException('Habit not found');

    Object.assign(habit, dto);
    return await this.habitRepo.save(habit);
  }

  async remove(userId: number, id: number): Promise<void> {
    const result = await this.habitRepo.delete({ habit_id: id, user_id: userId });
    if (result.affected === 0) throw new NotFoundException('Habit not found');
  }

  async findAll(
    userId: number,
    filters: { isActive?: boolean; categoryId?: number; page?: number; limit?: number },
  ): Promise<{ items: Habit[]; total: number }> {
    const { isActive, categoryId, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Habit> = { user_id: userId };
    if (isActive !== undefined) where.is_active = isActive;
    if (categoryId !== undefined) where.category_id = categoryId;

    const [items, total] = await this.habitRepo.findAndCount({
      where,
      order: { created_at: 'DESC' },
      take: limit,
      skip,
      relations: ['category'],
    });

    return { items, total };
  }

  async findOne(userId: number, id: number): Promise<Habit> {
    const habit = await this.habitRepo.findOne({
      where: { habit_id: id, user_id: userId },
      relations: ['logs', 'category'],
    });
    if (!habit) throw new NotFoundException('Habit not found');
    return habit;
  }
}
