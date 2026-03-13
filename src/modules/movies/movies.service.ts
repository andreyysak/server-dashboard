import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { MovieDetails } from './entities/movie-details.entity';
import { MovieWatched } from './entities/movie-watched.entity';
import { MovieFavorite } from './entities/movie-favorites.entity';
import { MovieWatchLater } from './entities/movie_watch_later.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
    @InjectRepository(MovieDetails)
    private readonly detailsRepo: Repository<MovieDetails>,
    @InjectRepository(MovieWatched)
    private readonly watchedRepo: Repository<MovieWatched>,
    @InjectRepository(MovieFavorite)
    private readonly favoriteRepo: Repository<MovieFavorite>,
    @InjectRepository(MovieWatchLater)
    private readonly watchLaterRepo: Repository<MovieWatchLater>,
  ) {}

  /**
   * Отримати всі переглянуті фільми користувача з інформацією про фільм
   */
  async getWatchedMovies(userId: number) {
    return this.watchedRepo.find({
      where: { user_id: userId },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Отримати список улюблених фільмів
   */
  async getFavoriteMovies(userId: number) {
    return this.favoriteRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Отримати список "Подивитися пізніше"
   */
  async getWatchLaterMovies(userId: number) {
    return this.watchLaterRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Додати або видалити фільм з улюблених (Toggle)
   */
  async toggleFavorite(userId: number, tmdbId: number) {
    const favorite = await this.favoriteRepo.findOne({
      where: { user_id: userId, tmdb_id: tmdbId },
    });

    if (favorite) {
      await this.favoriteRepo.remove(favorite);
      return { added: false, message: 'Removed from favorites' };
    }

    const newFavorite = this.favoriteRepo.create({
      user_id: userId,
      tmdb_id: tmdbId,
    });

    await this.favoriteRepo.save(newFavorite);
    return { added: true, message: 'Added to favorites' };
  }

  /**
   * Додати або видалити фільм з переглянутих
   */
  async toggleWatched(userId: number, tmdbId: number) {
    const watched = await this.watchedRepo.findOne({
      where: { user_id: userId, tmdb_id: tmdbId },
    });

    if (watched) {
      await this.watchedRepo.remove(watched);
      return { added: false, message: 'Removed from watched' };
    }

    const newWatched = this.watchedRepo.create({
      user_id: userId,
      tmdb_id: tmdbId,
    });

    await this.watchedRepo.save(newWatched);
    return { added: true, message: 'Marked as watched' };
  }

  /**
   * Додати або видалити фільм зі списку "Подивитися пізніше"
   */
  async toggleWatchLater(userId: number, tmdbId: number) {
    const later = await this.watchLaterRepo.findOne({
      where: { user_id: userId, tmdb_id: tmdbId },
    });

    if (later) {
      await this.watchLaterRepo.remove(later);
      return { added: false, message: 'Removed from watch later' };
    }

    const newLater = this.watchLaterRepo.create({
      user_id: userId,
      tmdb_id: tmdbId,
    });

    await this.watchLaterRepo.save(newLater);
    return { added: true, message: 'Added to watch later' };
  }

  /**
   * Отримати деталі фільму з локального кешу
   */
  async getLocalMovieDetails(tmdbId: number) {
    const movie = await this.movieRepo.findOne({
      where: { tmdb_id: tmdbId },
      relations: ['details'],
    });

    if (!movie) {
      throw new HttpException(
        'Movie not found in local database',
        HttpStatus.NOT_FOUND,
      );
    }

    return movie;
  }

  /**
   * Видалити всі дані користувача (корисно при видаленні аккаунту)
   */
  async clearUserData(userId: number) {
    await Promise.all([
      this.favoriteRepo.delete({ user_id: userId }),
      this.watchedRepo.delete({ user_id: userId }),
      this.watchLaterRepo.delete({ user_id: userId }),
    ]);
    return { success: true };
  }
}
