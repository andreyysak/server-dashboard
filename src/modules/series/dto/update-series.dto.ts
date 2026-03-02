import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { SeriesStatus } from '../enums/series-status.enum';

export class UpdateSeriesProgressDto {
  @IsNumber() @Min(1) @IsOptional() current_season?: number;
  @IsNumber() @Min(1) @IsOptional() current_episode?: number;
  @IsNumber() @Min(1) @Max(10) @IsOptional() rating?: number;
  @IsString() @IsOptional() comment?: string;
  @IsEnum(SeriesStatus) @IsOptional() status?: SeriesStatus;
}
