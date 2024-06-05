import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateStatDto } from './dto/create-stat.dto';
import { UpdateStatDto } from './dto/update-stat.dto';
import { OrdersService } from 'src/orders/orders.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { Repository } from 'typeorm';

@Controller('stats')
export class StatsController {
  constructor(
    @InjectRepository(Order)
    private _repo: Repository<Order>,
  ) {}

  @Get()
  async findAll(
    @Query('seller', ParseIntPipe) sellerId: number,
    @Query('product', ParseIntPipe) productId: number,
  ) {
    const res = await this._repo
      .createQueryBuilder('order')
      .select('order.date', 'date')
      .leftJoin('order.products', 'pops')
      .addSelect('pops.count', 'count')
      .addSelect('pops.sum', 'sum')
      .leftJoin('pops.product', 'product')
      .leftJoin('product.seller', 'seller')
      .where('product.id = :productId', { productId })
      .andWhere('seller.id = :sellerId', { sellerId })
      .getRawMany();

    return this.mergeObjectsByDate(res);
  }

  mergeObjectsByDate(objects: any[]) {
    const result = [];

    objects.forEach((obj) => {
      const date = new Date(obj.date);
      const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      const item = result.find((obj) => obj.key === dayKey);
      if (!item) {
        result.push({ ...obj, key: dayKey });
      } else {
        item.count += obj.count;
        item.total += obj.total;
      }
    });

    return result.map((obj) => {
      delete obj.key;
      return obj;
    });
  }
}
