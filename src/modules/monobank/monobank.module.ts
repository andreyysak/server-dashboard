import { Module } from '@nestjs/common';
import { MonobankService } from './monobank.service';
import { MonobankController } from './monobank.controller';

@Module({
  controllers: [MonobankController],
  providers: [MonobankService],
})
export class MonobankModule {}
