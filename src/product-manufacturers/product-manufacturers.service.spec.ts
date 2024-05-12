import { Test, TestingModule } from '@nestjs/testing';
import { ProductManufacturersService } from './product-manufacturers.service';

describe('ProductManufacturersService', () => {
  let service: ProductManufacturersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductManufacturersService],
    }).compile();

    service = module.get<ProductManufacturersService>(
      ProductManufacturersService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
