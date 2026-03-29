import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository, Repository, In, ILike } from 'typeorm';
import { Note } from './entities/note.entity';
import { Tag } from './entities/tag.entity';
import { NoteVersion } from './entities/note-version.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteFiltersDto } from './dto/note-filters.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepo: Repository<Note>,
    @InjectRepository(Note)
    private readonly noteTreeRepo: TreeRepository<Note>,
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
    @InjectRepository(NoteVersion)
    private readonly versionRepo: Repository<NoteVersion>,
  ) {}

  private async getOrCreateTags(names?: string[]): Promise<Tag[]> {
    if (!names || names.length === 0) return [];
    const tags: Tag[] = [];
    for (const name of names) {
      let tag = await this.tagRepo.findOne({ where: { name } });
      if (!tag) {
        tag = this.tagRepo.create({ name });
        tag = await this.tagRepo.save(tag);
      }
      tags.push(tag);
    }
    return tags;
  }

  private async createVersion(noteId: number) {
    const note = await this.noteRepo.findOne({
      where: { note_id: noteId },
      relations: ['blocks', 'tags'],
    });
    if (note) {
      const version = this.versionRepo.create({ note_id: noteId, snapshot: note });
      await this.versionRepo.save(version);
    }
  }

  async create(userId: number, dto: CreateNoteDto): Promise<Note> {
    const note = this.noteRepo.create({
      ...dto,
      user_id: userId,
      tags: await this.getOrCreateTags(dto.tags),
    });

    if (dto.parent_id) {
      const parent = await this.noteRepo.findOne({ where: { note_id: dto.parent_id, user_id: userId } });
      if (!parent) throw new NotFoundException('Parent folder not found');
      note.parent = parent;
    }

    return await this.noteRepo.save(note);
  }

  async update(userId: number, id: number, dto: UpdateNoteDto): Promise<Note> {
    const note = await this.noteRepo.findOne({
      where: { note_id: id, user_id: userId },
      relations: ['tags'],
    });
    if (!note) throw new NotFoundException('Note not found');

    // Create a version before update
    await this.createVersion(id);

    if (dto.tags) note.tags = await this.getOrCreateTags(dto.tags);

    if (dto.parent_id !== undefined) {
      if (dto.parent_id === null) note.parent = null;
      else {
        const parent = await this.noteRepo.findOne({ where: { note_id: dto.parent_id, user_id: userId } });
        if (parent) note.parent = parent;
      }
    }

    Object.assign(note, dto);

    try {
      return await this.noteRepo.save(note);
    } catch (error) {
      if (error.name === 'OptimisticLockCanNotBeAppliedError') {
        throw new ConflictException('The note was modified by another user. Please refresh.');
      }
      throw error;
    }
  }

  async findOne(userId: number, id: number): Promise<Note> {
    const note = await this.noteRepo.findOne({
      where: { note_id: id, user_id: userId },
      relations: ['blocks', 'tags', 'children'],
      withDeleted: true,
    });
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  async findAll(userId: number, filters: any) {
    const query = this.noteRepo.createQueryBuilder('note')
      .leftJoinAndSelect('note.tags', 'tag')
      .where('note.user_id = :userId', { userId });

    if (filters.isTrash) {
      query.withDeleted().andWhere('note.deleted_at IS NOT NULL');
    } else {
      query.andWhere('note.is_archived = :archived', { archived: filters.isArchived || false });
    }

    if (filters.isPinned !== undefined) query.andWhere('note.is_pinned = :pinned', { pinned: filters.isPinned });
    if (filters.isFavorite !== undefined) query.andWhere('note.is_favorite = :fav', { fav: filters.isFavorite });
    if (filters.tag) query.andWhere('tag.name = :tag', { tag: filters.tag });

    if (filters.search) {
      query.andWhere('(note.title ILIKE :search OR note.content ILIKE :search)', { search: `%${filters.search}%` });
    }

    query.orderBy(filters.sortBy === 'createdAt' ? 'note.created_at' : 'note.updated_at', filters.sortOrder || 'DESC');

    const [items, total] = await query.skip(((filters.page || 1) - 1) * (filters.limit || 20)).take(filters.limit || 20).getManyAndCount();
    return { items, total, page: filters.page || 1, limit: filters.limit || 20 };
  }

  async getTree(userId: number): Promise<Note[]> {
    const roots = await this.noteTreeRepo.findRoots();
    const userRoots = roots.filter(r => r.user_id === userId);
    
    const results: Note[] = [];
    for (const root of userRoots) {
      results.push(await this.noteTreeRepo.findDescendantsTree(root));
    }
    return results;
  }

  async trash(userId: number, id: number): Promise<void> {
    const note = await this.findOne(userId, id);
    await this.noteRepo.softRemove(note);
  }

  async restore(userId: number, id: number): Promise<Note> {
    const note = await this.findOne(userId, id);
    return await this.noteRepo.recover(note);
  }

  async toggleFavorite(userId: number, id: number): Promise<Note> {
    const note = await this.findOne(userId, id);
    note.is_favorite = !note.is_favorite;
    return await this.noteRepo.save(note);
  }

  async remove(userId: number, id: number): Promise<void> {
    const note = await this.findOne(userId, id);
    await this.noteRepo.remove(note);
  }
}
