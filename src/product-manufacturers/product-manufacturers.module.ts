import { Module } from '@nestjs/common';
import { ProductManufacturersService } from './product-manufacturers.service';
import { ProductManufacturersController } from './product-manufacturers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductManufacturer } from './entities/product-manufacturer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductManufacturer])],
  controllers: [ProductManufacturersController],
  providers: [ProductManufacturersService],
})
export class ProductManufacturersModule {}
