import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
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
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { MaintenanceSeeder } from './seeders/maintenance.seeder';

@ApiTags('Vehicle Maintenance') // Групуємо для зручності
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('maintenance')
export class MaintenanceController {
  constructor(
    private readonly maintenanceService: MaintenanceService,
    private readonly maintenanceSeeder: MaintenanceSeeder,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Створити запис про технічне обслуговування' })
  @ApiResponse({ status: 201, description: 'Запис успішно створено' })
  create(@Req() req, @Body() dto: CreateMaintenanceDto) {
    return this.maintenanceService.create(req.user.user_id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати всі записи ТО' })
  @ApiQuery({
    name: 'carId',
    required: false,
    description: 'Фільтрація по конкретному автомобілю',
  })
  @ApiResponse({ status: 200, description: 'Список записів отримано' })
  findAll(@Req() req, @Query('carId') carId?: string) {
    return this.maintenanceService.findAll(
      req.user.user_id,
      carId ? +carId : undefined,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Деталі конкретного ТО' })
  @ApiParam({ name: 'id', description: 'ID запису обслуговування' })
  findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.maintenanceService.findOne(req.user.user_id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити дані про ТО' })
  @ApiParam({ name: 'id', description: 'ID запису обслуговування' })
  update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMaintenanceDto,
  ) {
    return this.maintenanceService.update(req.user.user_id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити запис про ТО' })
  @ApiParam({ name: 'id', description: 'ID запису обслуговування' })
  @ApiResponse({ status: 200, description: 'Запис успішно видалено' })
  remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.maintenanceService.remove(req.user.user_id, id);
  }

  @Post('seed')
  @ApiOperation({
    summary: 'Генерація тестових даних ТО',
    description: 'Створює випадкові записи про сервіс для авто користувача',
  })
  async seed(@Req() req) {
    return await this.maintenanceSeeder.seed(req.user.user_id);
  }
}
