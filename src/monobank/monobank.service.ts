import { Injectable } from '@nestjs/common';
import { CreateMonobankDto } from './dto/create-monobank.dto';
import { UpdateMonobankDto } from './dto/update-monobank.dto';

@Injectable()
export class MonobankService {
  create(createMonobankDto: CreateMonobankDto) {
    return 'This action adds a new monobank';
  }

  findAll() {
    return `This action returns all monobank`;
  }

  findOne(id: number) {
    return `This action returns a #${id} monobank`;
  }

  update(id: number, updateMonobankDto: UpdateMonobankDto) {
    return `This action updates a #${id} monobank`;
  }

  remove(id: number) {
    return `This action removes a #${id} monobank`;
  }
}
