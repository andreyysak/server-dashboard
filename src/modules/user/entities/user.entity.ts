import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from '../enums/user-role.enum';
import { Trip } from '../../trip/entities/trip.entity';
import { Car } from '../../car/entities/car.entity';
import { Fuel } from '../../fuel/entities/fuel.entity';
import { Account } from '../../account/entities/account.entity';
import { Category } from '../../category/entities/category.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { Maintenance } from '../../maintenance/entities/maintenance.entity';
import { Workout } from '../../workout/entities/workout.entity';
import { MonoCard } from '../../../integrations/monobank/entities/mono-card.entity';
import { MovieFavorite } from '../../movies/entities/movie-favorites.entity';
import { MovieWatched } from '../../movies/entities/movie-watched.entity';
import { MovieWatchLater } from '../../movies/entities/movie_watch_later.entity';
import { SeriesFavorite } from '../../series/entities/series-favorites.entity';
import { SeriesWatched } from '../../series/entities/series-watched.entity';
import { SeriesWatchLater } from '../../series/entities/series-watch-later.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Index({ unique: true })
  @Column({ unique: true, nullable: false })
  email: string;

  @Exclude()
  @Index({ unique: true, where: '("googleId" IS NOT NULL)' })
  @Column({ unique: true, nullable: true })
  googleId: string;

  @Column({ nullable: true })
  googleName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  telegram_name: string;

  @Column({ nullable: true })
  telegram_username: string;

  @Exclude()
  @Index({ unique: true, where: '("telegram_user_id" IS NOT NULL)' })
  @Column({ unique: true, nullable: true })
  telegram_user_id: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  city: string;

  @Index()
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Trip, (trip) => trip.user)
  trips: Trip[];

  @OneToMany(() => Car, (car) => car.user)
  cars: Car[];

  @OneToMany(() => Fuel, (fuel) => fuel.user)
  fuels: Fuel[];

  @OneToMany(() => Maintenance, (maintenance) => maintenance.user)
  maintenances: Maintenance[];

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  // --- MONOBANK ---
  @OneToMany(() => MonoCard, (card) => card.user)
  mono_cards: MonoCard[];

  // --- MOVIES ---
  @OneToMany(() => MovieFavorite, (favorite) => favorite.user)
  movie_favorites: MovieFavorite[];

  @OneToMany(() => MovieWatched, (watched) => watched.user)
  movie_watched: MovieWatched[];

  @OneToMany(() => MovieWatchLater, (later) => later.user)
  movie_watch_later: MovieWatchLater[];

  // --- SERIES ---
  @OneToMany(() => SeriesFavorite, (favorite) => favorite.user)
  series_favorites: SeriesFavorite[];

  @OneToMany(() => SeriesWatched, (watched) => watched.user)
  series_watched: SeriesWatched[];

  @OneToMany(() => SeriesWatchLater, (later) => later.user)
  series_watch_later: SeriesWatchLater[];

  // --- OTHER ---
  @OneToMany(() => Workout, (workout) => workout.user)
  workouts: Workout[];
}
