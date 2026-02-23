import { IsString, IsEnum, IsOptional, IsInt, IsArray, ValidateNested, IsDateString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import {WorkoutType} from "../enums/workout-type.enums";

export class CreateExerciseDto {
    @IsString()
    name: string;

    @IsInt() @IsOptional() sets?: number;
    @IsInt() @IsOptional() reps?: number;
    @IsNumber() @IsOptional() weight?: number;
    @IsNumber() @IsOptional() distance_km?: number;
    @IsInt() @IsOptional() duration_seconds?: number;
    @IsInt() @IsOptional() order?: number;
}

export class CreateWorkoutDto {
    @IsString()
    title: string;

    @IsEnum(WorkoutType)
    type: WorkoutType;

    @IsDateString()
    workout_date: string;

    @IsInt() @IsOptional() duration_minutes?: number;

    @IsString() @IsOptional() notes?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateExerciseDto)
    exercises: CreateExerciseDto[];
}