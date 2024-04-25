import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private _repo: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    return await this._repo.save(createOrderDto);
  }

  async findAll() {
    return await this._repo.find({
      order: {
        date: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    return await this._repo.findOne({ where: { id } });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return await this._repo.save({ id, ...updateOrderDto });
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    return await this._repo.remove(order);
  }
}
