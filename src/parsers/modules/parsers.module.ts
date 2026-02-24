import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import {CurrencyRate} from "../entities/currency-rate.entity";
import {CurrencyController} from "../controllers/currency-rate.controller";
import {CurrencyParserService} from "../services/currency-rate.service";

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([CurrencyRate]),
    ],
    controllers: [CurrencyController],
    providers: [CurrencyParserService],
    exports: [CurrencyParserService],
})
export class ParsersModule {}