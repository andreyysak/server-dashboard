import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { Series } from './entities/series.entity';
import { SeriesDetails } from './entities/series-details.entity';
import {SeriesSeeder} from "./seeders/series.seeder";

@Module({
  imports: [
    TypeOrmModule.forFeature([Series, SeriesDetails]),
  ],
  controllers: [SeriesController],
  providers: [SeriesService],
  exports: [SeriesService, SeriesSeeder],
})
export class SeriesModule {}