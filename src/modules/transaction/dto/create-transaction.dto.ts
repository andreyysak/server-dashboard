import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ example: 1, description: 'ID of the account' })
  @IsNumber()
  @IsNotEmpty()
  account_id: number;

  @ApiProperty({ example: 5, description: 'ID of the category' })
  @IsNumber()
  @IsNotEmpty()
  category_id: number;

  @ApiProperty({ example: 150.50, description: 'Amount of transaction' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'Groceries', description: 'Description of the transaction', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'mono-tx-123', description: 'Monobank transaction ID', required: false })
  @IsString()
  @IsOptional()
  mono_id?: string;
}
