import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { retry, timeout } from 'rxjs/operators';

@Injectable()
export class OpenWeatherClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('OPEN_WEATHER_API_KEY') || '';
    this.baseUrl = this.configService.get<string>('OPEN_WEATHER_URL') || '';
  }

  async getCurrentWeather(city: string) {
    try {
      const response = await firstValueFrom(
        this.httpService
          .get(`${this.baseUrl}/weather`, {
            params: {
              q: city,
              appid: this.apiKey,
              units: 'metric',
            },
          })
          .pipe(timeout(5000), retry(2)),
      );

      return response.data;
    } catch (error) {
      throw new InternalServerErrorException('OpenWeather API request failed');
    }
  }

  async getFiveDayForecast(city: string) {
    try {
      const response = await firstValueFrom(
        this.httpService
          .get(`${this.baseUrl}/forecast`, {
            params: {
              q: city,
              appid: this.apiKey,
              units: 'metric',
            },
          })
          .pipe(timeout(5000), retry(2)),
      );

      return response.data;
    } catch (error) {
      throw new InternalServerErrorException(
        'OpenWeather forecast request failed',
      );
    }
  }

  async getForecast(city: string) {
    return this.request('/forecast', { q: city });
  }

  async getOneCall(lat: number, lon: number) {
    return this.request('/onecall', { lat, lon });
  }

  async getAirPollution(lat: number, lon: number) {
    return this.request('/air_pollution', { lat, lon });
  }

  private async request(endpoint: string, params: any) {
    try {
      const response = await firstValueFrom(
        this.httpService
          .get(`${this.baseUrl}${endpoint}`, {
            params: {
              ...params,
              appid: this.apiKey,
              units: 'metric',
            },
          })
          .pipe(timeout(5000), retry(2)),
      );

      return response.data;
    } catch {
      throw new InternalServerErrorException(
        `OpenWeather request failed: ${endpoint}`,
      );
    }
  }
}
