import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workout } from './entities/workout.entity';
import { Exercise } from './entities/exercise.entity';
import { WorkoutsController } from './workout.controller';
import { WorkoutsService } from './workout.service';
import { WorkoutsSeeder } from './seeders/workout.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Workout, Exercise])],
  controllers: [WorkoutsController],
  providers: [WorkoutsService, WorkoutsSeeder],
  exports: [WorkoutsService],
})
export class WorkoutsModule {}
