import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesParserService } from './external/series.service';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UpdateSeriesProgressDto } from './dto/update-series.dto';

interface RequestWithUser extends Request {
  user: {
    user_id: number;
    email: string;
  };
}

@ApiTags('Series')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('series')
export class SeriesController {
  constructor(
    private readonly seriesService: SeriesService,
    private readonly seriesParserService: SeriesParserService,
  ) {}

  @Get('favorites')
  @ApiOperation({ summary: 'Get favorite series' })
  async getFavorites(@Req() req: RequestWithUser) {
    return this.seriesService.getFavorites(req.user.user_id);
  }

  @Get('watch-later')
  @ApiOperation({ summary: 'Get watch later series' })
  async getWatchLater(@Req() req: RequestWithUser) {
    return this.seriesService.getWatchLater(req.user.user_id);
  }

  @Get('watched')
  @ApiOperation({ summary: 'Get watched/watching series' })
  async getWatched(@Req() req: RequestWithUser) {
    return this.seriesService.getWatched(req.user.user_id);
  }

  @Post('favorite/:tmdbId')
  @ApiOperation({ summary: 'Toggle favorite series' })
  async toggleFavorite(
    @Req() req: RequestWithUser,
    @Param('tmdbId', ParseIntPipe) tmdbId: number,
  ) {
    return this.seriesService.toggleFavorite(req.user.user_id, tmdbId);
  }

  @Post('watch-later/:tmdbId')
  @ApiOperation({ summary: 'Toggle watch later series' })
  async toggleWatchLater(
    @Req() req: RequestWithUser,
    @Param('tmdbId', ParseIntPipe) tmdbId: number,
  ) {
    return this.seriesService.toggleWatchLater(req.user.user_id, tmdbId);
  }

  @Patch('progress/:tmdbId')
  @ApiOperation({ summary: 'Update series progress' })
  async updateProgress(
    @Req() req: RequestWithUser,
    @Param('tmdbId', ParseIntPipe) tmdbId: number,
    @Body() dto: UpdateSeriesProgressDto,
  ) {
    return this.seriesService.updateProgress(req.user.user_id, tmdbId, dto);
  }

  @Get('details/:tmdbId')
  @ApiOperation({ summary: 'Get local series details' })
  async getDetails(@Param('tmdbId', ParseIntPipe) tmdbId: number) {
    return this.seriesService.getLocalDetails(tmdbId);
  }

  // --- External ---

  @Get('search')
  @ApiOperation({ summary: 'Search series by title in TMDB' })
  @ApiQuery({ name: 'query', description: 'Series title' })
  @ApiQuery({ name: 'lang', required: false, enum: ['en', 'ua'], description: 'Language (default: en)' })
  async search(@Query('query') query: string, @Query('lang') lang?: string) {
    return this.seriesParserService.searchByTitle(query, lang);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending series' })
  @ApiQuery({ name: 'lang', required: false, enum: ['en', 'ua'], description: 'Language (default: en)' })
  async getTrending(@Query('lang') lang?: string) {
    return this.seriesParserService.getTrending('week', lang);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular series' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'lang', required: false, enum: ['en', 'ua'], description: 'Language (default: en)' })
  async getPopular(@Query('page') page?: number, @Query('lang') lang?: string) {
    return this.seriesParserService.getPopular(page || 1, lang);
  }

  @Get('on-the-air')
  @ApiOperation({ summary: 'Get series on the air' })
  @ApiQuery({ name: 'lang', required: false, enum: ['en', 'ua'], description: 'Language (default: en)' })
  async getOnTheAir(@Query('lang') lang?: string) {
    return this.seriesParserService.getOnTheAir(lang);
  }

  @Get('tmdb-details/:tmdbId')
  @ApiOperation({ summary: 'Get full series details from TMDB' })
  @ApiQuery({ name: 'lang', required: false, enum: ['en', 'ua'], description: 'Language (default: en)' })
  async getExternalDetails(@Param('tmdbId', ParseIntPipe) tmdbId: number, @Query('lang') lang?: string) {
    return this.seriesParserService.getById(tmdbId, lang);
  }

  @Get('tmdb-credits/:tmdbId')
  @ApiOperation({ summary: 'Get series credits from TMDB' })
  @ApiQuery({ name: 'lang', required: false, enum: ['en', 'ua'], description: 'Language (default: en)' })
  async getCredits(@Param('tmdbId', ParseIntPipe) tmdbId: number, @Query('lang') lang?: string) {
    return this.seriesParserService.getSeriesCredits(tmdbId, lang);
  }
}
