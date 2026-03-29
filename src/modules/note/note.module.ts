import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteService } from './note.service';
import { NoteBlockService } from './note-block.service';
import { NoteController } from './note.controller';
import { NoteBlockController } from './note-block.controller';
import { Note } from './entities/note.entity';
import { NoteBlock } from './entities/note-block.entity';
import { Tag } from './entities/tag.entity';
import { NoteVersion } from './entities/note-version.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Note, NoteBlock, Tag, NoteVersion])],
  controllers: [NoteController, NoteBlockController],
  providers: [NoteService, NoteBlockService],
  exports: [NoteService],
})
export class NoteModule {}
