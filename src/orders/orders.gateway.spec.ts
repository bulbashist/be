import { Test, TestingModule } from '@nestjs/testing';
import { Orders2Gateway } from './orders.gateway';
import { Orders2Service } from './orders2.service';

describe('Orders2Gateway', () => {
  let gateway: Orders2Gateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Orders2Gateway, Orders2Service],
    }).compile();

    gateway = module.get<Orders2Gateway>(Orders2Gateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
