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
import { HabitCategoryService } from './habit-category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Habit Categories')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('habit-categories')
export class HabitCategoryController {
  constructor(private readonly categoryService: HabitCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new habit category' })
  create(@Req() req, @Body() dto: CreateCategoryDto) {
    return this.categoryService.create(req.user.user_id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user habit categories' })
  findAll(@Req() req) {
    return this.categoryService.findAll(req.user.user_id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a habit category' })
  remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(req.user.user_id, id);
  }
}
