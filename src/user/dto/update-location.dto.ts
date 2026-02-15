import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsOptional, IsString, Length} from "class-validator";

export class UpdateUserLocationDto {
    @ApiProperty({ example: 'Ukraine', required: false })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(2, 50)
    country?: string

    @ApiProperty({ example: 'Kyiv', required: false })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(2, 50)
    city?: string;
}
