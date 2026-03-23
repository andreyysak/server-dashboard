import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Series } from './entities/series.entity';
import { SeriesDetails } from './entities/series-details.entity';
import { SeriesFavorite } from './entities/series-favorites.entity';
import { SeriesWatchLater } from './entities/series-watch-later.entity';
import { SeriesWatched } from './entities/series-watched.entity';
import { UpdateSeriesProgressDto } from './dto/update-series.dto';
import { SeriesStatus } from './enums/series-status.enum';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Series)
    private readonly seriesRepo: Repository<Series>,
    @InjectRepository(SeriesDetails)
    private readonly detailsRepo: Repository<SeriesDetails>,
    @InjectRepository(SeriesFavorite)
    private readonly favoriteRepo: Repository<SeriesFavorite>,
    @InjectRepository(SeriesWatchLater)
    private readonly watchLaterRepo: Repository<SeriesWatchLater>,
    @InjectRepository(SeriesWatched)
    private readonly watchedRepo: Repository<SeriesWatched>,
  ) {}

  async getFavorites(userId: number) {
    return this.favoriteRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async getWatchLater(userId: number) {
    return this.watchLaterRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async getWatched(userId: number) {
    return this.watchedRepo.find({
      where: { user_id: userId },
      order: { updated_at: 'DESC' },
    });
  }

  async toggleFavorite(userId: number, tmdbId: number) {
    const existing = await this.favoriteRepo.findOne({
      where: { user_id: userId, tmdb_id: tmdbId },
    });

    if (existing) {
      await this.favoriteRepo.remove(existing);
      return { added: false, message: 'Removed from favorites' };
    }

    const newFavorite = this.favoriteRepo.create({
      user_id: userId,
      tmdb_id: tmdbId,
    });

    await this.favoriteRepo.save(newFavorite);
    return { added: true, message: 'Added to favorites' };
  }

  async toggleWatchLater(userId: number, tmdbId: number) {
    const existing = await this.watchLaterRepo.findOne({
      where: { user_id: userId, tmdb_id: tmdbId },
    });

    if (existing) {
      await this.watchLaterRepo.remove(existing);
      return { added: false, message: 'Removed from watch later' };
    }

    const newEntity = this.watchLaterRepo.create({
      user_id: userId,
      tmdb_id: tmdbId,
    });

    await this.watchLaterRepo.save(newEntity);
    return { added: true, message: 'Added to watch later' };
  }

  async updateProgress(
    userId: number,
    tmdbId: number,
    dto: UpdateSeriesProgressDto,
  ) {
    let watched = await this.watchedRepo.findOne({
      where: { user_id: userId, tmdb_id: tmdbId },
    });

    if (!watched) {
      // If updating progress, it implies user is watching it
      watched = this.watchedRepo.create({
        user_id: userId,
        tmdb_id: tmdbId,
        status: SeriesStatus.WATCHING,
        current_season: 1,
        current_episode: 1,
      });
    }

    if (dto.current_season) watched.current_season = dto.current_season;
    if (dto.current_episode) watched.current_episode = dto.current_episode;
    if (dto.status) watched.status = dto.status;
    if (dto.rating) watched.user_rating = dto.rating;

    return await this.watchedRepo.save(watched);
  }

  async getLocalDetails(tmdbId: number) {
    const series = await this.seriesRepo.findOne({
      where: { tmdb_id: tmdbId },
      relations: ['details'],
    });

    if (!series) {
      throw new NotFoundException('Series not found in local database');
    }

    return series;
  }
}
