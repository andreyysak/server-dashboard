import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get(':userId/current')
  @ApiOperation({
    summary: 'Поточна погода',
    description: 'Отримує актуальні дані про погоду для локації користувача',
  })
  @ApiParam({ name: 'userId', description: 'ID користувача' })
  getCurrent(@Param('userId', ParseIntPipe) userId: number) {
    return this.weatherService.getCurrent(userId);
  }

  @Get(':userId/forecast/5-days')
  @ApiOperation({ summary: 'Прогноз на 5 днів' })
  @ApiParam({ name: 'userId', description: 'ID користувача' })
  getFiveDays(@Param('userId', ParseIntPipe) userId: number) {
    return this.weatherService.getFiveDays(userId);
  }

  @Get(':userId/forecast/today')
  @ApiOperation({ summary: 'Прогноз на сьогодні' })
  getToday(@Param('userId', ParseIntPipe) userId: number) {
    return this.weatherService.getTodayForecast(userId);
  }

  @Get(':userId/forecast/24h')
  @ApiOperation({ summary: 'Прогноз на наступні 24 години' })
  getNext24Hours(@Param('userId', ParseIntPipe) userId: number) {
    return this.weatherService.getNext24Hours(userId);
  }

  @Get(':userId/temp/min')
  @ApiOperation({ summary: 'Мінімальна температура за сьогодні' })
  getMin(@Param('userId', ParseIntPipe) userId: number) {
    return this.weatherService.getTodayMin(userId);
  }

  @Get(':userId/temp/max')
  @ApiOperation({ summary: 'Максимальна температура за сьогодні' })
  getMax(@Param('userId', ParseIntPipe) userId: number) {
    return this.weatherService.getTodayMax(userId);
  }

  @Get(':userId/temp/average')
  @ApiOperation({ summary: 'Середня температура за сьогодні' })
  getAverage(@Param('userId', ParseIntPipe) userId: number) {
    return this.weatherService.getTodayAverage(userId);
  }

  @Get(':userId/rain/probability')
  @ApiOperation({ summary: 'Ймовірність дощу (%)' })
  getRainProbability(@Param('userId', ParseIntPipe) userId: number) {
    return this.weatherService.getRainProbability(userId);
  }

  @Get(':userId/rain/periods')
  @ApiOperation({ summary: 'Періоди, коли очікується дощ' })
  getRainyPeriods(@Param('userId', ParseIntPipe) userId: number) {
    return this.weatherService.getRainyPeriods(userId);
  }

  @Get(':userId/wind/strong')
  @ApiOperation({ summary: 'Інформація про сильний вітер' })
  getStrongWind(@Param('userId', ParseIntPipe) userId: number) {
    return this.weatherService.getStrongWind(userId);
  }

  @Get(':userId/extremes/hottest')
  @ApiOperation({ summary: 'Найгарячіший час за сьогодні' })
  getHottest(@Param('userId', ParseIntPipe) userId: number) {
    return this.weatherService.getHottestTime(userId);
  }

  @Get(':userId/extremes/coldest')
  @ApiOperation({ summary: 'Найхолодніший час за сьогодні' })
  getColdest(@Param('userId', ParseIntPipe) userId: number) {
    return this.weatherService.getColdestTime(userId);
  }

  @Get(':userId/sun')
  @ApiOperation({ summary: 'Час сходу та заходу сонця' })
  getSunTimes(@Param('userId', ParseIntPipe) userId: number) {
    return this.weatherService.getSunTimes(userId);
  }

  @Get(':userId/uv')
  @ApiOperation({ summary: 'Ультрафіолетовий індекс (UV)' })
  getUV(@Param('userId', ParseIntPipe) userId: number) {
    return this.weatherService.getUV(userId);
  }

  @Get(':userId/forecast/7-days')
  @ApiOperation({ summary: 'Прогноз на 7 днів' })
  getSevenDays(@Param('userId', ParseIntPipe) userId: number) {
    return this.weatherService.getSevenDays(userId);
  }

  @Get(':userId/air-quality')
  @ApiOperation({ summary: 'Якість повітря (Air Quality Index)' })
  getAirQuality(@Param('userId', ParseIntPipe) userId: number) {
    return this.weatherService.getAirQuality(userId);
  }

  @Get(':userId/alerts')
  @ApiOperation({ summary: 'Погодні попередження (Alerts)' })
  getAlerts(@Param('userId', ParseIntPipe) userId: number) {
    return this.weatherService.getAlerts(userId);
  }

  @Get(':userId/filter/warmer-than')
  @ApiOperation({ summary: 'Періоди, коли температура вища за вказану' })
  @ApiQuery({
    name: 'temp',
    description: 'Поріг температури (°C)',
    type: Number,
  })
  getWarmerThan(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('temp', ParseIntPipe) temp: number,
  ) {
    return this.weatherService.getWarmerThan(userId, temp);
  }

  @Get(':userId/filter/by-condition')
  @ApiOperation({
    summary: 'Фільтр прогнозів за станом погоди (напр. Rain, Clear)',
  })
  @ApiQuery({
    name: 'condition',
    description: 'Стан погоди (Rain, Clouds, Clear тощо)',
    type: String,
  })
  getByCondition(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('condition') condition: string,
  ) {
    return this.weatherService.getByCondition(userId, condition);
  }

  @Get(':userId/comfortable')
  @ApiOperation({ summary: 'Комфортні періоди для прогулянок' })
  getComfortable(@Param('userId', ParseIntPipe) userId: number) {
    return this.weatherService.getComfortablePeriods(userId);
  }
}
