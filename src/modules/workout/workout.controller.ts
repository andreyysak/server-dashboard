import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { WorkoutsService } from './workout.service';
import { WorkoutsSeeder } from './seeders/workout.seeder';

@ApiTags('Workouts')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('workouts')
export class WorkoutsController {
  constructor(
    private readonly workoutsService: WorkoutsService,
    private readonly workoutsSeeder: WorkoutsSeeder,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Зберегти нове тренування' })
  create(@Req() req, @Body() dto: CreateWorkoutDto) {
    return this.workoutsService.create(req.user.user_id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати всі тренування користувача' })
  findAll(@Req() req) {
    return this.workoutsService.findAll(req.user.user_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Деталі конкретного тренування' })
  findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.workoutsService.findOne(req.user.user_id, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити тренування' })
  remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.workoutsService.remove(req.user.user_id, id);
  }

  @Post('seed')
  async seed(@Req() req) {
    return await this.workoutsSeeder.seed(req.user.user_id);
  }
}
