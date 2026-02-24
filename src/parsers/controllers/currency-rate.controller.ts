import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {CurrencyParserService} from "../services/currency-rate.service";

@ApiTags('Parsers - Currency')
@Controller('currency')
export class CurrencyController {
    constructor(private readonly currencyService: CurrencyParserService) {}

    @Get()
    @ApiOperation({ summary: 'Отримати актуальні курси валют з БД' })
    findAll() {
        return this.currencyService.findAll();
    }

    @Post('sync')
    @ApiOperation({ summary: 'Примусова синхронізація з НБУ' })
    sync() {
        return this.currencyService.updateRatesInDb();
    }
}