import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('currency_rates')
export class CurrencyRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  currency_code_a: number; // e.g. 840 (USD)

  @Column()
  currency_code_b: number; // e.g. 980 (UAH)

  @Column({ type: 'float', nullable: true })
  rate_sell: number;

  @Column({ type: 'float', nullable: true })
  rate_buy: number;

  @Column({ type: 'float', nullable: true })
  rate_cross: number;

  @Column({ type: 'bigint' })
  date: number; // Unix timestamp from API

  @CreateDateColumn()
  created_at: Date; // When we fetched it
}
