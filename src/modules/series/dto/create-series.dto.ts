import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SeriesStatus } from '../enums/series-status.enum';

export class SeriesDetailsDto {
  @IsString() @IsOptional() creator?: string;
  @IsNumber() @IsOptional() number_of_seasons?: number;
  @IsNumber() @IsOptional() number_of_episodes?: number;
  @IsArray() @IsOptional() cast?: any[];
  @IsArray() @IsOptional() production_companies?: any[];
  @IsString() @IsOptional() last_air_date?: string;
}

export class CreateSeriesDto {
  @IsNumber() @IsNotEmpty() tmdb_id: number;
  @IsString() @IsNotEmpty() title: string;
  @IsString() @IsOptional() poster_path?: string;
  @IsString() @IsOptional() first_air_date?: string;
  @IsEnum(SeriesStatus) @IsOptional() status?: SeriesStatus;

  @IsOptional()
  @ValidateNested()
  @Type(() => SeriesDetailsDto)
  details?: SeriesDetailsDto;
}
