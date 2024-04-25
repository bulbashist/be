import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private _repo: Repository<Product>,
  ) {}

  create(createProductDto: CreateProductDto) {
    return this._repo.save(createProductDto);
  }

  async findAll() {
    return await this._repo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.manufacturer', 'manufacturer')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.photos', 'photos')
      .getMany();
  }

  async findByText(text = '') {
    const products = await this._repo
      .createQueryBuilder('product')
      .where('MATCH(product.name) AGAINST (:text IN BOOLEAN MODE)')
      .orWhere('MATCH(product.description) AGAINST (:text IN BOOLEAN MODE)')
      .leftJoinAndSelect('product.manufacturer', 'manufacturer')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.photos', 'photos')
      .setParameter('text', text)
      .getMany();

    return products;
  }

  async findOne(id: number) {
    return await this._repo
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .leftJoinAndSelect('product.manufacturer', 'manufacturer')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.photos', 'photos')
      .leftJoinAndSelect('product.comments', 'comments')
      .leftJoin('comments.user', 'user')
      .addSelect(['user.id', 'user.name'])
      .getOne();
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return await this._repo.save(updateProductDto);
  }

  async remove(id: number) {
    const product = await this._repo.find({ where: { id } });
    return await this._repo.remove(product);
  }
}
