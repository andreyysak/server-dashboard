import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  ParseIntPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieStatusDto } from './dto/update-movie.dto';
import { MovieStatus } from './enums/movie-status.enum';

@ApiTags('Movies')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

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
}