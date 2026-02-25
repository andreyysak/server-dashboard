import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { MovieDetails } from './entities/movie-details.entity';
import { MovieWatchedEntity } from './entities/movie-watched.entity';
import { ManageMovieDto } from './dto/manage-movie.dto';
import { MovieParserService } from './external/movie.service';
import { MovieTypeEnum } from './enums/movie-type.enum';
import { MovieFavorite } from './entities/movie-favorites.entity';
import { MovieWatchLater } from './entities/movie_watch_later.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(MovieDetails)
    private readonly detailsRepository: Repository<MovieDetails>,
    @InjectRepository(MovieFavorite)
    private readonly favRepo: Repository<MovieFavorite>,
    @InjectRepository(MovieWatchedEntity)
    private readonly watchedRepo: Repository<MovieWatchedEntity>,
    @InjectRepository(MovieWatchLater)
    private readonly laterRepo: Repository<MovieWatchLater>,
    private readonly tmdbService: MovieParserService,
  ) {}

  async addToList(userId: number, list: MovieTypeEnum, dto: ManageMovieDto) {
    const repo = this.getRepo(list);

    const existsInList = await repo.findOne({
      where: { user_id: userId, tmdb_id: dto.tmdb_id },
    });

    if (existsInList) {
      throw new ConflictException('Фільм вже є у цьому списку');
    }

    await this.cacheMovieFromTmdb(dto.tmdb_id);

    if (list === MovieTypeEnum.WATCHED) {
      await this.laterRepo.delete({ user_id: userId, tmdb_id: dto.tmdb_id });
    } else if (list === MovieTypeEnum.WATCH_LATER) {
      await this.watchedRepo.delete({ user_id: userId, tmdb_id: dto.tmdb_id });
    }

    const record = repo.create({ user_id: userId, tmdb_id: dto.tmdb_id });
    return await repo.save(record);
  }

  async getList(userId: number, list: MovieTypeEnum) {
    const repo = this.getRepo(list);
    const records = await repo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });

    const populated = await Promise.all(
      records.map(async (record) => {
        const localMovieInfo = await this.movieRepository.findOne({
          where: { tmdb_id: record.tmdb_id },
          relations: ['details'],
        });

        return {
          id: record.id,
          user_id: record.user_id,
          tmdb_id: record.tmdb_id,
          created_at: record.created_at,
          movie_data: localMovieInfo,
        };
      }),
    );

    return populated;
  }

  async changeStatus(
    userId: number,
    tmdbId: number,
    MovieTypeEnum: MovieTypeEnum,
  ) {
    return this.addToList(userId, MovieTypeEnum, { tmdb_id: tmdbId });
  }

  async removeFromList(userId: number, list: MovieTypeEnum, tmdbId: number) {
    const repo = this.getRepo(list);
    const result = await repo.delete({ user_id: userId, tmdb_id: tmdbId });

    if (result.affected === 0) {
      throw new NotFoundException('Фільм не знайдено у списку');
    }
  }

  private getRepo(list: MovieTypeEnum) {
    switch (list) {
      case MovieTypeEnum.FAVORITE:
        return this.favRepo;
      case MovieTypeEnum.WATCHED:
        return this.watchedRepo;
      case MovieTypeEnum.WATCH_LATER:
        return this.laterRepo;
    }
  }

  private async cacheMovieFromTmdb(tmdbId: number): Promise<void> {
    const existingMovie = await this.movieRepository.findOne({
      where: { tmdb_id: tmdbId },
    });

    if (existingMovie) {
      return;
    }

    const tmdbData = await this.tmdbService.getById(tmdbId);

    if (!tmdbData) {
      throw new NotFoundException('Фільм не знайдено в базі TMDB');
    }

    const details = this.detailsRepository.create({
      tmdb_id: tmdbData.id,
      budget: tmdbData.budget,
      revenue: tmdbData.revenue,
      runtime: tmdbData.runtime,
      cast: tmdbData.credits?.cast?.slice(0, 10) || [],
      production_companies: tmdbData.production_companies || [],
    });

    await this.detailsRepository.save(details);

    const movie = this.movieRepository.create({
      tmdb_id: tmdbData.id,
      title: tmdbData.title || tmdbData.original_title,
      poster_path: tmdbData.poster_path,
      release_date: tmdbData.release_date,
      overview: tmdbData.overview,
      details: details,
    });

    await this.movieRepository.save(movie);
  }
}
