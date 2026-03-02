import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTripDto {
  @ApiProperty({ example: 1, description: 'ID автомобіля' })
  @IsNotEmpty()
  @IsNumber()
  car_id: number;

  @ApiProperty({ example: 15.5, description: 'Кількість кілометрів' })
  @IsNotEmpty()
  @IsNumber()
  kilometres: number;

  @ApiProperty({ example: 'Київ - Житомир', description: 'Напрямок поїздки' })
  @IsString()
  @IsNotEmpty()
  direction: string;
}
