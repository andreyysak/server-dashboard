import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456789', description: 'Google ID' })
  @IsString()
  @IsNotEmpty()
  googleId: string;

  @ApiProperty({ example: 'John Doe', description: 'Google Name' })
  @IsString()
  @IsNotEmpty()
  googleName: string;

  @ApiProperty({ example: 'https://example.com/image.png', description: 'User avatar URL', required: false })
  @IsOptional()
  @IsString()
  image?: string;
}
