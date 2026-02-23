import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { Series } from "./entities/series.entity";
import { SeriesDetails } from "./entities/series-details.entity";
import { CreateSeriesDto } from "./dto/create-series.dto";
import { SeriesStatus } from "./enums/series-status.enum";
import {UpdateSeriesProgressDto} from "./dto/update-series.dto";

@Injectable()
export class SeriesService {
  constructor(
      @InjectRepository(Series) private readonly seriesRepository: Repository<Series>,
      @InjectRepository(SeriesDetails) private readonly detailsRepository: Repository<SeriesDetails>,
  ) {}

  async addToList(userId: number, dto: CreateSeriesDto): Promise<Series> {
    const existing = await this.seriesRepository.findOne({
      where: { tmdb_id: dto.tmdb_id, user_id: userId }
    });

    if (existing) throw new ConflictException('Цей серіал вже є у вашому списку');

    let details = await this.detailsRepository.findOne({ where: { tmdb_id: dto.tmdb_id } });

    if (!details && dto.details) {
      details = this.detailsRepository.create({
        tmdb_id: dto.tmdb_id,
        ...dto.details
      });
      await this.detailsRepository.save(details);
    }

    const series = this.seriesRepository.create({
      ...dto,
      user_id: userId,
      status: dto.status || SeriesStatus.WATCH_LATER,
      details: details || undefined
    });

    return await this.seriesRepository.save(series);
  }

  async updateProgress(userId: number, id: number, dto: UpdateSeriesProgressDto): Promise<Series> {
    const series = await this.seriesRepository.findOne({ where: { id, user_id: userId } });
    if (!series) throw new NotFoundException('Серіал не знайдено');

    if (dto.current_season) series.current_season = dto.current_season;
    if (dto.current_episode) series.current_episode = dto.current_episode;
    if (dto.rating) series.user_rating = dto.rating;
    if (dto.comment !== undefined) series.user_comment = dto.comment ?? null;
    if (dto.status) series.status = dto.status;

    return await this.seriesRepository.save(series);
  }

  async findAll(userId: number, status?: SeriesStatus): Promise<Series[]> {
    return await this.seriesRepository.find({
      where: { user_id: userId, ...(status && { status }) },
      relations: ['details'],
      order: { created_at: 'DESC' }
    });
  }

  async searchByTitle(userId: number, title: string): Promise<Series[]> {
    return await this.seriesRepository.find({
      where: { user_id: userId, title: ILike(`%${title}%`) },
      relations: ['details']
    });
  }

  async remove(userId: number, id: number): Promise<void> {
    const result = await this.seriesRepository.delete({ id, user_id: userId });
    if (result.affected === 0) throw new NotFoundException('Серіал не знайдено');
  }
}