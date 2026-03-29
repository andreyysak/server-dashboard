import { PartialType } from '@nestjs/swagger';
import { CreateTodoDto } from './create-todo.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  is_pinned?: boolean;
}
