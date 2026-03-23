import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Account } from '../../account/entities/account.entity';
import { Category } from '../../category/entities/category.entity';

@Entity('mono_transaction')
export class Transaction {
  @PrimaryGeneratedColumn()
  transaction_id: number;

  @Index({ unique: true })
  @Column({ nullable: true })
  mono_id: string;

  @Index()
  @Column()
  user_id: number;

  @Index()
  @Column()
  account_id: number;

  @Index()
  @Column()
  category_id: number;

  @Column({ type: 'float' })
  amount: number;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Account, (account) => account.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @ManyToOne(() => Category, (category) => category.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
