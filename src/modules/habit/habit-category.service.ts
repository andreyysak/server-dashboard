import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HabitCategory } from './entities/habit-category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class HabitCategoryService {
  constructor(
    @InjectRepository(HabitCategory)
    private readonly categoryRepo: Repository<HabitCategory>,
  ) {}

  async create(userId: number, dto: CreateCategoryDto) {
    const category = this.categoryRepo.create({ ...dto, user_id: userId });
    return await this.categoryRepo.save(category);
  }

  async findAll(userId: number) {
    return await this.categoryRepo.find({ where: { user_id: userId } });
  }

  async remove(userId: number, id: number) {
    const result = await this.categoryRepo.delete({ category_id: id, user_id: userId });
    if (result.affected === 0) throw new NotFoundException('Category not found');
  }
}
