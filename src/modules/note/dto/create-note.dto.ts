import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NoteBlockType } from '../enums/block-type.enum';

export class NoteBlockDto {
  @ApiProperty({ enum: NoteBlockType, example: NoteBlockType.TEXT })
  @IsEnum(NoteBlockType)
  type: NoteBlockType;

  @ApiProperty({ example: { text: 'Hello world' } })
  @IsNotEmpty()
  content: any;

  @ApiProperty({ example: 0 })
  @IsNumber()
  @IsOptional()
  order?: number;
}

export class CreateNoteDto {
  @ApiProperty({ example: 'My Meeting Notes' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Summary of the meeting...', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ example: 1, description: 'Parent note/folder ID', required: false })
  @IsNumber()
  @IsOptional()
  parent_id?: number;

  @ApiProperty({ type: [NoteBlockDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NoteBlockDto)
  @IsOptional()
  blocks?: NoteBlockDto[];

  @ApiProperty({ example: ['work', 'important'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
