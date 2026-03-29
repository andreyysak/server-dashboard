import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitService } from './habit.service';
import { HabitLogService } from './habit-log.service';
import { HabitCategoryService } from './habit-category.service';
import { HabitController } from './habit.controller';
import { HabitLogController } from './habit-log.controller';
import { HabitCategoryController } from './habit-category.controller';
import { Habit } from './entities/habit.entity';
import { HabitLog } from './entities/habit-log.entity';
import { HabitCategory } from './entities/habit-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Habit, HabitLog, HabitCategory])],
  controllers: [
    HabitController,
    HabitLogController,
    HabitCategoryController,
  ],
  providers: [HabitService, HabitLogService, HabitCategoryService],
  exports: [HabitService],
})
export class HabitModule {}
