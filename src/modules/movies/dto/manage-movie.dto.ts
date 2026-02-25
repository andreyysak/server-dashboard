import { IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MovieTypeEnum } from '../enums/movie-type.enum';

export class ManageMovieDto {
  @ApiProperty({ example: 27205 })
  @IsNumber()
  tmdb_id: number;
}

export class ChangeStatusDto {
  @ApiProperty({ enum: MovieTypeEnum })
  @IsEnum(MovieTypeEnum)
  target_list: MovieTypeEnum;
}
