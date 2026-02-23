import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonobankService } from './monobank.service';
import { MonobankController } from './monobank.controller';
import { Account } from '../account/entities/account.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import { Category } from '../category/entities/category.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Account, Transaction, Category]),
  ],
  controllers: [MonobankController],
  providers: [MonobankService],
  exports: [MonobankService],
})
export class MonobankModule {}