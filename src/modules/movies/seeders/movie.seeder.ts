import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { MovieWatched } from '../entities/movie-watched.entity'; // Виправлено імпорт
import { MovieFavorite } from '../entities/movie-favorites.entity';

@Injectable()
export class MovieSeeder {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
    @InjectRepository(MovieWatched) // Виправлено назву класу
    private readonly watchedRepo: Repository<MovieWatched>,
    @InjectRepository(MovieFavorite)
    private readonly favoriteRepo: Repository<MovieFavorite>,
  ) {}

  async seed() {
    // Твоя логіка заповнення бази даними...
  }
}
