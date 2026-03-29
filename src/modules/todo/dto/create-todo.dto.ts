import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  IsArray,
} from 'class-validator';
import { TodoStatus } from '../enums/todo-status.enum';
import { TodoPriority } from '../enums/todo-priority.enum';

export class CreateTodoDto {
  @ApiProperty({ example: 'Finish report' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Q1 Financial report', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: TodoStatus, example: TodoStatus.TODO, required: false })
  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus;

  @ApiProperty({ enum: TodoPriority, example: TodoPriority.MEDIUM, required: false })
  @IsEnum(TodoPriority)
  @IsOptional()
  priority?: TodoPriority;

  @ApiProperty({ example: '2024-12-31T23:59:59Z', required: false })
  @IsDateString()
  @IsOptional()
  deadline?: string;

  @ApiProperty({ example: 1, description: 'Category ID', required: false })
  @IsNumber()
  @IsOptional()
  category_id?: number;

  @ApiProperty({ example: 5, description: 'Parent Todo ID for subtasks', required: false })
  @IsNumber()
  @IsOptional()
  parent_id?: number;

  @ApiProperty({ example: ['2024-12-30T09:00:00Z'], required: false })
  @IsArray()
  @IsOptional()
  reminders?: string[];
}
