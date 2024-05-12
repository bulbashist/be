import { Test, TestingModule } from '@nestjs/testing';
import { ProductManufacturersController } from './product-manufacturers.controller';
import { ProductManufacturersService } from './product-manufacturers.service';

describe('ProductManufacturersController', () => {
  let controller: ProductManufacturersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductManufacturersController],
      providers: [ProductManufacturersService],
    }).compile();

    controller = module.get<ProductManufacturersController>(
      ProductManufacturersController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
