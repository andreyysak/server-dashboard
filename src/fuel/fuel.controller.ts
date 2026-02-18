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
import { FuelService } from './fuel.service';
import { CreateFuelDto } from './dto/create-fuel.dto';
import { UpdateFuelDto } from './dto/update-fuel.dto';

@ApiTags('Fuel')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('fuel')
export class FuelController {
  constructor(private readonly fuelService: FuelService) {}

  @Post()
  @ApiOperation({ summary: 'Додати запис про заправку' })
  async create(@Req() req, @Body() createFuelDto: CreateFuelDto) {
    return await this.fuelService.createFuel(req.user.user_id, createFuelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати всі заправки (можна фільтрувати за carId)' })
  async findAll(@Req() req, @Query('carId') carId?: number) {
    return await this.fuelService.getAll(req.user.user_id, carId ? Number(carId) : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати деталі конкретної заправки' })
  async findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return await this.fuelService.getOne(req.user.user_id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити дані про заправку' })
  async update(
      @Req() req,
      @Param('id', ParseIntPipe) id: number,
      @Body() updateFuelDto: UpdateFuelDto
  ) {
    return await this.fuelService.updateFuel(req.user.user_id, id, updateFuelDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити запис про заправку' })
  async remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return await this.fuelService.deleteFull(req.user.user_id, id);
  }
}