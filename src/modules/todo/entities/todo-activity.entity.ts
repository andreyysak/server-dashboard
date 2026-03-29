import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Todo } from './todo.entity';

@Entity('todo_activities')
export class TodoActivity {
  @PrimaryGeneratedColumn()
  activity_id: number;

  @Index()
  @Column()
  todo_id: number;

  @Column()
  user_id: number;

  @Column()
  action: string; // e.g., 'created', 'updated', 'completed', 'deleted'

  @Column({ type: 'jsonb', nullable: true })
  details: any;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Todo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'todo_id' })
  todo: Todo;
}
