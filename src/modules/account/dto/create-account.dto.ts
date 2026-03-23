import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Currency } from '../enum/Currency';

export class CreateAccountDto {
  @ApiProperty({ example: 'My Main Card', description: 'Name of the account' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1000.50, description: 'Current balance', default: 0 })
  @IsNumber()
  @IsOptional()
  balance?: number;

  @ApiProperty({ enum: Currency, example: Currency.UAH, description: 'Currency code', default: Currency.UAH })
  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;

  @ApiProperty({ example: 'mono-acc-id-123', description: 'Monobank account ID', required: false })
  @IsString()
  @IsOptional()
  mono_account_id?: string;
}
