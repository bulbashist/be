import { Test, TestingModule } from '@nestjs/testing';
import { PaycardsService } from './paycards.service';

describe('PaycardsService', () => {
  let service: PaycardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaycardsService],
    }).compile();

    service = module.get<PaycardsService>(PaycardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
