import { Test, TestingModule } from '@nestjs/testing';
import { MonobankController } from './monobank.controller';
import { MonobankService } from './monobank.service';

describe('MonobankController', () => {
  let controller: MonobankController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonobankController],
      providers: [MonobankService],
    }).compile();

    controller = module.get<MonobankController>(MonobankController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
