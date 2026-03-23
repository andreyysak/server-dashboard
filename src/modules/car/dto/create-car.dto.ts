import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsBoolean,
  Min,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

// Допоміжне DTO для картинок
class CarPictureDto {
  @ApiProperty({ example: 'https://example.com/image.png', description: 'URL of the car picture' })
  @IsString()
  url: string;

  @ApiProperty({ example: true, description: 'Is this the main picture of the car?', required: false })
  @IsOptional()
  @IsBoolean()
  is_main?: boolean;
}

export class CreateCarDto {
  @ApiProperty({ example: 'Toyota', description: 'Brand of the car' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: 'Camry', description: 'Model of the car' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: '12345678901234567', description: 'VIN code of the car' })
  @IsString()
  @MaxLength(17)
  @IsNotEmpty()
  vin_code: string;

  @ApiProperty({ example: 'AA1234BB', description: 'License plate of the car', required: false })
  @IsOptional()
  @IsString()
  license_plate?: string;

  @ApiProperty({ example: 2022, description: 'Year of the car manufacture', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1900)
  year?: number;

  @ApiProperty({ example: 'black', description: 'Color of the car', required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ example: 'gasoline', description: 'Type of fuel', required: false })
  @IsOptional()
  @IsString()
  fuel_type?: string;

  @ApiProperty({ example: 2.5, description: 'Engine capacity in liters', required: false })
  @IsOptional()
  @IsNumber()
  engine_capacity?: number;

  @ApiProperty({ example: 'automatic', description: 'Transmission type', required: false })
  @IsOptional()
  @IsString()
  transmission?: string;

  @ApiProperty({ example: 15000, description: 'Current mileage of the car', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  current_mileage?: number;

  @ApiProperty({ description: 'Additional features of the car', required: false })
  @IsOptional()
  features?: any;

  @ApiProperty({ type: [CarPictureDto], description: 'List of car pictures', required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CarPictureDto)
  pictures?: CarPictureDto[];
}
