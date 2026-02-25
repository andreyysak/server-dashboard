import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MovieDetails } from './movie-details.entity';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  tmdb_id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  poster_path: string;

  @Column({ nullable: true })
  release_date: string;

  @Column({ type: 'text', nullable: true })
  overview: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => MovieDetails, (details) => details.movie, { cascade: true })
  @JoinColumn({ name: 'details_id' })
  details: MovieDetails;
}
