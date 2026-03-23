import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Account } from '../../modules/account/entities/account.entity';
import { MonobankService } from './monobank.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MonobankCronService {
  private readonly logger = new Logger(MonobankCronService.name);

  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    private readonly monobankService: MonobankService,
    private readonly configService: ConfigService,
  ) {}

  @Cron('*/10 * * * *')
  async handleCron() {
    this.logger.debug('Starting Monobank Auto-Sync...');

    const token = this.configService.get<string>('MONOBANK_API_TOKEN');
    if (!token) {
      this.logger.error('Sync failed: MONOBANK_API_TOKEN is missing');
      return;
    }

    const accounts = await this.accountRepo.find({
      where: { mono_account_id: Not(IsNull()) },
    });

    for (const acc of accounts) {
      try {
        await this.monobankService.syncTransactions(
          acc.user_id,
          acc.account_id,
          token,
        );
        this.logger.log(
          `Synced account ${acc.account_id} for user ${acc.user_id}`,
        );
      } catch (e) {
        this.logger.error(
          `Sync failed for account ${acc.account_id}: ${e.message}`,
        );
      }
    }
  }
}
