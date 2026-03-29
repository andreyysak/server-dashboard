import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoteBlock } from './entities/note-block.entity';
import { NoteBlockDto } from './dto/create-note.dto';

@Injectable()
export class NoteBlockService {
  constructor(
    @InjectRepository(NoteBlock)
    private readonly blockRepo: Repository<NoteBlock>,
  ) {}

  async create(noteId: number, dto: NoteBlockDto): Promise<NoteBlock> {
    const block = this.blockRepo.create({ ...dto, note_id: noteId });
    return await this.blockRepo.save(block);
  }

  async update(id: number, dto: Partial<NoteBlockDto>): Promise<NoteBlock> {
    const block = await this.blockRepo.findOne({ where: { block_id: id } });
    if (!block) throw new NotFoundException('Block not found');
    Object.assign(block, dto);
    return await this.blockRepo.save(block);
  }

  async reorder(noteId: number, blockIds: number[]): Promise<void> {
    for (let i = 0; i < blockIds.length; i++) {
      await this.blockRepo.update({ block_id: blockIds[i], note_id: noteId }, { order: i });
    }
  }

  async remove(id: number): Promise<void> {
    await this.blockRepo.delete(id);
  }
}
