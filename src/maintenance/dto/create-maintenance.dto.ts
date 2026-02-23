import {IsDateString, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateMaintenanceDto {
    @IsNumber() @IsNotEmpty() car_id: number;
    @IsDateString() @IsNotEmpty() date: string;
    @IsString() @IsNotEmpty() description: string;
    @IsNumber() @IsNotEmpty() odometer: number;
}