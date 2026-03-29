import {
  Column,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Note } from './note.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  tag_id: number;

  @Index({ unique: true })
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Note, (note) => note.tags)
  notes: Note[];
}
