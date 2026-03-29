import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Habit } from './habit.entity';

@Entity('habit_logs')
@Index(['habit_id', 'date'], { unique: true })
export class HabitLog {
  @PrimaryGeneratedColumn()
  log_id: number;

  @Index()
  @Column()
  habit_id: number;

  @Column()
  user_id: number;

  @Column({ type: 'date' })
  date: string; // YYYY-MM-DD

  @Column({ type: 'float', nullable: true })
  value: number; // e.g., 2 (liters), 30 (minutes)

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Habit, (habit) => habit.logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'habit_id' })
  habit: Habit;
}
