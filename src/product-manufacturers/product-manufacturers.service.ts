import { Injectable } from '@nestjs/common';
import { CreateProductManufacturerDto } from './dto/create-product-manufacturer.dto';
import { UpdateProductManufacturerDto } from './dto/update-product-manufacturer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductManufacturer } from './entities/product-manufacturer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductManufacturersService {
  constructor(
    @InjectRepository(ProductManufacturer)
    private _repo: Repository<ProductManufacturer>,
  ) {}

  create(createProductManufacturerDto: CreateProductManufacturerDto) {
    return 'This action adds a new productManufacturer';
  }

  async findAll() {
    return await this._repo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} productManufacturer`;
  }

  update(
    id: number,
    updateProductManufacturerDto: UpdateProductManufacturerDto,
  ) {
    return `This action updates a #${id} productManufacturer`;
  }

  remove(id: number) {
    return `This action removes a #${id} productManufacturer`;
  }
}
