import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Health' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '#FF0000', required: false })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ example: 'heart', required: false })
  @IsString()
  @IsOptional()
  icon?: string;
}
