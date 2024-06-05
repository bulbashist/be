import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { OrderStatus } from '../entities/order-status.entity';

export class UpdateOrderDto {
  id: number;
  status: {
    id: number;
  };
}
