import { IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMovieStatusDto {
  @ApiProperty({ example: 10, description: 'Оцінка від 1 до 10' })
  @IsNumber()
  @Min(1)
  @Max(10)
  rating: number;

  @ApiProperty({
    example: 'Шикарний фільм з несподіваним фіналом',
    required: false,
  })
  @IsString()
  @IsOptional()
  comment?: string;
}
