import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { NoteBlock } from './note-block.entity';
import { Tag } from './tag.entity';
import { NoteVersion } from './note-version.entity';

@Entity('notes')
@Tree('materialized-path')
export class Note {
  @PrimaryGeneratedColumn()
  note_id: number;

  @Index()
  @Column()
  user_id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ default: false })
  is_archived: boolean;

  @Column({ default: false })
  is_pinned: boolean;

  @Column({ default: false })
  is_favorite: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date; // For Trash system

  @VersionColumn()
  version: number; // For collaborative locking (optimistic concurrency)

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @TreeChildren()
  children: Note[];

  @TreeParent()
  @JoinColumn({ name: 'parent_id' })
  parent: Note | null;

  @Column({ nullable: true })
  parent_id: number;

  @OneToMany(() => NoteBlock, (block) => block.note, { cascade: true })
  blocks: NoteBlock[];

  @OneToMany(() => NoteVersion, (version) => version.note)
  versions: NoteVersion[];

  @ManyToMany(() => Tag, (tag) => tag.notes)
  @JoinTable({
    name: 'note_tags',
    joinColumn: { name: 'note_id', referencedColumnName: 'note_id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'tag_id' },
  })
  tags: Tag[];
}
