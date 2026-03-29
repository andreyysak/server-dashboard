import { PartialType } from '@nestjs/swagger';
import { CreateHabitDto } from './create-habit.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateHabitDto extends PartialType(CreateHabitDto) {
  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
