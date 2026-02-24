import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import {CurrencyRate} from "../entities/currency-rate.entity";

@Injectable()
export class CurrencyParserService {
    private readonly logger = new Logger(CurrencyParserService.name);
    private readonly NBU_URL = 'https://bank.gov.ua/NBUStatService/v1/statistictable/exchange?json';

    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(CurrencyRate)
        private readonly currencyRepo: Repository<CurrencyRate>,
    ) {}

    async updateRatesInDb() {
        try {
            this.logger.log('Отримання нових курсів валют від НБУ...');
            const { data } = await firstValueFrom(this.httpService.get(this.NBU_URL));
            const targetCodes = ['USD', 'EUR', 'PLN'];

            for (const item of data) {
                if (targetCodes.includes(item.cc)) {
                    await this.currencyRepo.upsert(
                        {
                            code: item.cc,
                            name: item.txt,
                            rate: item.rate,
                            exchange_date: item.exchangedate,
                        },
                        ['code'],
                    );
                }
            }

            this.logger.log('Курси валют успішно оновлено в БД');
            return await this.currencyRepo.find();
        } catch (error) {
            this.logger.error('Помилка збереження курсів:', error.message);
        }
    }

    async findAll() {
        return await this.currencyRepo.find();
    }
}