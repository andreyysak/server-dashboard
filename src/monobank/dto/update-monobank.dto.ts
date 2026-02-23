import { PartialType } from '@nestjs/swagger';
import { CreateMonobankDto } from './create-monobank.dto';

export class UpdateMonobankDto extends PartialType(CreateMonobankDto) {}
