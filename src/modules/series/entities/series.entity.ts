import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SeriesDetails } from './series-details.entity';

@Entity('tv_series')
export class Series {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  tmdb_id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  poster_path: string;

  @Column({ nullable: true })
  first_air_date: string;

  @Column({ type: 'text', nullable: true })
  overview: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => SeriesDetails, (details) => details.series, { cascade: true })
  @JoinColumn({ name: 'details_id' })
  details: SeriesDetails;
}
