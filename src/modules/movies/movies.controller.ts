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
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { ChangeStatusDto, ManageMovieDto } from './dto/manage-movie.dto';
import { MovieParserService } from './external/movie.service';
import { MovieTypeEnum } from './enums/movie-type.enum';

@ApiTags('Movies - Lists')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post(':list')
  @ApiOperation({ summary: 'Додати фільм у вказаний список' })
  @ApiParam({ name: 'list', enum: MovieTypeEnum })
  @ApiBody({ type: ManageMovieDto })
  add(
    @Req() req,
    @Param('list') list: MovieTypeEnum,
    @Body() dto: ManageMovieDto,
  ) {
    return this.moviesService.addToList(req.user.user_id, list, dto);
  }

  @Get(':list')
  @ApiOperation({ summary: 'Отримати фільми з вказаного списку' })
  @ApiParam({ name: 'list', enum: MovieTypeEnum })
  getList(@Req() req, @Param('list') list: MovieTypeEnum) {
    return this.moviesService.getList(req.user.user_id, list);
  }

  @Patch(':tmdbId/status')
  @ApiOperation({ summary: 'Змінити статус фільму (перемістити)' })
  @ApiParam({ name: 'tmdbId' })
  @ApiBody({ type: ChangeStatusDto })
  changeStatus(
    @Req() req,
    @Param('tmdbId', ParseIntPipe) tmdbId: number,
    @Body() dto: ChangeStatusDto,
  ) {
    return this.moviesService.changeStatus(
      req.user.user_id,
      tmdbId,
      dto.target_list,
    );
  }

  @Delete(':list/:tmdbId')
  @ApiOperation({ summary: 'Видалити фільм зі списку' })
  @ApiParam({ name: 'list', enum: MovieTypeEnum })
  @ApiParam({ name: 'tmdbId' })
  remove(
    @Req() req,
    @Param('list') list: MovieTypeEnum,
    @Param('tmdbId', ParseIntPipe) tmdbId: number,
  ) {
    return this.moviesService.removeFromList(req.user.user_id, list, tmdbId);
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
