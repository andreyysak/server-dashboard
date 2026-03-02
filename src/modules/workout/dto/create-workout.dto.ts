import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  IsArray,
  ValidateNested,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WorkoutType } from '../enums/workout-type.enums';

export class CreateExerciseDto {
  @ApiProperty({ example: 'Відтискання', description: 'Назва вправи' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 3, description: 'Кількість підходів' })
  @IsInt()
  @IsOptional()
  sets?: number;

  @ApiPropertyOptional({ example: 12, description: 'Кількість повторень' })
  @IsInt()
  @IsOptional()
  reps?: number;

  @ApiPropertyOptional({ example: 0, description: 'Вага (кг), якщо є' })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({
    example: 0,
    description: 'Дистанція в км (для бігу/вело)',
  })
  @IsNumber()
  @IsOptional()
  distance_km?: number;

  @ApiPropertyOptional({ example: 60, description: 'Тривалість в секундах' })
  @IsInt()
  @IsOptional()
  duration_seconds?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Порядок вправи у тренуванні',
  })
  @IsInt()
  @IsOptional()
  order?: number;
}

export class CreateWorkoutDto {
  @ApiProperty({ example: 'Ранкове тренування', description: 'Назва сесії' })
  @IsString()
  title: string;

  @ApiProperty({
    enum: WorkoutType,
    example: WorkoutType.GYM,
    description: 'Тип тренування',
  })
  @IsEnum(WorkoutType)
  type: WorkoutType;

  @ApiProperty({
    example: '2026-02-24T08:00:00Z',
    description: 'Дата та час тренування',
  })
  @IsDateString()
  workout_date: string;

  @ApiPropertyOptional({
    example: 45,
    description: 'Загальна тривалість у хвилинах',
  })
  @IsInt()
  @IsOptional()
  duration_minutes?: number;

  @ApiPropertyOptional({
    example: 'Чудове самопочуття, фокус на техніці',
    description: 'Нотатки',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    type: [CreateExerciseDto],
    description: 'Список вправ',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExerciseDto)
  exercises: CreateExerciseDto[];
}
