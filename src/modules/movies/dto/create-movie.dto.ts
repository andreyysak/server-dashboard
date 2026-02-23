import { IsNumber, IsString, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MovieStatus } from '../enums/movie-status.enum';

export class MovieDetailsDto {
    @IsString() @IsOptional() director?: string;
    @IsNumber() @IsOptional() budget?: number;
    @IsNumber() @IsOptional() revenue?: number;
    @IsOptional() cast?: any[];
    @IsOptional() production_companies?: any[];
    @IsNumber() @IsOptional() runtime?: number;
}

export class CreateMovieDto {
    @IsNumber()
    tmdb_id: number;

    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    poster_path?: string;

    @IsString()
    @IsOptional()
    release_date?: string;

    @IsString()
    @IsOptional()
    overview?: string;

    @IsEnum(MovieStatus)
    @IsOptional()
    status?: MovieStatus;

    @IsOptional()
    @ValidateNested()
    @Type(() => MovieDetailsDto)
    details?: MovieDetailsDto;
}