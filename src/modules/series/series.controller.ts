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
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { SeriesStatus } from './enums/series-status.enum';
import { UpdateSeriesProgressDto } from './dto/update-series.dto';
import { SeriesSeeder } from './seeders/series.seeder';

@ApiTags('Series')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('series')
export class SeriesController {
  constructor(
    private readonly seriesService: SeriesService,
    private readonly seriesSeeder: SeriesSeeder,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Додати серіал у список' })
  create(@Req() req, @Body() dto: CreateSeriesDto) {
    return this.seriesService.addToList(req.user.user_id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати всі серіали' })
  findAll(@Req() req, @Query('status') status?: SeriesStatus) {
    return this.seriesService.findAll(req.user.user_id, status);
  }

  @Get('search')
  @ApiOperation({ summary: 'Пошук серіалу за назвою' })
  search(@Req() req, @Query('title') title: string) {
    return this.seriesService.searchByTitle(req.user.user_id, title);
  }

  @Patch(':id/progress')
  @ApiOperation({ summary: 'Оновити прогрес перегляду (сезон/серія/оцінка)' })
  updateProgress(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSeriesProgressDto,
  ) {
    return this.seriesService.updateProgress(req.user.user_id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити серіал зі списку' })
  remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.seriesService.remove(req.user.user_id, id);
  }

  @Post('seed')
  async seed(@Req() req) {
    return await this.seriesSeeder.seed(req.user.user_id);
  }
}
