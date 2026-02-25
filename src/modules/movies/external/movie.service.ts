import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MovieParserService {
  private readonly logger = new Logger(MovieParserService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY') || '';
    this.baseUrl = this.configService.get<string>('TMDB_BASE_URL') || '';
  }

  async searchByTitle(query: string) {
    return this.fetchFromTmdb('/search/movie', { query });
  }

  async getById(tmdbId: number) {
    return this.fetchFromTmdb(`/movie/${tmdbId}`, {
      append_to_response: 'credits,videos',
    });
  }

  async getTrending(timeWindow: 'day' | 'week' = 'week') {
    return this.fetchFromTmdb(`/trending/movie/${timeWindow}`);
  }

  async getPopular(page: number = 1) {
    return this.fetchFromTmdb('/movie/popular', { page });
  }

  async getUpcoming(months: number = 1) {
    const from = new Date().toISOString().split('T')[0];
    const toDate = new Date();
    toDate.setMonth(toDate.getMonth() + months);
    const to = toDate.toISOString().split('T')[0];

    return this.fetchFromTmdb('/discover/movie', {
      'primary_release_date.gte': from,
      'primary_release_date.lte': to,
      sort_by: 'primary_release_date.asc',
    });
  }

  async getMovieCredits(tmdbId: number) {
    const data = await this.fetchFromTmdb(`/movie/${tmdbId}/credits`);
    return data?.cast || [];
  }

  private async fetchFromTmdb(endpoint: string, extraParams: object = {}) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}${endpoint}`, {
          params: {
            api_key: this.apiKey,
            language: 'uk-UA',
            region: 'UA',
            ...extraParams,
          },
        }),
      );
      return data.results || data;
    } catch (error) {
      this.logger.error(`TMDB Error (${endpoint}): ${error.message}`);
      return null;
    }
  }
}
