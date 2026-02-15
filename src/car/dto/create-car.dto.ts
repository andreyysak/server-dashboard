import {
    IsString,
    IsNumber,
    IsOptional,
    IsArray,
    ValidateNested,
    IsBoolean,
    Min,
    MaxLength, IsNotEmpty
} from 'class-validator';
import { Type } from 'class-transformer';

// Допоміжне DTO для картинок
class CarPictureDto {
    @IsString()
    url: string;

    @IsOptional()
    @IsBoolean()
    is_main?: boolean;
}

export class CreateCarDto {
    @IsString()
    @IsNotEmpty()
    brand: string;

    @IsString()
    @IsNotEmpty()
    model: string;

    @IsString()
    @MaxLength(17)
    @IsNotEmpty()
    vin_code: string;

    @IsOptional()
    @IsString()
    license_plate?: string;

    @IsOptional()
    @IsNumber()
    @Min(1900)
    year?: number;

    @IsOptional()
    @IsString()
    color?: string;

    @IsOptional()
    @IsString()
    fuel_type?: string;

    @IsOptional()
    @IsNumber()
    engine_capacity?: number;

    @IsOptional()
    @IsString()
    transmission?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    current_mileage?: number;

    @IsOptional()
    features?: any;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CarPictureDto)
    pictures?: CarPictureDto[];
}