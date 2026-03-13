import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('mono_cards')
export class MonoCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  mono_account_id: string;

  @Column()
  user_id: number;

  @Column({ nullable: true })
  name: string;

  @Column()
  type: string;

  @Column()
  currency_code: number;

  @Column({ type: 'float' })
  balance: number;

  @Column({ type: 'jsonb', nullable: true })
  masked_pan: string[];

  @Column({ nullable: true })
  iban: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
