import { Injectable } from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';
import { ProductCategory } from './entities/product-category.entity';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(Product)
    private _pRepo: Repository<Product>,

    @InjectRepository(ProductCategory)
    private _cRepo: Repository<ProductCategory>,
  ) {}

  create(createProductCategoryDto: CreateProductCategoryDto) {
    return 'This action adds a new productCategory';
  }

  async findAll() {
    return await this._cRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} productCategory`;
  }

  async getProducts(categoryName: string, page = 1, perPage = 12) {
    return await this._pRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.manufacturer', 'manufacturer')
      .leftJoinAndSelect('product.category', 'category')
      .where('category.name = :categoryName', { categoryName })
      .leftJoinAndSelect('product.photos', 'photos')
      .skip((page - 1) * perPage)
      .take(perPage)
      .getMany();
  }

  update(id: number, updateProductCategoryDto: UpdateProductCategoryDto) {
    return `This action updates a #${id} productCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} productCategory`;
  }
}
