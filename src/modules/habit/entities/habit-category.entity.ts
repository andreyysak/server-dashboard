import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Habit } from './habit.entity';

@Entity('habit_categories')
export class HabitCategory {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Index()
  @Column()
  user_id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  icon: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Habit, (habit) => habit.category)
  habits: Habit[];
}
