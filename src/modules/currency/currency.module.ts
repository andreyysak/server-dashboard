import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { CurrencyRate } from './entities/currency-rate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyRate]), HttpModule],
  controllers: [CurrencyController],
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
