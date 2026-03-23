import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { SeriesParserService } from './external/series.service';
import { Series } from './entities/series.entity';
import { SeriesDetails } from './entities/series-details.entity';
import { SeriesFavorite } from './entities/series-favorites.entity';
import { SeriesWatchLater } from './entities/series-watch-later.entity';
import { SeriesWatched } from './entities/series-watched.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Series,
      SeriesDetails,
      SeriesFavorite,
      SeriesWatchLater,
      SeriesWatched,
    ]),
    HttpModule,
    ConfigModule,
  ],
  controllers: [SeriesController],
  providers: [SeriesService, SeriesParserService],
  exports: [SeriesService],
})
export class SeriesModule {}
