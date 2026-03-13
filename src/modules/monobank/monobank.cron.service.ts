import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Account } from '../account/entities/account.entity';
import { MonobankService } from './monobank.service';

@Injectable()
export class MonobankCronService {
  private readonly logger = new Logger(MonobankCronService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly monobankService: MonobankService,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  @Cron('*/10 * * * *') // Кожні 10 хвилин
  async handleSync() {
    this.logger.debug('Запуск автоматичної синхронізації Monobank...');

    const token = this.configService.get<string>('MONOBANK_API_TOKEN');

    if (!token) {
      this.logger.error('MONOBANK_API_TOKEN не знайдено в .env!');
      return;
    }

    const accounts = await this.accountRepo.find({
      where: { mono_account_id: Not(IsNull()) },
    });

    if (accounts.length === 0) {
      this.logger.warn(
        'Не знайдено жодного рахунку з прив’язаним Monobank ID.',
      );
      return;
    }

    for (const account of accounts) {
      try {
        this.logger.log(`Синхронізація для рахунку: ${account.account_id}`);

        const result = await this.monobankService.syncTransactions(
          account.user_id,
          token,
          account.account_id,
        );

        this.logger.log(
          `Успішно! Імпортовано: ${result.imported}. Баланс: ${result.currentBalance} грн.`,
        );
      } catch (error) {
        this.logger.error(
          `Помилка під час синхронізації акаунта ${account.account_id}: ${error.message}`,
        );
      }
    }
  }
}
