import { Test, TestingModule } from '@nestjs/testing';
import { PaycardsController } from './paycards.controller';
import { PaycardsService } from './paycards.service';

describe('PaycardsController', () => {
  let controller: PaycardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaycardsController],
      providers: [PaycardsService],
    }).compile();

    controller = module.get<PaycardsController>(PaycardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
