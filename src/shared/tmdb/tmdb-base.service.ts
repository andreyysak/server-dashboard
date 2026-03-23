import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TmdbBaseService {
  protected readonly logger = new Logger(TmdbBaseService.name);
  protected readonly apiKey: string;
  protected readonly baseUrl: string;

  constructor(
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY') || '';
    this.baseUrl = this.configService.get<string>('TMDB_BASE_URL') || '';
  }

  protected resolveLanguage(lang: string = 'en'): string {
    return lang === 'ua' ? 'uk-UA' : 'en-US';
  }

  protected async fetchFromTmdb(endpoint: string, params: any = {}) {
    const language = this.resolveLanguage(params.lang);
    const requestParams = { ...params };
    delete requestParams.lang;

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}${endpoint}`, {
          params: {
            api_key: this.apiKey,
            language,
            ...requestParams,
          },
        }),
      );
      return data.results || data;
    } catch (error) {
      this.logger.error(`TMDB Error (${endpoint}): ${error.message}`);
      return null;
    }
  }

  async search(endpoint: string, query: string, lang?: string) {
    return this.fetchFromTmdb(endpoint, { query, lang });
  }

  async getTrending(endpoint: string, timeWindow: 'day' | 'week' = 'week', lang?: string) {
    return this.fetchFromTmdb(`${endpoint}/${timeWindow}`, { lang });
  }

  async getPopular(endpoint: string, page: number = 1, lang?: string) {
    return this.fetchFromTmdb(endpoint, { page, lang });
  }

  async getById(endpoint: string, id: number, appendToResponse: string = '', lang?: string) {
    return this.fetchFromTmdb(`${endpoint}/${id}`, {
      append_to_response: appendToResponse,
      lang,
    });
  }
}
