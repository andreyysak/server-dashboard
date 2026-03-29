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
import { Todo } from './todo.entity';

@Entity('todo_categories')
export class TodoCategory {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Index()
  @Column()
  user_id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  color: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Todo, (todo) => todo.category)
  todos: Todo[];
}
