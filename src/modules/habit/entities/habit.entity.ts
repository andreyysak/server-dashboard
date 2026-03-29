import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { HabitType } from '../enums/habit-type.enum';
import { HabitLog } from './habit-log.entity';
import { HabitCategory } from './habit-category.entity';

@Entity('habits')
export class Habit {
  @PrimaryGeneratedColumn()
  habit_id: number;

  @Index()
  @Column()
  user_id: number;

  @Column({ nullable: true })
  category_id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: HabitType,
    default: HabitType.DAILY,
  })
  type: HabitType;

  @Column({ default: 1 })
  target: number;

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'date', nullable: true })
  end_date: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'jsonb', nullable: true })
  reminders: string[];

  // --- Cached Stats ---
  @Column({ default: 0 })
  current_streak: number;

  @Column({ default: 0 })
  longest_streak: number;

  @Column({ default: 0 })
  total_completions: number;

  @Column({ type: 'date', nullable: true })
  last_logged_date: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => HabitCategory, (cat) => cat.habits, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: HabitCategory;

  @OneToMany(() => HabitLog, (log) => log.habit)
  logs: HabitLog[];
}
