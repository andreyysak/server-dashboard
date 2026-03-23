import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MovieParserService } from './external/movie.service'; // Імпортуємо парсер
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

interface RequestWithUser extends Request {
  user: {
    user_id: number;
    email: string;
  };
}

@ApiTags('Movies')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('movies')
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly movieParserService: MovieParserService, // Додаємо парсер у конструктор
  ) {}

  // --- ЛОКАЛЬНІ СПИСКИ КОРИСТУВАЧА ---

  @Get('favorites')
  @ApiOperation({ summary: 'Отримати список улюблених фільмів' })
  async getFavorites(@Req() req: RequestWithUser) {
    return this.moviesService.getFavoriteMovies(req.user.user_id);
  }

  @Get('watched')
  @ApiOperation({ summary: 'Отримати список переглянутих фільмів' })
  async getWatched(@Req() req: RequestWithUser) {
    return this.moviesService.getWatchedMovies(req.user.user_id);
  }

  @Get('watch-later')
  @ApiOperation({ summary: 'Отримати список "Подивитися пізніше"' })
  async getWatchLater(@Req() req: RequestWithUser) {
    return this.moviesService.getWatchLaterMovies(req.user.user_id);
  }

  @Post('favorite/:tmdbId')
  @ApiOperation({ summary: 'Додати/видалити з улюблених (Toggle)' })
  async toggleFavorite(
    @Req() req: RequestWithUser,
    @Param('tmdbId', ParseIntPipe) tmdbId: number,
  ) {
    return this.moviesService.toggleFavorite(req.user.user_id, tmdbId);
  }

  @Post('watched/:tmdbId')
  @ApiOperation({ summary: 'Позначити як переглянуте/непереглянуте (Toggle)' })
  async toggleWatched(
    @Req() req: RequestWithUser,
    @Param('tmdbId', ParseIntPipe) tmdbId: number,
  ) {
    return this.moviesService.toggleWatched(req.user.user_id, tmdbId);
  }

  @Post('watch-later/:tmdbId')
  @ApiOperation({ summary: 'Додати/видалити з "Подивитися пізніше" (Toggle)' })
  async toggleWatchLater(
    @Req() req: RequestWithUser,
    @Param('tmdbId', ParseIntPipe) tmdbId: number,
  ) {
    return this.moviesService.toggleWatchLater(req.user.user_id, tmdbId);
  }

  @Get('details/:tmdbId')
  @ApiOperation({ summary: 'Деталі фільму з локальної бази' })
  async getDetails(@Param('tmdbId', ParseIntPipe) tmdbId: number) {
    return this.moviesService.getLocalMovieDetails(tmdbId);
  }

  // --- ЗОВНІШНІЙ ПОШУК (TMDB) ---

  @Get('search')
  @ApiOperation({ summary: 'Пошук фільмів за назвою в TMDB' })
  @ApiQuery({ name: 'query', description: 'Назва фільму' })
  @ApiQuery({ name: 'lang', required: false, enum: ['en', 'ua'], description: 'Language (default: en)' })
  async search(@Query('query') query: string, @Query('lang') lang?: string) {
    return this.movieParserService.searchByTitle(query, lang);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Трендові фільми тижня' })
  @ApiQuery({ name: 'lang', required: false, enum: ['en', 'ua'], description: 'Language (default: en)' })
  async getTrending(@Query('lang') lang?: string) {
    return this.movieParserService.getTrending('week', lang);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Популярні фільми' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'lang', required: false, enum: ['en', 'ua'], description: 'Language (default: en)' })
  async getPopular(@Query('page') page?: number, @Query('lang') lang?: string) {
    return this.movieParserService.getPopular(page || 1, lang);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Очікувані новинки' })
  @ApiQuery({ name: 'lang', required: false, enum: ['en', 'ua'], description: 'Language (default: en)' })
  async getUpcoming(@Query('lang') lang?: string) {
    return this.movieParserService.getUpcoming(1, lang);
  }

  @Get('tmdb-details/:tmdbId')
  @ApiOperation({
    summary:
      'Отримати повні деталі фільму прямо з TMDB (включаючи акторів та відео)',
  })
  @ApiQuery({ name: 'lang', required: false, enum: ['en', 'ua'], description: 'Language (default: en)' })
  async getExternalDetails(@Param('tmdbId', ParseIntPipe) tmdbId: number, @Query('lang') lang?: string) {
    return this.movieParserService.getById(tmdbId, lang);
  }

  @Get('tmdb-credits/:tmdbId')
  @ApiOperation({
    summary: 'Отримати тільки список акторів та знімальної групи з TMDB',
  })
  @ApiQuery({ name: 'lang', required: false, enum: ['en', 'ua'], description: 'Language (default: en)' })
  async getMovieCredits(@Param('tmdbId', ParseIntPipe) tmdbId: number, @Query('lang') lang?: string) {
    return this.movieParserService.getMovieCredits(tmdbId, lang);
  }
}
