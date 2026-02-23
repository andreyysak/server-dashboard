import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { Movie } from './entities/movie.entity';
import { MovieDetails } from './entities/movie-details.entity';
import {MoviesSeeder} from "./seeders/movie.seeder";

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie, MovieDetails]),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService, MoviesSeeder],
})
export class MoviesModule {}