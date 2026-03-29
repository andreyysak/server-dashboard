import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { TodoStatus } from '../enums/todo-status.enum';
import { TodoPriority } from '../enums/todo-priority.enum';
import { Type } from 'class-transformer';

export class TodoFiltersDto {
  @ApiProperty({ enum: TodoStatus, required: false })
  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus;

  @ApiProperty({ enum: TodoPriority, required: false })
  @IsEnum(TodoPriority)
  @IsOptional()
  priority?: TodoPriority;

  @ApiProperty({ example: 1, required: false })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  category_id?: number;

  @ApiProperty({ example: 'today', required: false, description: 'today | overdue | upcoming' })
  @IsString()
  @IsOptional()
  deadlineRange?: string;

  @ApiProperty({ example: 'work', required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ example: 1, required: false, default: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ example: 20, required: false, default: 20 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit?: number = 20;

  @ApiProperty({ example: 'deadline', required: false, description: 'deadline | createdAt | priority' })
  @IsString()
  @IsOptional()
  sortBy?: string = 'createdAt';

  @ApiProperty({ example: 'DESC', required: false })
  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiProperty({ example: true, required: false, description: 'Only show root tasks' })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  rootOnly?: boolean;
}
