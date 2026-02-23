import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { Account } from '../account/entities/account.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class MonobankService {
  private readonly MONO_API_URL = 'https://api.monobank.ua';

  constructor(
      private readonly httpService: HttpService,
      @InjectRepository(Account) private readonly accountRepo: Repository<Account>,
      @InjectRepository(Transaction) private readonly transactionRepo: Repository<Transaction>,
      @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
  ) {}

  async getClientInfo(token: string) {
    try {
      const response = await firstValueFrom(
          this.httpService.get(`${this.MONO_API_URL}/personal/client-info`, {
            headers: { 'X-Token': token },
          }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
          error.response?.data?.errorDescription || 'Mono API Error',
          HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async syncTransactions(userId: number, token: string, accountId: number) {
    const account = await this.accountRepo.findOne({ where: { account_id: accountId, user_id: userId } });

    if (!account || !account.mono_account_id) {
      throw new HttpException('Account not found or mono_account_id missing', HttpStatus.NOT_FOUND);
    }

    const now = Math.floor(Date.now() / 1000);
    const from = now - 30 * 24 * 60 * 60; // 30 днів

    try {
      const { data } = await firstValueFrom(
          this.httpService.get(
              `${this.MONO_API_URL}/personal/statement/${account.mono_account_id}/${from}/${now}`,
              { headers: { 'X-Token': token } },
          ),
      );

      let importedCount = 0;

      for (const item of data) {
        const transactionDate = new Date(item.time * 1000);

        const exists = await this.transactionRepo.findOne({
          where: {
            user_id: userId,
            account_id: accountId,
            created_at: transactionDate,
            amount: item.amount / 100
          }
        });

        if (!exists) {
          const categoryId = await this.mapMccToCategoryId(userId, item.mcc);

          const transaction = this.transactionRepo.create({
            user_id: userId,
            account_id: accountId,
            category_id: categoryId,
            amount: item.amount / 100,
            description: item.description || 'No description',
            created_at: transactionDate,
          });

          await this.transactionRepo.save(transaction);
          importedCount++;
        }
      }

      if (data.length > 0) {
        account.balance = data[0].balance / 100;
        await this.accountRepo.save(account);
      }

      return { success: true, imported: importedCount, currentBalance: account.balance };
    } catch (error) {
      if (error.response?.status === 429) {
        throw new HttpException('Too many requests to Monobank API. Wait 60s.', HttpStatus.TOO_MANY_REQUESTS);
      }
      throw new HttpException('Failed to sync transactions', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async mapMccToCategoryId(userId: number, mcc: number): Promise<number> {
    let categoryName = 'Інше';

    const mccMap: Record<string, number[]> = {
      'Продукти': [
        5411,
        5422,
        5441,
        5451,
        5462,
        5499
      ],
      'Розваги': [
        5812,
        5813,
        5814,
        7832,
        7922,
        7991,
        7996
      ],
      'Транспорт': [
        4111,
        4121,
        5541,
        5542,
        7523
      ],
      'Здоров’я': [
        5912,
        8011,
        8021,
        8099
      ],
      'Комуналка': [
        4900,
        4814,
        4899
      ]
    };

    for (const [name, codes] of Object.entries(mccMap)) {
      if (codes.includes(mcc)) {
        categoryName = name;
        break;
      }
    }

    const category = await this.categoryRepo.findOne({
      where: { name: categoryName, user_id: userId }
    });

    if (!category) {
      const defaultCategory = await this.categoryRepo.findOne({
        where: { user_id: userId }
      });
      return defaultCategory ? defaultCategory.category_id : 1;
    }

    return category.category_id;
  }
}