import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
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
  constructor(private readonly moviesService: MoviesService) {}

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
}
