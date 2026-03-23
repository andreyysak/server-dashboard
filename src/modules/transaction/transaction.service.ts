import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

interface FindAllQuery {
  page?: number;
  limit?: number;
  accountId?: number;
  categoryId?: number;
  from?: string;
  to?: string;
  sortBy?: 'date' | 'amount';
  sortOrder?: 'ASC' | 'DESC';
}

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly repo: Repository<Transaction>,
  ) {}

  async create(userId: number, dto: CreateTransactionDto) {
    const transaction = this.repo.create({ ...dto, user_id: userId });
    return await this.repo.save(transaction);
  }

  async findAll(userId: number, query: FindAllQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = { user_id: userId };

    if (query.accountId) where.account_id = query.accountId;
    if (query.categoryId) where.category_id = query.categoryId;

    if (query.from && query.to) {
      where.created_at = Between(new Date(query.from), new Date(query.to));
    }

    const order: any = {};
    if (query.sortBy === 'amount') {
      order.amount = query.sortOrder || 'DESC';
    } else {
      order.created_at = query.sortOrder || 'DESC';
    }

    const [items, total] = await this.repo.findAndCount({
      where,
      order,
      take: limit,
      skip,
      relations: ['category', 'account'],
    });

    return {
      items,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: number, id: number) {
    const transaction = await this.repo.findOne({
      where: { transaction_id: id, user_id: userId },
      relations: ['category', 'account'],
    });
    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
  }

  async update(userId: number, id: number, dto: UpdateTransactionDto) {
    const transaction = await this.findOne(userId, id);
    Object.assign(transaction, dto);
    return await this.repo.save(transaction);
  }

  async remove(userId: number, id: number) {
    const result = await this.repo.delete({
      transaction_id: id,
      user_id: userId,
    });
    if (result.affected === 0)
      throw new NotFoundException('Transaction not found');
    return { success: true };
  }
}
