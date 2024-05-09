import { appendFile } from 'fs/promises';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

export class OrderLogger {
  private filename = 'orders.log';

  public logNewOrder(dto: CreateOrderDto) {
    const msg = `${dto.date}: Order #${dto.id} was ordered by user (id#${dto.user.id})`;
    appendFile(this.filename, msg);
  }

  public logOrderUpdate(dto: UpdateOrderDto) {
    const msg = `${new Date(Date.now()).toISOString()}: Order #${
      dto.id
    } was updated`;
    appendFile(this.filename, msg);
  }
}
