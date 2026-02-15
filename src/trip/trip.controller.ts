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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@ApiTags('Trips')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  @ApiOperation({ summary: 'Створити нову поїздку' })
  async create(@Req() req, @Body() createTripDto: CreateTripDto) {
    return await this.tripService.createTrip(req.user.user_id, createTripDto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати всі поїздки (можна фільтрувати за carId)' })
  async findAll(
      @Req() req,
      @Query('carId') carId?: number
  ) {
    return await this.tripService.getAllTrips(req.user.user_id, carId ? Number(carId) : undefined);
  }

  @Get('directions')
  @ApiOperation({ summary: 'Отримати список унікальних напрямків' })
  async getDirections(
      @Req() req,
      @Query('carId') carId?: number
  ) {
    return await this.tripService.getTripDirections(req.user.user_id, carId ? Number(carId) : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати деталі конкретної поїздки' })
  async findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return await this.tripService.getTrip(req.user.user_id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити дані поїздки' })
  async update(
      @Req() req,
      @Param('id', ParseIntPipe) id: number,
      @Body() updateTripDto: UpdateTripDto
  ) {
    return await this.tripService.updateTrip(req.user.user_id, id, updateTripDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити поїздку' })
  async remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return await this.tripService.deleteTrip(req.user.user_id, id);
  }
}