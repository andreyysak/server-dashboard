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
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteFiltersDto } from './dto/note-filters.dto';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Notes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  create(@Req() req, @Body() dto: CreateNoteDto) {
    return this.noteService.create(req.user.user_id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notes with filters' })
  @ApiQuery({ name: 'isTrash', required: false, type: Boolean })
  findAll(@Req() req, @Query() filters: NoteFiltersDto & { isTrash?: boolean }) {
    return this.noteService.findAll(req.user.user_id, filters);
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get hierarchical tree of notes' })
  getTree(@Req() req) {
    return this.noteService.getTree(req.user.user_id);
  }

  @Patch(':id/trash')
  @ApiOperation({ summary: 'Move note to trash (soft delete)' })
  trash(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.noteService.trash(req.user.user_id, id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore note from trash' })
  restore(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.noteService.restore(req.user.user_id, id);
  }

  @Patch(':id/favorite')
  @ApiOperation({ summary: 'Toggle favorite status' })
  toggleFavorite(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.noteService.toggleFavorite(req.user.user_id, id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single note details' })
  findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.noteService.findOne(req.user.user_id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update note (collaborative lock enabled)' })
  update(@Req() req, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNoteDto) {
    return this.noteService.update(req.user.user_id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Permanently delete a note' })
  remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.noteService.remove(req.user.user_id, id);
  }
}
