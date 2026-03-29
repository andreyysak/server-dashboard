import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  IsArray,
} from 'class-validator';
import { HabitType } from '../enums/habit-type.enum';

export class CreateHabitDto {
  @ApiProperty({ example: 'Drink Water', description: 'Habit title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Drink 2 liters of water daily', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: HabitType, example: HabitType.DAILY })
  @IsEnum(HabitType)
  type: HabitType;

  @ApiProperty({ example: 1, description: 'Target frequency' })
  @IsNumber()
  @IsNotEmpty()
  target: number;

  @ApiProperty({ example: '2024-01-01', description: 'Start date' })
  @IsDateString()
  @IsNotEmpty()
  start_date: string;

  @ApiProperty({ example: '2024-12-31', required: false })
  @IsDateString()
  @IsOptional()
  end_date?: string;

  @ApiProperty({ example: ['08:00', '20:00'], required: false })
  @IsArray()
  @IsOptional()
  reminders?: string[];

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  category_id?: number;
}
