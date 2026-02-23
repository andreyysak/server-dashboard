import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MonobankService } from './monobank.service';
import { CreateMonobankDto } from './dto/create-monobank.dto';
import { UpdateMonobankDto } from './dto/update-monobank.dto';

@Controller('monobank')
export class MonobankController {
  constructor(private readonly monobankService: MonobankService) {}

  @Post()
  create(@Body() createMonobankDto: CreateMonobankDto) {
    return this.monobankService.create(createMonobankDto);
  }

  @Get()
  findAll() {
    return this.monobankService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.monobankService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMonobankDto: UpdateMonobankDto) {
    return this.monobankService.update(+id, updateMonobankDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.monobankService.remove(+id);
  }
}
