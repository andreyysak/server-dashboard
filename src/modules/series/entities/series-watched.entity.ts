import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { SeriesStatus } from '../enums/series-status.enum';

@Entity('tv_series_watched')
export class SeriesWatched {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  tmdb_id: number;

  @Column({
    type: 'enum',
    enum: SeriesStatus,
    default: SeriesStatus.WATCHING,
  })
  status: SeriesStatus;

  @Column({ type: 'int', default: 1 })
  current_season: number;

  @Column({ type: 'int', default: 1 })
  current_episode: number;

  @Column({ type: 'int', nullable: true })
  user_rating: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.series_watched, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
