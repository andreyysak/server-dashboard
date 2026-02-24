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

  async getTrending() {
    return this.fetchFromTmdb('/trending/movie/week');
  }

  async getUpcoming() {
    return this.fetchFromTmdb('/movie/upcoming');
  }

  async getPopular() {
    return this.fetchFromTmdb('/movie/popular');
  }

  private async fetchFromTmdb(endpoint: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}${endpoint}`, {
          params: {
            api_key: this.apiKey,
            language: 'uk-UA',
            region: 'UA',
          },
        }),
      );
      return data.results;
    } catch (error) {
      this.logger.error(`Помилка TMDB (${endpoint}): ${error.message}`);
      return [];
    }
  }
}
