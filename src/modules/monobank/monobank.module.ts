import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonobankService } from './monobank.service';
import { MonobankController } from './monobank.controller';
import { Account } from '../account/entities/account.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import { Category } from '../category/entities/category.entity';
import { ConfigModule } from '@nestjs/config';
import { MonobankCronService } from './monobank.cron.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    TypeOrmModule.forFeature([Account, Transaction, Category]),
  ],
  controllers: [MonobankController],
  providers: [MonobankService, MonobankCronService],
  exports: [MonobankService],
})
export class MonobankModule {}
