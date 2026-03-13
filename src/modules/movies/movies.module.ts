import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; // Обов'язково додаємо цей імпорт
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { MovieParserService } from './external/movie.service';

// Ентіті
import { Movie } from './entities/movie.entity';
import { MovieDetails } from './entities/movie-details.entity';
import { MovieWatched } from './entities/movie-watched.entity';
import { MovieFavorite } from './entities/movie-favorites.entity';
import { MovieWatchLater } from './entities/movie_watch_later.entity';

// Модуль користувача (для розірвання циклічної залежності)
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    // 1. Додаємо HttpModule, щоб HttpService став доступним для MovieParserService
    HttpModule,

    // 2. Додаємо ConfigModule, щоб ConfigService був доступний
    ConfigModule,

    // 3. Реєструємо всі репозиторії
    TypeOrmModule.forFeature([
      Movie,
      MovieDetails,
      MovieWatched,
      MovieFavorite,
      MovieWatchLater,
    ]),

    // 4. Використовуємо forwardRef для зв'язку з UserModule
    forwardRef(() => UserModule),
  ],
  controllers: [MoviesController],
  providers: [MoviesService, MovieParserService],
  exports: [
    MoviesService,
    MovieParserService, // Експортуємо, якщо він знадобиться в інших модулях
  ],
})
export class MoviesModule {}
