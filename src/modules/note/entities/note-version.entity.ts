import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Note } from './note.entity';

@Entity('note_versions')
export class NoteVersion {
  @PrimaryGeneratedColumn()
  version_id: number;

  @Index()
  @Column()
  note_id: number;

  @Column({ type: 'jsonb' })
  snapshot: any; // Full note state including blocks

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Note, (note) => note.versions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'note_id' })
  note: Note;
}
