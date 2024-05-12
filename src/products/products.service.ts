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

  async create(createProductDto: CreateProductDto, userId: number) {
    const product = {
      ...createProductDto,
      seller: { id: userId },
    };
    console.log(product);
    return await this._repo.save(product);
  }

  async findAll(page = 1, perPage = 12) {
    const res = await this._repo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.manufacturer', 'manufacturer')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.photos', 'photos')
      .leftJoinAndSelect('product.comments', 'comments')
      .skip((page - 1) * perPage)
      .take(perPage)
      .getMany();

    return res.map((product) => this.transformProduct(product));
  }

  async findByText(text = '') {
    const res = await this._repo
      .createQueryBuilder('product')
      .where('MATCH(product.name) AGAINST (:text IN BOOLEAN MODE)')
      .orWhere('MATCH(product.description) AGAINST (:text IN BOOLEAN MODE)')
      .leftJoinAndSelect('product.manufacturer', 'manufacturer')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.photos', 'photos')
      .leftJoinAndSelect('product.comments', 'comments')
      .setParameter('text', text)
      .getMany();

    return res.map((product) => this.transformProduct(product));
  }

  async findBySeller(sellerId: number, page = 1, amount = 4) {
    const res = await this._repo
      .createQueryBuilder('product')
      .leftJoin('product.seller', 'seller')
      .addSelect(['seller.id', 'seller.name'])
      .where('seller.id = :sellerId', { sellerId })
      .leftJoinAndSelect('product.manufacturer', 'manufacturer')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.photos', 'photos')
      .leftJoinAndSelect('product.comments', 'comments')
      .take(amount)
      .skip((page - 1) * amount)
      .getMany();

    return res.map((product) => this.transformProduct(product));
  }

  async findOne(id: number) {
    const res = await this._repo
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .leftJoin('product.seller', 'seller')
      .addSelect(['seller.id', 'seller.name'])
      .leftJoinAndSelect('product.manufacturer', 'manufacturer')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.photos', 'photos')
      .leftJoinAndSelect('product.comments', 'comments')
      .leftJoin('comments.user', 'user')
      .addSelect(['user.id', 'user.name'])
      .getOne();

    return this.transformProduct(res, true);
  }

  async findByCategory(categoryName: string, page = 1, perPage = 12) {
    const res = await this._repo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.manufacturer', 'manufacturer')
      .leftJoinAndSelect('product.category', 'category')
      .where('category.name = :categoryName', { categoryName })
      .leftJoinAndSelect('product.photos', 'photos')
      .leftJoinAndSelect('product.comments', 'comments')
      .skip((page - 1) * perPage)
      .take(perPage)
      .getMany();

    return res.map((product) => this.transformProduct(product));
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return await this._repo.save(updateProductDto);
  }

  async remove(id: number) {
    const product = await this._repo.find({ where: { id } });
    return await this._repo.remove(product);
  }

  transformProduct(product: Product, withComments = false) {
    const updProduct = {
      ...product,
      avgRating:
        product.comments.length > 0
          ? product.comments.reduce((sum, curr) => sum + curr.rating, 0) /
            product.comments.length
          : undefined,
    };
    if (!withComments) {
      delete updProduct.comments;
    }
    return updProduct;
  }
}
