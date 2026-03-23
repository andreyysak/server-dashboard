import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TmdbBaseService } from '../../../shared/tmdb/tmdb-base.service';

@Injectable()
export class SeriesParserService extends TmdbBaseService {
  constructor(
    httpService: HttpService,
    configService: ConfigService,
  ) {
    super(httpService, configService);
  }

  async searchByTitle(query: string, lang?: string) {
    return this.fetchFromTmdb('/search/tv', { query, lang });
  }

  async getById(tmdbId: number, lang?: string) {
    return this.fetchFromTmdb(`/tv/${tmdbId}`, {
      append_to_response: 'credits,videos',
      lang,
    });
  }

  async getTrending(timeWindow: 'day' | 'week' = 'week', lang?: string) {
    return this.fetchFromTmdb(`/trending/tv/${timeWindow}`, { lang });
  }

  async getPopular(page: number = 1, lang?: string) {
    return this.fetchFromTmdb('/tv/popular', { page, lang });
  }

  async getOnTheAir(lang?: string) {
    return this.fetchFromTmdb('/tv/on_the_air', { lang });
  }

  async getSeriesCredits(tmdbId: number, lang?: string) {
    const data = await this.fetchFromTmdb(`/tv/${tmdbId}/credits`, { lang });
    return data?.cast || [];
  }
}
