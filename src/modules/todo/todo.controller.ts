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
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoFiltersDto } from './dto/todo-filters.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Todos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new todo/task' })
  create(@Req() req, @Body() dto: CreateTodoDto) {
    return this.todoService.create(req.user.user_id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get todos with filters' })
  findAll(@Req() req, @Query() filters: TodoFiltersDto) {
    return this.todoService.findAll(req.user.user_id, filters);
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get task tree' })
  getTree(@Req() req) {
    return this.todoService.getTree(req.user.user_id);
  }

  @Post('bulk-complete')
  @ApiOperation({ summary: 'Mark multiple tasks as completed' })
  @ApiBody({ schema: { type: 'object', properties: { ids: { type: 'array', items: { type: 'number' } } } } })
  bulkComplete(@Req() req, @Body('ids') ids: number[]) {
    return this.todoService.bulkComplete(req.user.user_id, ids);
  }

  @Post('bulk-delete')
  @ApiOperation({ summary: 'Soft delete multiple tasks' })
  @ApiBody({ schema: { type: 'object', properties: { ids: { type: 'array', items: { type: 'number' } } } } })
  bulkDelete(@Req() req, @Body('ids') ids: number[]) {
    return this.todoService.bulkDelete(req.user.user_id, ids);
  }

  @Patch(':id/pin')
  @ApiOperation({ summary: 'Pin a task' })
  pin(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.todoService.update(req.user.user_id, id, { is_pinned: true });
  }

  @Patch(':id/unpin')
  @ApiOperation({ summary: 'Unpin a task' })
  unpin(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.todoService.update(req.user.user_id, id, { is_pinned: false });
  }

  @Get(':id/activities')
  @ApiOperation({ summary: 'Get history of changes for a task' })
  getActivities(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.todoService.getActivities(req.user.user_id, id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get todo details' })
  findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.todoService.update(req.user.user_id, id, {}); 
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update todo' })
  update(@Req() req, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTodoDto) {
    return this.todoService.update(req.user.user_id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a task' })
  remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.todoService.remove(req.user.user_id, id);
  }
}
