import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieStatusDto } from './dto/update-movie.dto';
import { MovieStatus } from './enums/movie-status.enum';
import { MoviesSeeder } from './seeders/movie.seeder';
import { MovieParserService } from './external/movie.service';

@ApiTags('Movies')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('movies')
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly moviesSeeder: MoviesSeeder,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Додати фільм у список' })
  create(@Req() req, @Body() dto: CreateMovieDto) {
    return this.moviesService.addToList(req.user.user_id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати список усіх фільмів користувача' })
  @ApiQuery({ name: 'status', enum: MovieStatus, required: false })
  findAll(@Req() req, @Query('status') status?: MovieStatus) {
    return this.moviesService.findAll(req.user.user_id, status);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Отримати статистику фільмів' })
  getStats(@Req() req) {
    return this.moviesService.getStats(req.user.user_id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Пошук по назві у власному списку' })
  @ApiQuery({ name: 'title', type: String })
  search(@Req() req, @Query('title') title: string) {
    return this.moviesService.searchByTitle(req.user.user_id, title);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати деталі фільму по ID' })
  findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(req.user.user_id, id);
  }

  @Patch(':id/watched')
  @ApiOperation({ summary: 'Відмітити як переглянуте та поставити оцінку' })
  markAsWatched(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMovieStatusDto,
  ) {
    return this.moviesService.markAsWatched(req.user.user_id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити фільм зі списку' })
  remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.moviesService.remove(req.user.user_id, id);
  }

  @Post('seed')
  async seed(@Req() req) {
    return await this.moviesSeeder.seed(req.user.user_id);
  }
}

@ApiTags('Movies - Discovery (External TMDB)')
@Controller('movies/discovery')
export class MoviesDiscoveryController {
  constructor(private readonly tmdbService: MovieParserService) {}

  @Get('search')
  @ApiOperation({ summary: 'Пошук фільму в глобальній базі TMDB за назвою' })
  @ApiQuery({
    name: 'query',
    description: 'Назва фільму (напр. Inception)',
    required: true,
  })
  search(@Query('query') query: string) {
    return this.tmdbService.searchByTitle(query);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Тренди кіно (за тиждень або за день)' })
  @ApiQuery({ name: 'timeWindow', enum: ['day', 'week'], required: false })
  getTrending(@Query('timeWindow') timeWindow: 'day' | 'week' = 'week') {
    return this.tmdbService.getTrending(timeWindow);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Найпопулярніші фільми зараз' })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  getPopular(@Query('page') page: number = 1) {
    return this.tmdbService.getPopular(page);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Новинки, які скоро вийдуть на екрани' })
  @ApiQuery({
    name: 'months',
    description: 'Період у місяцях',
    required: false,
    example: 1,
  })
  getUpcoming(@Query('months') months: number = 1) {
    return this.tmdbService.getUpcoming(months);
  }

  @Get(':tmdbId')
  @ApiOperation({
    summary: 'Отримати повні деталі фільму (включаючи акторів та відео)',
  })
  @ApiParam({ name: 'tmdbId', description: 'ID фільму в системі TMDB' })
  getById(@Param('tmdbId', ParseIntPipe) tmdbId: number) {
    return this.tmdbService.getById(tmdbId);
  }

  @Get(':tmdbId/credits')
  @ApiOperation({
    summary: 'Отримати тільки список акторів та знімальну групу',
  })
  getCredits(@Param('tmdbId', ParseIntPipe) tmdbId: number) {
    return this.tmdbService.getMovieCredits(tmdbId);
  }
}
