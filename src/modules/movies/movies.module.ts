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
import { MoviesSeeder } from './seeders/movie.seeder';
import { MovieParserService } from './external/movie.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Movie, MovieDetails])],
  controllers: [MoviesController, MoviesDiscoveryController],
  providers: [MoviesService, MoviesSeeder, MovieParserService],
  exports: [MoviesService],
})
export class MoviesModule {}
