import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MonobankService } from './monobank.service';
import { MonobankController } from './monobank.controller';
import { MonobankCronService } from './monobank.cron.service';
import { Account } from '../../modules/account/entities/account.entity';
import { Transaction } from '../../modules/transaction/entities/transaction.entity';
import { Category } from '../../modules/category/entities/category.entity';
import { MonoCard } from './entities/mono-card.entity';
import { UserModule } from '../../modules/user/user.module';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    TypeOrmModule.forFeature([Account, Transaction, Category, MonoCard]),
    forwardRef(() => UserModule),
  ],
  controllers: [MonobankController],
  providers: [MonobankService, MonobankCronService],
  exports: [MonobankService],
})
export class MonobankModule {}
