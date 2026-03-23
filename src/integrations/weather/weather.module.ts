import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { WeatherService } from './weather.service';
import { OpenWeatherClient } from './clients/open-weather.client';
import { User } from '../../modules/user/entities/user.entity';
import { WeatherController } from './weather.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HttpModule, ConfigModule],
  providers: [WeatherService, OpenWeatherClient],
  controllers: [WeatherController],
  exports: [WeatherService],
})
export class WeatherModule {}
