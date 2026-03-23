import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TmdbBaseService } from '../../../shared/tmdb/tmdb-base.service';

@Injectable()
export class MovieParserService extends TmdbBaseService {
  constructor(
    httpService: HttpService,
    configService: ConfigService,
  ) {
    super(httpService, configService);
  }

  async searchByTitle(query: string, lang?: string) {
    return this.fetchFromTmdb('/search/movie', { query, lang });
  }

  async getById(tmdbId: number, lang?: string) {
    return this.fetchFromTmdb(`/movie/${tmdbId}`, {
      append_to_response: 'credits,videos',
      lang,
    });
  }

  async getTrending(timeWindow: 'day' | 'week' = 'week', lang?: string) {
    return this.fetchFromTmdb(`/trending/movie/${timeWindow}`, { lang });
  }

  async getPopular(page: number = 1, lang?: string) {
    return this.fetchFromTmdb('/movie/popular', { page, lang });
  }

  async getUpcoming(months: number = 1, lang?: string) {
    const from = new Date().toISOString().split('T')[0];
    const toDate = new Date();
    toDate.setMonth(toDate.getMonth() + months);
    const to = toDate.toISOString().split('T')[0];

    return this.fetchFromTmdb('/discover/movie', {
      'primary_release_date.gte': from,
      'primary_release_date.lte': to,
      sort_by: 'primary_release_date.asc',
      lang,
    });
  }

  async getMovieCredits(tmdbId: number, lang?: string) {
    const data = await this.fetchFromTmdb(`/movie/${tmdbId}/credits`, { lang });
    return data?.cast || [];
  }
}
