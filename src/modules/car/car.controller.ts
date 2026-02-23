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
  ParseIntPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import {CarsSeeder} from "./seeders/car.seeder";

@ApiTags('Cars')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('cars')
export class CarController {
  constructor(
      private readonly carService: CarService,
      private readonly carSeeder: CarsSeeder,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Додати новий автомобіль' })
  async create(@Req() req, @Body() createCarDto: CreateCarDto) {
    console.log('User from request:', req.user); // Подивись у консоль сервера!
    return await this.carService.create(req.user.user_id, createCarDto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати список усіх моїх авто' })
  async findAll(@Req() req) {
    return await this.carService.findAll(req.user.user_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати детальну інформацію про авто' })
  async findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return await this.carService.findOne(req.user.user_id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити дані автомобіля' })
  async update(
      @Req() req,
      @Param('id', ParseIntPipe) id: number,
      @Body() updateCarDto: UpdateCarDto
  ) {
    return await this.carService.update(req.user.user_id, id, updateCarDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити автомобіль із бази' })
  async remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return await this.carService.remove(req.user.user_id, id);
  }

  @Post('seed')
  async seed(@Req() req) {
    return await this.carSeeder.seed(req.user.user_id);
  }
}