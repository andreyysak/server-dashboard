import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { NoteBlockService } from './note-block.service';
import { NoteBlockDto } from './dto/create-note.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Note Blocks')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('notes/:noteId/blocks')
export class NoteBlockController {
  constructor(private readonly blockService: NoteBlockService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new block to a note' })
  create(@Param('noteId', ParseIntPipe) noteId: number, @Body() dto: NoteBlockDto) {
    return this.blockService.create(noteId, dto);
  }

  @Patch('reorder')
  @ApiOperation({ summary: 'Reorder blocks in a note' })
  reorder(@Param('noteId', ParseIntPipe) noteId: number, @Body('blockIds') blockIds: number[]) {
    return this.blockService.reorder(noteId, blockIds);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific block content' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<NoteBlockDto>) {
    return this.blockService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a block from a note' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.blockService.remove(id);
  }
}
