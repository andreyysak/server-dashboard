import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrencyRate } from './entities/currency-rate.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(CurrencyRate)
    private readonly repo: Repository<CurrencyRate>,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async fetchRates() {
    this.logger.log('Fetching currency rates...');
    try {
      const { data } = await firstValueFrom(
        this.httpService.get('https://api.monobank.ua/bank/currency'),
      );

      // Filter only relevant currencies (USD, EUR, PLN, GBP vs UAH)
      // UAH code is 980.
      // 840: USD, 978: EUR, 985: PLN, 826: GBP
      const relevant = data.filter(
        (rate: any) =>
          rate.currencyCodeB === 980 &&
          [840, 978, 985, 826].includes(rate.currencyCodeA),
      );

      for (const rate of relevant) {
        const entity = this.repo.create({
          currency_code_a: rate.currencyCodeA,
          currency_code_b: rate.currencyCodeB,
          rate_sell: rate.rateSell,
          rate_buy: rate.rateBuy,
          rate_cross: rate.rateCross,
          date: rate.date,
        });
        await this.repo.save(entity);
      }
      this.logger.log(`Saved ${relevant.length} currency rates`);
    } catch (e) {
      this.logger.error(`Failed to fetch rates: ${e.message}`);
    }
  }

  async getLatest() {
    // Get latest entry for each currency
    // Postgres specific DISTINCT ON
    return this.repo
      .createQueryBuilder('rate')
      .distinctOn(['rate.currency_code_a'])
      .orderBy('rate.currency_code_a')
      .addOrderBy('rate.date', 'DESC')
      .getMany();
  }

  async getLatestFormatted() {
    const rates = await this.getLatest();
    const map: Record<number, string> = {
      840: 'USD',
      978: 'EUR',
      985: 'PLN',
      826: 'GBP',
    };

    return rates.map((r) => ({
      ...r,
      currency: map[r.currency_code_a] || String(r.currency_code_a),
    }));
  }

  async getHistory(currencyCode: number, limit: number = 30) {
    return this.repo.find({
      where: { currency_code_a: currencyCode, currency_code_b: 980 },
      order: { date: 'DESC' },
      take: limit,
    });
  }
}
