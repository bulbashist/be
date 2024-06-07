import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { sortVariants } from './types';
import { Comment } from 'src/comments/entities/comment.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private _repo: Repository<Product>,
  ) {
    setInterval(() => {
      this._repo.query('SELECT 1');
    }, 1000);
  }

  async create(createProductDto: CreateProductDto, userId: number) {
    const product = {
      ...createProductDto,
      seller: { id: userId },
    };
    return this._repo.save(product);
  }

  async findAll(page: number, sort = 0, amount = 12) {
    const ptQuery = this._repo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.manufacturer', 'manufacturer')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.photos', 'photos')
      .leftJoinAndSelect('product.comments', 'comments');

    if (sort) {
      const sv = sortVariants.find((sv) => sv.value === sort);
      ptQuery.orderBy(sv.name, sv.direction);
    }

    if (page) {
      ptQuery.take(amount).skip((page - 1) * amount);
    }

    const res = await ptQuery.getMany();
    return res.map((product) => this.transformProduct(product));
  }

  async findByText(text = '', page = 1, amount = 12) {
    const ptQuery = this._repo
      .createQueryBuilder('product')
      .where('MATCH(product.name) AGAINST (:text IN BOOLEAN MODE)')
      .orWhere('MATCH(product.description) AGAINST (:text IN BOOLEAN MODE)')
      .leftJoinAndSelect('product.manufacturer', 'manufacturer')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.photos', 'photos')
      .leftJoinAndSelect('product.comments', 'comments')
      .setParameter('text', text);

    if (page) {
      ptQuery.take(amount).skip((page - 1) * amount);
    }

    const res = await ptQuery.getMany();
    return res.map((product) => this.transformProduct(product));
  }

  async findBySeller(sellerId: number, page?: number, sort = 0, amount = 4) {
    const ptQuery = this._repo
      .createQueryBuilder('product')
      .leftJoin('product.seller', 'seller')
      .addSelect(['seller.id', 'seller.name'])
      .where('seller.id = :sellerId', { sellerId })
      .leftJoinAndSelect('product.manufacturer', 'manufacturer')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.photos', 'photos')
      .leftJoinAndSelect('product.comments', 'comments');

    if (sort) {
      const sv = sortVariants.find((sv) => sv.value === sort);
      ptQuery.orderBy(sv.name, sv.direction);
    }

    if (page) {
      ptQuery.take(amount).skip((page - 1) * amount);
    }

    const res = await ptQuery.getMany();
    return res.map((product) => this.transformProduct(product));
  }

  async findOne(id: number) {
    return this._repo
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
      .getOneOrFail()
      .then((res) => this.transformProduct(res, true));
  }

  async findByCategory(categoryName: string, page = 1, sort = 0, amount = 12) {
    const ptQuery = this._repo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.manufacturer', 'manufacturer')
      .leftJoinAndSelect('product.category', 'category')
      .where('category.name = :categoryName', { categoryName })
      .leftJoinAndSelect('product.photos', 'photos')
      .leftJoinAndSelect('product.comments', 'comments');

    if (sort) {
      const sv = sortVariants.find((sv) => sv.value === sort);
      ptQuery.orderBy(sv.name, sv.direction);
    }

    if (page) {
      ptQuery.take(amount).skip((page - 1) * amount);
    }

    const res = await ptQuery.getMany();
    return res.map((product) => this.transformProduct(product));
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return await this._repo.save({ id, ...updateProductDto });
  }

  async remove(id: number) {
    const product = await this._repo.find({ where: { id } });
    return this._repo.remove(product);
  }

  transformProduct(product: Product, withComments = false) {
    const updProduct = {
      ...product,
      avgRating: this.getAverage(product.comments),
      totalComms: product.comments.length,
    };
    if (!withComments) {
      delete updProduct.comments;
    }
    return updProduct;
  }

  getAverage(arr: Comment[]) {
    if (arr.length === 0) return 0;

    return +(
      arr.reduce((sum, curr) => sum + curr.rating, 0) / arr.length
    ).toFixed(2);
  }
}
