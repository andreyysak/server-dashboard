import { PartialType } from '@nestjs/swagger';
import { CreateNoteDto } from './create-note.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  is_archived?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  is_pinned?: boolean;
}
