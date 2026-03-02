import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Currency } from '../enum/Currency';
import { User } from '../../user/entities/user.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity('account')
export class Account {
  @PrimaryGeneratedColumn()
  account_id: number;

  @Index()
  @Column()
  user_id: number;

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.UAH,
  })
  currency: Currency;

  @Column({ type: 'float', default: 0 })
  balance: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true, unique: true })
  mono_account_id: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];
}
