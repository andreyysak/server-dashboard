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
import { TodoCategoryService } from './todo-category.service';
import { CreateCategoryDto } from '../habit/dto/create-category.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Todo Categories')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('todo-categories')
export class TodoCategoryController {
  constructor(private readonly categoryService: TodoCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new todo category' })
  create(@Req() req, @Body() dto: CreateCategoryDto) {
    return this.categoryService.create(req.user.user_id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user todo categories' })
  findAll(@Req() req) {
    return this.categoryService.findAll(req.user.user_id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(req.user.user_id, id);
  }
}
