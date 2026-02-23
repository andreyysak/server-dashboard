import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutsController } from './workout.controller';
import { WorkoutsService } from './workout.service';

describe('WorkoutsController', () => {
  let controller: WorkoutsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutsController],
      providers: [WorkoutsService],
    }).compile();

    controller = module.get<WorkoutsController>(WorkoutsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
