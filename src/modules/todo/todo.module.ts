import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoService } from './todo.service';
import { TodoCategoryService } from './todo-category.service';
import { TodoController } from './todo.controller';
import { TodoCategoryController } from './todo-category.controller';
import { Todo } from './entities/todo.entity';
import { TodoCategory } from './entities/todo-category.entity';
import { TodoActivity } from './entities/todo-activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, TodoCategory, TodoActivity])],
  controllers: [TodoController, TodoCategoryController],
  providers: [TodoService, TodoCategoryService],
  exports: [TodoService],
})
export class TodoModule {}
