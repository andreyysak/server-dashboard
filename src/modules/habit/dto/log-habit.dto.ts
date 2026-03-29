import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class HabitLogDto {
  @ApiProperty({ example: '2024-03-20', description: 'Date of completion' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 2, required: false, description: 'Optional measurement value' })
  @IsNumber()
  @IsOptional()
  value?: number;
}
