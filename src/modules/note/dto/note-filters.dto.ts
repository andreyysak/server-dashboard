import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class NoteFiltersDto {
  @ApiProperty({ example: false, required: false })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isArchived?: boolean = false;

  @ApiProperty({ example: true, required: false })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isPinned?: boolean;

  @ApiProperty({ example: 'work', required: false })
  @IsString()
  @IsOptional()
  tag?: string;

  @ApiProperty({ example: 'meeting', required: false })
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

  @ApiProperty({ example: 'updatedAt', required: false })
  @IsString()
  @IsOptional()
  sortBy?: string = 'updatedAt';

  @ApiProperty({ example: 'DESC', required: false })
  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
