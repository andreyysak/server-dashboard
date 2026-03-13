import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MonobankService } from './monobank.service';
import { MonobankController } from './monobank.controller';
import { MonobankCronService } from './monobank.cron.service';
import { Account } from '../account/entities/account.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import { Category } from '../category/entities/category.entity';
import { MonoCard } from './entities/mono-card.entity';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    TypeOrmModule.forFeature([Account, Transaction, Category, MonoCard]),
  ],
  controllers: [MonobankController],
  providers: [MonobankService, MonobankCronService],
  exports: [MonobankService],
})
export class MonobankModule {}
