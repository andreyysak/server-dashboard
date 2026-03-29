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
  DeleteDateColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { TodoStatus } from '../enums/todo-status.enum';
import { TodoPriority } from '../enums/todo-priority.enum';
import { TodoCategory } from './todo-category.entity';

@Entity('todos')
@Tree('materialized-path')
export class Todo {
  @PrimaryGeneratedColumn()
  todo_id: number;

  @Index()
  @Column()
  user_id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ default: false })
  is_pinned: boolean;

  @Index()
  @Column({ type: 'timestamp', nullable: true })
  deadline: Date;

  @Index()
  @Column({
    type: 'enum',
    enum: TodoPriority,
    default: TodoPriority.MEDIUM,
  })
  priority: TodoPriority;

  @Index()
  @Column({
    type: 'enum',
    enum: TodoStatus,
    default: TodoStatus.TODO,
  })
  status: TodoStatus;

  @Index()
  @Column({ nullable: true })
  category_id: number;

  @Column({ type: 'jsonb', nullable: true })
  reminders: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => TodoCategory, (cat) => cat.todos, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: TodoCategory;

  @TreeChildren()
  children: Todo[];

  @TreeParent()
  @JoinColumn({ name: 'parent_id' })
  parent: Todo | null;

  @Column({ nullable: true })
  parent_id: number;
}
