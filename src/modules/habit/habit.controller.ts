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
import { HabitService } from './habit.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Habits')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('habits')
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new habit' })
  create(@Req() req, @Body() createHabitDto: CreateHabitDto) {
    return this.habitService.create(req.user.user_id, createHabitDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user habits with pagination and category filter' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Req() req,
    @Query('isActive') isActive?: boolean,
    @Query('categoryId') categoryId?: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.habitService.findAll(req.user.user_id, { isActive, categoryId, page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get habit details' })
  findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.habitService.findOne(req.user.user_id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update habit' })
  update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHabitDto: UpdateHabitDto,
  ) {
    return this.habitService.update(req.user.user_id, id, updateHabitDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete habit' })
  remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.habitService.remove(req.user.user_id, id);
  }
}
