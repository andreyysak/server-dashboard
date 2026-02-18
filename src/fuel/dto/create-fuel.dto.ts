import {ApiProperty} from "@nestjs/swagger";
import {FuelStation} from "../enums/fuel-station.enum";
import {IsEnum, IsNotEmpty, IsNumber} from "class-validator";

export class CreateFuelDto {
    @ApiProperty({ example: '1', description: 'Car ID'})
    @IsNotEmpty()
    @IsNumber()
    car_id: number

    @ApiProperty({ example: '25', description: 'Fuel liters'})
    @IsNotEmpty()
    @IsNumber()
    liters: number

    @ApiProperty({ example: '1200', description: 'Fuel price'})
    @IsNotEmpty()
    @IsNumber()
    price: number

    @ApiProperty({ example: 'WOG', description: 'Fuel station'})
    @IsNotEmpty()
    @IsEnum(FuelStation)
    station: FuelStation
}
