import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMaintenanceDto {
  @ApiProperty({
    example: 1,
    description: 'ID автомобіля, до якого прив’язане ТО',
  })
  @IsNumber()
  @IsNotEmpty()
  car_id: number;

  @ApiProperty({
    example: '2026-02-24',
    description: 'Дата проведення обслуговування',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    example: 'Заміна мастила та фільтрів (Motul 5W-30)',
    description: 'Детальний опис проведених робіт',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 185000,
    description: 'Показник одометра на момент сервісу',
  })
  @IsNumber()
  @IsNotEmpty()
  odometer: number;
}
