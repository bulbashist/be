import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private _repo: Repository<Order>,

    @InjectRepository(Product)
    private _prepo: Repository<Product>,
  ) {}

  async create(dto: CreateOrderDto) {
    const data: CreateOrderDto = {
      ...dto,
      products: await Promise.all(
        dto.products.map(async (pop) => {
          const res = this._prepo
            .findOne({
              where: { id: pop.product.id },
            })
            .then((res) => res.price);
          return {
            ...pop,
            sum: pop.count * (await res),
          };
        }),
      ),
    };

    return this._repo.save(data);
  }

  async findAll(page: number, amount = 6) {
    const ptQuery = this._repo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.products', 'pops')
      .leftJoinAndSelect('order.office', 'office')
      .leftJoinAndSelect('order.status', 'status')
      .leftJoinAndSelect('pops.product', 'product')
      .orderBy('order.date', 'ASC');

    if (page) {
      ptQuery.take(amount).skip((page - 1) * amount);
    }

    return ptQuery.getMany();
  }

  async findBySeller(sellerId: number) {
    return this._repo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.products', 'pops')
      .leftJoinAndSelect('pops.product', 'product')
      .leftJoin('product.seller', 'seller')
      .where('seller.id = :id', { id: sellerId })
      .getMany();
  }

  async findOne(id: number) {
    return this._repo.findOne({
      where: { id },
      relations: { office: true, status: true },
    });
  }

  async update(updateOrderDto: UpdateOrderDto) {
    return this._repo.save(updateOrderDto);
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    return this._repo.remove(order);
  }
}
