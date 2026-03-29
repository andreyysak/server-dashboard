import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository, Repository, In, ILike } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoFiltersDto } from './dto/todo-filters.dto';
import { TodoActivity } from './entities/todo-activity.entity';
import { TodoStatus } from './enums/todo-status.enum';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepo: Repository<Todo>,
    @InjectRepository(Todo)
    private readonly todoTreeRepo: TreeRepository<Todo>,
    @InjectRepository(TodoActivity)
    private readonly activityRepo: Repository<TodoActivity>,
  ) {}

  private async logActivity(userId: number, todoId: number, action: string, details?: any) {
    const activity = this.activityRepo.create({
      user_id: userId,
      todo_id: todoId,
      action,
      details,
    });
    await this.activityRepo.save(activity);
  }

  async create(userId: number, dto: CreateTodoDto): Promise<Todo> {
    const todo = this.todoRepo.create({ ...dto, user_id: userId });
    
    if (dto.parent_id) {
      const parent = await this.todoRepo.findOne({ where: { todo_id: dto.parent_id, user_id: userId } });
      if (!parent) throw new NotFoundException('Parent task not found');
      todo.parent = parent;
    }

    const savedTodo = await this.todoRepo.save(todo);
    await this.logActivity(userId, savedTodo.todo_id, 'created', dto);
    return savedTodo;
  }

  async update(userId: number, id: number, dto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.todoRepo.findOne({ where: { todo_id: id, user_id: userId } });
    if (!todo) throw new NotFoundException('Todo not found');

    const oldTodo = { ...todo }; // For activity log

    if (dto.parent_id !== undefined) {
      if (dto.parent_id === null) {
        todo.parent = null;
      } else {
        const parent = await this.todoRepo.findOne({ where: { todo_id: dto.parent_id, user_id: userId } });
        if (parent) todo.parent = parent;
        else throw new NotFoundException('Parent task not found');
      }
    }

    Object.assign(todo, dto);
    const updatedTodo = await this.todoRepo.save(todo);
    await this.logActivity(userId, updatedTodo.todo_id, 'updated', { old: oldTodo, new: dto });
    return updatedTodo;
  }

  async remove(userId: number, id: number): Promise<void> {
    const todo = await this.todoRepo.findOne({ where: { todo_id: id, user_id: userId } });
    if (!todo) throw new NotFoundException('Todo not found');

    await this.todoRepo.softRemove(todo); // Soft delete
    await this.logActivity(userId, id, 'deleted');
  }

  async bulkComplete(userId: number, ids: number[]): Promise<void> {
    await this.todoRepo.update({ user_id: userId, todo_id: In(ids) }, { completed: true, status: TodoStatus.DONE });
    for (const id of ids) {
      await this.logActivity(userId, id, 'completed');
    }
  }

  async bulkDelete(userId: number, ids: number[]): Promise<void> {
    // Note: TypeORM doesn't support softRemove directly with update criteria efficiently for many records in some drivers
    // We fetch them and then softRemove to trigger the DeleteDateColumn correctly
    const todos = await this.todoRepo.find({ where: { user_id: userId, todo_id: In(ids) } });
    await this.todoRepo.softRemove(todos);
    for (const id of ids) {
      await this.logActivity(userId, id, 'deleted');
    }
  }

  async findAll(userId: number, filters: TodoFiltersDto) {
    const query = this.todoRepo.createQueryBuilder('todo')
      .leftJoinAndSelect('todo.category', 'category')
      .where('todo.user_id = :userId', { userId });

    if (filters.status) query.andWhere('todo.status = :status', { status: filters.status });
    if (filters.priority) query.andWhere('todo.priority = :priority', { priority: filters.priority });
    if (filters.category_id) query.andWhere('todo.category_id = :categoryId', { categoryId: filters.category_id });
    if (filters.rootOnly) query.andWhere('todo.parent_id IS NULL');

    if (filters.search) {
      query.andWhere('(todo.title ILIKE :search OR todo.description ILIKE :search)', { search: `%${filters.search}%` });
    }

    const now = new Date();
    if (filters.deadlineRange === 'today') {
      const start = new Date(now.setHours(0,0,0,0));
      const end = new Date(now.setHours(23,59,59,999));
      query.andWhere('todo.deadline BETWEEN :start AND :end', { start, end });
    } else if (filters.deadlineRange === 'overdue') {
      query.andWhere('todo.deadline < :now AND todo.completed = false', { now });
    } else if (filters.deadlineRange === 'upcoming') {
      query.andWhere('todo.deadline > :now', { now });
    }

    // Sort
    const sortField = filters.sortBy === 'deadline' ? 'todo.deadline' : filters.sortBy === 'priority' ? 'todo.priority' : 'todo.created_at';
    const sortOrder = filters.sortOrder || 'DESC';
    query.orderBy(sortField, sortOrder);

    // Paginate
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [items, total] = await query.getManyAndCount();
    return { items, total, page, limit };
  }

  async getTree(userId: number): Promise<Todo[]> {
    const roots = await this.todoTreeRepo.findRoots();
    const userRoots = roots.filter(r => r.user_id === userId);
    
    const results: Todo[] = [];
    for (const root of userRoots) {
      const tree = await this.todoTreeRepo.findDescendantsTree(root);
      results.push(tree);
    }
    return results;
  }

  async getChildren(userId: number, parentId: number): Promise<Todo[]> {
    const parent = await this.todoRepo.findOne({ where: { todo_id: parentId, user_id: userId } });
    if (!parent) throw new NotFoundException('Parent not found');
    
    return await this.todoTreeRepo.findDescendants(parent);
  }

  async getActivities(userId: number, todoId: number): Promise<TodoActivity[]> {
    return this.activityRepo.find({ where: { user_id: userId, todo_id: todoId }, order: { created_at: 'DESC' } });
  }
}
