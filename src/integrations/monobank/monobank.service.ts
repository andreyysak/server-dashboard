import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { Account } from '../../modules/account/entities/account.entity';
import { Transaction } from '../../modules/transaction/entities/transaction.entity';
import { Category } from '../../modules/category/entities/category.entity';
import { MonoCard } from './entities/mono-card.entity';
import { AxiosError } from 'axios';

interface IMonoStatementItem {
  id: string;
  time: number;
  description: string;
  mcc: number;
  amount: number;
  balance: number;
}

@Injectable()
export class MonobankService {
  private readonly logger = new Logger(MonobankService.name);
  private readonly MONO_API_URL = 'https://api.monobank.ua';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(MonoCard)
    private readonly cardRepo: Repository<MonoCard>,
  ) {}

  async getClientInfo(userId: number, token: string) {
    this.logger.log(`Fetching client info for user ${userId}`);
    try {
      const response = await lastValueFrom(
        this.httpService
          .get(`${this.MONO_API_URL}/personal/client-info`, {
            headers: { 'X-Token': token },
          })
          .pipe(
            retry(2),
            catchError((error: AxiosError) => {
              this.logger.error(
                `Failed to fetch client info: ${error.message}`,
                error.stack,
              );
              throw new HttpException(
                'Failed to connect to Monobank API',
                HttpStatus.BAD_GATEWAY,
              );
            }),
          ),
      );

      const data = response.data;

      for (const acc of data.accounts) {
        await this.upsertCard(userId, acc, data.name);
      }

      for (const jar of data.jars) {
        await this.upsertCard(userId, jar, jar.title, true);
      }

      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Internal server error during Mono sync',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async syncTransactions(userId: number, accountId: number, token: string) {
    const account = await this.accountRepo.findOne({
      where: { account_id: accountId, user_id: userId },
    });

    if (!account || !account.mono_account_id) {
      throw new HttpException('Account mapping missing', HttpStatus.NOT_FOUND);
    }

    const now = Math.floor(Date.now() / 1000);
    const from = now - 31 * 24 * 60 * 60; // 31 days back (limit is 31 days usually)

    this.logger.log(
      `Syncing transactions for account ${accountId} (User: ${userId})`,
    );

    try {
      const response = await lastValueFrom(
        this.httpService
          .get<IMonoStatementItem[]>(
            `${this.MONO_API_URL}/personal/statement/${account.mono_account_id}/${from}/${now}`,
            { headers: { 'X-Token': token } },
          )
          .pipe(
            retry(2),
            catchError((error: AxiosError) => {
              this.logger.error(
                `Failed to fetch statement: ${error.message}`,
                error.stack,
              );
              throw new HttpException(
                'Failed to fetch Monobank statement',
                HttpStatus.BAD_GATEWAY,
              );
            }),
          ),
      );

      const data = response.data;
      let imported = 0;

      // Reverse to process oldest first if needed, or just iterate
      for (const item of data) {
        await this.saveTransaction(userId, accountId, item);
        imported++;
      }

      if (data.length > 0) {
        // Update balance from the latest transaction item (first in list usually)
        account.balance = data[0].balance / 100;
        await this.accountRepo.save(account);
      }

      this.logger.log(`Synced ${imported} transactions for account ${accountId}`);
      return { imported, currentBalance: account.balance };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Transaction sync failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async setWebhook(token: string, url: string) {
    this.logger.log(`Setting webhook: ${url}`);
    try {
      await lastValueFrom(
        this.httpService
          .post(
            `${this.MONO_API_URL}/personal/webhook`,
            { webHookUrl: url },
            { headers: { 'X-Token': token } },
          )
          .pipe(retry(2)),
      );
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to set webhook: ${error.message}`);
      throw new HttpException(
        'Failed to set webhook',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async handleWebhook(body: any) {
    if (body.type !== 'StatementItem') return;

    const { data } = body;
    const { account: monoAccountId, statementItem } = data;

    // Find account by mono_account_id
    // Note: We need user_id. Webhook doesn't provide it.
    // We assume account exists and find it.
    const account = await this.accountRepo.findOne({
      where: { mono_account_id: monoAccountId },
    });

    if (!account) {
      this.logger.warn(
        `Received webhook for unknown account: ${monoAccountId}`,
      );
      return;
    }

    await this.saveTransaction(account.user_id, account.account_id, statementItem);
    
    // Update balance
    account.balance = statementItem.balance / 100;
    await this.accountRepo.save(account);
    
    this.logger.log(`Webhook processed for account ${account.account_id}`);
  }

  private async saveTransaction(
    userId: number,
    accountId: number,
    item: IMonoStatementItem,
  ) {
    const exists = await this.transactionRepo.findOne({
      where: { mono_id: item.id },
    });

    if (!exists) {
      const categoryId = await this.mapMccToCategoryId(userId, item.mcc);

      const transaction = this.transactionRepo.create({
        user_id: userId,
        account_id: accountId,
        category_id: categoryId,
        amount: item.amount / 100,
        description: item.description || 'No description',
        created_at: new Date(item.time * 1000),
        mono_id: item.id,
      });

      await this.transactionRepo.save(transaction);
    }
  }

  async getSavedCards(userId: number): Promise<MonoCard[]> {
    return await this.cardRepo.find({
      where: { user_id: userId },
      order: { balance: 'DESC' },
    });
  }

  async getSavedCardById(userId: number, cardId: number): Promise<MonoCard> {
    const card = await this.cardRepo.findOne({
      where: { id: cardId, user_id: userId },
    });

    if (!card) {
      throw new HttpException('Card not found', HttpStatus.NOT_FOUND);
    }

    return card;
  }

  async initializeAccountsFromCards(userId: number) {
    const savedCards = await this.cardRepo.find({ where: { user_id: userId } });
    let createdCount = 0;

    for (const card of savedCards) {
      const existingAccount = await this.accountRepo.findOne({
        where: { mono_account_id: card.mono_account_id, user_id: userId },
      });

      if (!existingAccount) {
        const newAccount = this.accountRepo.create({
          user_id: userId,
          name: `Mono: ${card.name} (${card.type})`,
          balance: card.balance,
          currency:
            card.currency_code === 980
              ? 'UAH'
              : card.currency_code === 840
                ? 'USD'
                : ('EUR' as any),
          mono_account_id: card.mono_account_id,
        });

        await this.accountRepo.save(newAccount);
        createdCount++;
      }
    }

    return { success: true, accountsCreated: createdCount };
  }

  private async upsertCard(
    userId: number,
    monoData: any,
    ownerName: string,
    isJar = false,
  ) {
    let card = await this.cardRepo.findOne({
      where: { mono_account_id: monoData.id, user_id: userId },
    });

    if (!card) {
      card = this.cardRepo.create({
        mono_account_id: monoData.id,
        user_id: userId,
      });
    }

    card.name = ownerName;
    card.balance = monoData.balance / 100;
    card.currency_code = monoData.currencyCode;
    card.type = isJar ? 'jar' : monoData.type;
    card.masked_pan = monoData.maskedPan || null;
    card.iban = monoData.iban || null;

    await this.cardRepo.save(card);
  }

  private async mapMccToCategoryId(
    userId: number,
    mcc: number,
  ): Promise<number> {
    let categoryName = 'Інше';
    const mccMap: Record<string, number[]> = {
      Продукти: [5411, 5422, 5441, 5451, 5462, 5499],
      Розваги: [5812, 5813, 5814, 7832, 7922, 7991, 7996],
      Транспорт: [4111, 4121, 5541, 5542, 7523],
      'Здоров’я': [5912, 8011, 8021, 8099],
      Комуналка: [4900, 4814, 4899],
    };

    for (const [name, codes] of Object.entries(mccMap)) {
      if (codes.includes(mcc)) {
        categoryName = name;
        break;
      }
    }

    const category = await this.categoryRepo.findOne({
      where: { name: categoryName, user_id: userId },
    });

    if (!category) {
      const defaultCategory = await this.categoryRepo.findOne({
        where: { user_id: userId },
      });
      return defaultCategory ? defaultCategory.category_id : 1;
    }

    return category.category_id;
  }
}
