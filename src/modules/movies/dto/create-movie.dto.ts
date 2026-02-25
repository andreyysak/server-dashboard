import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MovieStatus } from '../enums/movie-status.enum';

export class MovieDetailsDto {
  @ApiPropertyOptional({
    example: 'Christopher Nolan',
    description: 'Режисер фільму',
  })
  @IsString()
  @IsOptional()
  director?: string;

  @ApiPropertyOptional({ example: 160000000, description: 'Бюджет у доларах' })
  @IsNumber()
  @IsOptional()
  budget?: number;

  @ApiPropertyOptional({ example: 836836967, description: 'Збори у доларах' })
  @IsNumber()
  @IsOptional()
  revenue?: number;

  @ApiPropertyOptional({
    example: [{ name: 'Leonardo DiCaprio', character: 'Cobb' }],
    description: 'Список акторів',
  })
  @IsOptional()
  cast?: any[];

  @ApiPropertyOptional({
    example: [{ name: 'Warner Bros. Pictures' }],
    description: 'Студії виробництва',
  })
  @IsOptional()
  production_companies?: any[];

  @ApiPropertyOptional({ example: 148, description: 'Тривалість у хвилинах' })
  @IsNumber()
  @IsOptional()
  runtime?: number;
}

export class CreateMovieDto {
  @ApiProperty({ example: 27205, description: 'Унікальний ID з бази TMDB' })
  @IsNumber()
  tmdb_id: number;

  @ApiProperty({ example: 'Inception', description: 'Назва фільму' })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: '/bundle_of_path.jpg',
    description: 'Шлях до постера (відносний)',
  })
  @IsString()
  @IsOptional()
  poster_path?: string;

  @ApiPropertyOptional({ example: '2010-07-15', description: 'Дата релізу' })
  @IsString()
  @IsOptional()
  release_date?: string;

  @ApiPropertyOptional({
    example:
      'A thief who steals corporate secrets through the use of dream-sharing technology...',
    description: 'Короткий опис',
  })
  @IsString()
  @IsOptional()
  overview?: string;

  @ApiPropertyOptional({
    enum: MovieStatus,
    default: MovieStatus.WATCH_LATER,
    description: 'Статус перегляду',
  })
  @IsEnum(MovieStatus)
  @IsOptional()
  status?: MovieStatus;

  @ApiPropertyOptional({
    type: () => MovieDetailsDto,
    description: 'Розширені деталі фільму',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MovieDetailsDto)
  details?: MovieDetailsDto;
}
