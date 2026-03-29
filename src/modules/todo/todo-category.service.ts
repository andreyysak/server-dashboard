import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoCategory } from './entities/todo-category.entity';
import { CreateCategoryDto } from '../habit/dto/create-category.dto'; // Reuse category dto or create new

@Injectable()
export class TodoCategoryService {
  constructor(
    @InjectRepository(TodoCategory)
    private readonly repo: Repository<TodoCategory>,
  ) {}

  async create(userId: number, dto: any) {
    const category = this.repo.create({ ...dto, user_id: userId });
    return await this.repo.save(category);
  }

  async findAll(userId: number) {
    return await this.repo.find({ where: { user_id: userId } });
  }

  async remove(userId: number, id: number) {
    const result = await this.repo.delete({ category_id: id, user_id: userId });
    if (result.affected === 0) throw new NotFoundException('Category not found');
  }
}
