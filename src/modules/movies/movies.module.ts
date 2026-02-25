import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { MoviesService } from './movies.service';
import {
  MoviesController,
  MoviesDiscoveryController,
} from './movies.controller';
import { Movie } from './entities/movie.entity';
import { MovieDetails } from './entities/movie-details.entity';
import { MovieWatchedEntity } from './entities/movie-watched.entity';
import { MovieParserService } from './external/movie.service';
import { MovieFavorite } from './entities/movie-favorites.entity';
import { MovieWatchLater } from './entities/movie_watch_later.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      Movie,
      MovieDetails,
      MovieFavorite,
      MovieWatchedEntity,
      MovieWatchLater,
    ]),
  ],
  controllers: [MoviesController, MoviesDiscoveryController],
  providers: [MoviesService, MovieParserService],
  exports: [MoviesService],
})
export class MoviesModule {}
