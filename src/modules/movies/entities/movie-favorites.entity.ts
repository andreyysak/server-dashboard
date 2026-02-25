import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('movies_favorites')
export class MovieFavorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  tmdb_id: number;

  @CreateDateColumn()
  created_at: Date;
}
