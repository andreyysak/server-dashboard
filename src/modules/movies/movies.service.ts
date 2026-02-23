import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Movie } from "./entities/movie.entity";
import { MovieDetails } from "./entities/movie-details.entity";
import { ILike, Repository } from "typeorm";
import { MovieStatus } from "./enums/movie-status.enum";
import { UpdateMovieStatusDto } from "./dto/update-movie.dto";

@Injectable()
export class MoviesService {
  constructor(
      @InjectRepository(Movie)
      private readonly movieRepository: Repository<Movie>,
      @InjectRepository(MovieDetails)
      private readonly detailsRepository: Repository<MovieDetails>,
  ) {}

  async addToList(userId: number, dto: CreateMovieDto): Promise<Movie> {
    const existingMovie = await this.movieRepository.findOne({
      where: { tmdb_id: dto.tmdb_id, user_id: userId }
    });

    if (existingMovie) {
      throw new ConflictException('Цей фільм вже є у вашому списку');
    }

    let details = await this.detailsRepository.findOne({
      where: { tmdb_id: dto.tmdb_id }
    });

    if (!details && dto.details) {
      details = this.detailsRepository.create({
        tmdb_id: dto.tmdb_id,
        director: dto.details.director,
        budget: dto.details.budget,
        revenue: dto.details.revenue,
        cast: dto.details.cast,
        production_companies: dto.details.production_companies,
        runtime: dto.details.runtime
      });
      await this.detailsRepository.save(details);
    }

    const movie = this.movieRepository.create({
      tmdb_id: dto.tmdb_id,
      title: dto.title,
      poster_path: dto.poster_path,
      release_date: dto.release_date,
      overview: dto.overview,
      user_id: userId,
      status: dto.status || MovieStatus.WATCH_LATER,
      details: details || undefined
    });

    return await this.movieRepository.save(movie);
  }

  async findAll(userId: number, status?: MovieStatus): Promise<Movie[]> {
    return await this.movieRepository.find({
      where: { user_id: userId, ...(status && { status }) },
      relations: ['details'],
      order: { created_at: 'DESC' }
    });
  }

  async findOne(userId: number, movieId: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { id: movieId, user_id: userId },
      relations: ['details']
    });

    if (!movie) {
      throw new NotFoundException('Фільм не знайдено');
    }

    return movie;
  }

  async searchByTitle(userId: number, title: string): Promise<Movie[]> {
    return await this.movieRepository.find({
      where: {
        user_id: userId,
        title: ILike(`%${title}%`)
      },
      relations: ['details'],
      order: { created_at: 'DESC' }
    });
  }

  async markAsWatched(userId: number, movieId: number, dto: UpdateMovieStatusDto): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { id: movieId, user_id: userId }
    });

    if (!movie) {
      throw new NotFoundException('Фільм не знайдено у вашому списку');
    }

    movie.status = MovieStatus.WATCHED;
    movie.user_rating = dto.rating;
    movie.user_comment = dto.comment ?? null;

    return await this.movieRepository.save(movie);
  }

  async remove(userId: number, movieId: number): Promise<void> {
    const result = await this.movieRepository.delete({
      id: movieId,
      user_id: userId
    });

    if (result.affected === 0) {
      throw new NotFoundException('Фільм не знайдено');
    }
  }

  async getStats(userId: number) {
    const movies = await this.movieRepository.find({ where: { user_id: userId } });

    const watchedMovies = movies.filter(m => m.status === MovieStatus.WATCHED);
    const ratedMovies = movies.filter(m => m.user_rating !== null && m.user_rating !== undefined);

    return {
      total: movies.length,
      watched: watchedMovies.length,
      later: movies.filter(m => m.status === MovieStatus.WATCH_LATER).length,
      avgRating: ratedMovies.length > 0
          ? ratedMovies.reduce((acc, m) => acc + (m.user_rating || 0), 0) / ratedMovies.length
          : 0
    };
  }
}