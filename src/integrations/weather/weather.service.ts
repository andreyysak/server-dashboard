import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../modules/user/entities/user.entity';
import { OpenWeatherClient } from './clients/open-weather.client';

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly client: OpenWeatherClient,
  ) {}

  private async getUserCity(userId: number): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    if (!user || !user.city) {
      throw new NotFoundException('User or city not found');
    }

    return user.city;
  }

  async getCurrent(userId: number) {
    const city = await this.getUserCity(userId);
    return this.client.getCurrentWeather(city);
  }

  async getFiveDays(userId: number) {
    const city = await this.getUserCity(userId);
    return this.client.getForecast(city);
  }

  async getTodayForecast(userId: number) {
    const forecast = await this.getFiveDays(userId);
    const today = new Date().toISOString().split('T')[0];
    return forecast.list.filter((item) => item.dt_txt.startsWith(today));
  }

  async getNext24Hours(userId: number) {
    const forecast = await this.getFiveDays(userId);
    return forecast.list.slice(0, 8);
  }

  async getTodayMin(userId: number) {
    const today = await this.getTodayForecast(userId);
    return Math.min(...today.map((i) => i.main.temp));
  }

  async getTodayMax(userId: number) {
    const today = await this.getTodayForecast(userId);
    return Math.max(...today.map((i) => i.main.temp));
  }

  async getTodayAverage(userId: number) {
    const today = await this.getTodayForecast(userId);
    const sum = today.reduce((a, b) => a + b.main.temp, 0);
    return sum / today.length;
  }

  async getRainProbability(userId: number) {
    const today = await this.getTodayForecast(userId);
    return today.map((i) => i.pop);
  }

  async getHottestTime(userId: number) {
    const forecast = await this.getFiveDays(userId);
    return forecast.list.reduce((prev, curr) =>
      curr.main.temp > prev.main.temp ? curr : prev,
    );
  }

  async getColdestTime(userId: number) {
    const forecast = await this.getFiveDays(userId);
    return forecast.list.reduce((prev, curr) =>
      curr.main.temp < prev.main.temp ? curr : prev,
    );
  }

  async getRainyPeriods(userId: number) {
    const forecast = await this.getFiveDays(userId);
    return forecast.list.filter((i) => i.weather[0].main === 'Rain');
  }

  async getStrongWind(userId: number) {
    const forecast = await this.getFiveDays(userId);
    return forecast.list.filter((i) => i.wind.speed > 10);
  }

  async getSunTimes(userId: number) {
    const current = await this.getCurrent(userId);
    return {
      sunrise: new Date(current.sys.sunrise * 1000),
      sunset: new Date(current.sys.sunset * 1000),
    };
  }

  async getUV(userId: number) {
    const current = await this.getCurrent(userId);
    const oneCall = await this.client.getOneCall(
      current.coord.lat,
      current.coord.lon,
    );

    return oneCall.current.uvi;
  }

  async getSevenDays(userId: number) {
    const current = await this.getCurrent(userId);
    const oneCall = await this.client.getOneCall(
      current.coord.lat,
      current.coord.lon,
    );

    return oneCall.daily;
  }

  async getAirQuality(userId: number) {
    const current = await this.getCurrent(userId);
    return this.client.getAirPollution(current.coord.lat, current.coord.lon);
  }

  async getAlerts(userId: number) {
    const current = await this.getCurrent(userId);
    const oneCall = await this.client.getOneCall(
      current.coord.lat,
      current.coord.lon,
    );

    return oneCall.alerts || [];
  }

  async getWarmerThan(userId: number, temp: number) {
    const forecast = await this.getFiveDays(userId);
    return forecast.list.filter((i) => i.main.temp > temp);
  }

  async getByCondition(userId: number, condition: string) {
    const forecast = await this.getFiveDays(userId);
    return forecast.list.filter((i) => i.weather[0].main === condition);
  }

  async getComfortablePeriods(userId: number) {
    const forecast = await this.getFiveDays(userId);
    return forecast.list.filter((i) => i.main.temp >= 18 && i.main.temp <= 25);
  }
}
