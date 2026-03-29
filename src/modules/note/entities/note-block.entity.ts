import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Note } from './note.entity';
import { NoteBlockType } from '../enums/block-type.enum';

@Entity('note_blocks')
export class NoteBlock {
  @PrimaryGeneratedColumn()
  block_id: number;

  @Index()
  @Column()
  note_id: number;

  @Column({
    type: 'enum',
    enum: NoteBlockType,
    default: NoteBlockType.TEXT,
  })
  type: NoteBlockType;

  @Column({ type: 'jsonb' })
  content: any;

  @Column({ type: 'int', default: 0 })
  order: number;

  @ManyToOne(() => Note, (note) => note.blocks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'note_id' })
  note: Note;
}
